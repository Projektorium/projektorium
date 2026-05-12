import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";

// Components
import { ProjectHeader } from "./-components/project-header";
import { AboutSection } from "@/routes/-components/about-section";
import { PositionsSection } from "@/routes/_layout/project/-components/positions-section";
// For attachments: import { AttachmentsSection } from "./-attachment-section";

// Hooks
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { getProjectQueryOptions, getPositionsQueryOptions, getParticipantsQueryOptions } from "./-queries";
// For attachments: import { getApplicantsQueryOptions } from "./-queries";
import { useProjectMutations } from "./-mutations";
import { ProjectRightsService } from "@/client/types";
import { ParticipantsSection } from "./-components/participant-section.tsx/participants-section";
// For attachments: import { AttachmentsSection } from "./-components/attachment-section";
import { useSendMessage } from "@/routes/-message-utils/mutations";
import {ProjectStatus} from "@/client";
import {useNavigateScroll as useNavigate} from "@/components/ui/link-scroll.tsx";

const projectSchema = z.object({
  projectId: z.string().uuid(),
});

// Route definition
export const Route = createFileRoute("/_layout/project/$projectId")({
  component: ProjectPage,
  params: {
    parse: projectSchema.parse,
  },
});

function ProjectPage() {
  const { projectId } = Route.useParams() as { projectId: string };
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useAuth();
  const { sendMessage } = useSendMessage();

  // Fetch data
  const [
    { data: project },
    {
      data: { positions },
    },
    { data: participants },
    // { data: attachments }
  ] = useSuspenseQueries({
    queries: [
      getProjectQueryOptions({ projectId }),
      getPositionsQueryOptions({ projectId }),
      getParticipantsQueryOptions({ projectId }),
      // getAttachmentsQueryOptions({ projectId })
    ],
  });

  // Mutations
  const { updateProject, deleteProject, createPosition, updatePosition, deletePosition } = useProjectMutations(projectId, queryClient);

  // Event handlers
  const handleDescTagUpdate = (description: string, tags: string[]) => {
    const descriptionChanged = description !== project.description;
    const tagsChanged =
      tags.length !== project.tags.length || !tags.every((value, index) => value === project.tags[index].name);

    if (!descriptionChanged && !tagsChanged) return;

    updateProject.mutate({
      description: descriptionChanged ? description : undefined,
      tags: tagsChanged ? tags.map((name) => ({ name })) : undefined,
    });
  };

  const handleTitleUpdate = (title: string) => {
    if (title === project.title) return;
    updateProject.mutate({ title });
  };

  const handleStatusUpdate = (project_status: ProjectStatus) => {
    if (project_status === project.project_status) return;
    updateProject.mutate({ project_status });
  };

  const handleDelete = () => {
    if (window.confirm(`Czy na pewno chcesz usunąć ten projekt?`)) {
      deleteProject.mutate();
      navigate({to: "/my-projects"});
    }
  };

  // Permissions
  const editable = ProjectRightsService.canWrite(project.permissions);
  const isAdmin = ProjectRightsService.isAdmin(project.permissions);

  return (
    <>
      <ProjectHeader
        project={project}
        editable={editable}
        onEditTitle={handleTitleUpdate}
        onEditStatus={handleStatusUpdate}
        loggedIn={isLoggedIn()}
        onSendMessage={sendMessage}
        onDelete={handleDelete}
      />

      <AboutSection
        editable={editable}
        title="O Projekcie"
        titleProps={{ fontSize: "xl", fontWeight: "600", mt: "0" }}
        bodyProps={{ p: "40px" }}
        description={project.description || ""}
        tags={project.tags.map((tag) => tag.name)}
        onAccept={handleDescTagUpdate}
      />

      { ProjectRightsService.checkIfActive(project.project_status) &&
        <PositionsSection
          editable={editable}
          owner_id={project.owner_id}
          title="Otwarte Pozycje"
          positions={positions || []}
          onAddPosition={(title: string, description: string) => createPosition.mutate({ title, description })}
          onEditPosition={({ title, description, id }) =>
            updatePosition.mutate({
              title,
              description,
              positionId: id,
            })
          }
          onRemovePosition={(positionId: string) => deletePosition.mutate({ projectId, positionId })}
        />
      }

      <ParticipantsSection
        editable={editable}
        participants={participants.participants}
        projectId={projectId}
        isAdmin={isAdmin}
      />
      {/* <AttachmentsSection 
        editable={editable} 
        attachments={attachments || []} // Pass fetched attachments
      /> */}
    </>
  );
}
