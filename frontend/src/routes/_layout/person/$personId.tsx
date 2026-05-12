import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AboutSection } from "@/routes/-components/about-section";
import { CARD_PADDING_X } from "@/routes/_layout.tsx";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll.tsx";
import { ProfileHeader } from "@/routes/_layout/person/-components/-profile-header";
import { ProjectsSection } from "@/routes/_layout/person/-components/-projects-section";
import useAuth from "@/hooks/useAuth";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { getProfileQueryOptions, getProjectQueryOptions } from "./-quries";
import { useProfileMutations } from "./-mutations";

const personSchema = z.object({
  personId: z.string().uuid(),
});

export const Route = createFileRoute("/_layout/person/$personId")({
  component: PersonPage,
  params: { parse: (params) => personSchema.parse(params) },
});

function PersonPage() {
  const { personId } = Route.useParams() as { personId: string };
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { updateProfile, uploadProfileImage } = useProfileMutations(personId, queryClient);

  const [
    { data: person },
    {
      data: { projects },
    },
  ] = useSuspenseQueries({
    queries: [getProfileQueryOptions({ personId }), getProjectQueryOptions({ personId })],
  });

  const editable = user ? personId == user.id : false;

  const handleDescTagUpdate = (description: string, tags: string[]) => {
    const descriptionChanged = description !== person.description;
    const tagsChanged =
      tags.length !== person.tags.length || !tags.every((value, index) => value === person.tags[index].name);

    if (!descriptionChanged && !tagsChanged) return;

    updateProfile.mutate({
      description: descriptionChanged ? description : undefined,
      tags: tagsChanged ? tags.map((name) => ({ name })) : undefined,
    });
  };

  const handleNameUpdate = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);

    let firstName = " ";
    let lastName = " ";

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length >= 2) {
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    if (fullName.trim().length == 0) {
      alert("Należy wprowadzić niepuste imię i nazwisko.");
    } else {
      updateProfile.mutate({
        name: firstName,
        last_name: lastName,
      });
    }
  };

  const handleProfileImageUpload = (files: File[]) => {
    if (files.length === 0) return;

    const profileImage = files[0];
    uploadProfileImage.mutate(profileImage);
  };

  return (
    <>
      <ProfileHeader
        profile={person}
        editable={editable}
        onAcceptName={handleNameUpdate}
        onSendFiles={handleProfileImageUpload}
      />
      <AboutSection
        editable={editable}
        title="O mnie"
        titleProps={{ fontSize: "xl", fontWeight: "600", mt: "0" }}
        bodyProps={{ p: CARD_PADDING_X }}
        description={person.description ?? ""}
        tags={person.tags.map((tag) => tag.name)}
        onAccept={handleDescTagUpdate}
      />
      <ProjectsSection projects={projects} navigate={navigate} />
    </>
  );
}
