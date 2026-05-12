import { createFileRoute} from "@tanstack/react-router";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll.tsx";

import {Separator, Text} from "@chakra-ui/react";
import {OptionSection} from "@/components/ui/option-section.tsx";
import { ProjectsList } from "@/routes/-components/projects-lists";
import { MembersList } from "@/routes/-components/members-lists";
import { useLiked } from "@/routes/-like-utils/queries";
import { SearchListSkeleton } from "@/routes/-components/search-list/search-list-skeleton";
import { Suspense } from "react";

export const Route = createFileRoute("/_layout/_auth/saved")({
  component: Top,
});


function Top() {
  return (
    <Suspense fallback={<SearchListSkeleton titleText="Ładuję❤️..."/>}>
      <LandingPage />
    </Suspense>
  )
}

function LandingPage() {
  const navigate = useNavigate();
  const {likedUsers, likedProjects} = useLiked();

  const stackProps = {
    titleSeparator: <Separator width="100%" />,
    width: "800px",
    mt: "40px"
  };

  const tabElements = [
    {
      tabValue: "projects",
      tabName: <Text fontSize="xl"
                     fontWeight="600">Projekty ({likedProjects.length})</Text>,
      tabContent: <ProjectsList projects={likedProjects} navigate={navigate} />,
    },
    {
      tabValue: "members",
      tabName: <Text fontSize="xl"
                     fontWeight="600">Osoby ({likedUsers.length})</Text>,
      tabContent: <MembersList people={likedUsers} navigate={navigate} />,
    },
  ];

  return (
      <OptionSection
        tabElements={tabElements}
        defaultTab="projects"
        titleElements={
          <Text fontWeight="600" fontSize="xl" alignContent="start" mt="-6px">
            Zapisane
          </Text>
        }
        {...stackProps}
      />

  );
}

