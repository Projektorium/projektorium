import {createFileRoute} from "@tanstack/react-router";
import {useNavigateScroll as useNavigate} from "@/components/ui/link-scroll.tsx";
import {StaticSectionCardWrapper} from "@/routes/-components/static-section-wrapper";
import {TagListWrapper} from "@/routes/-components/tag-list-wrapper";
import {ContentCardHeader, DefaultStatusBadge} from "@/components/ui/content-card-headers";
import {AddButton,} from "@/components/ui/icon-buttons";
import {HoverContentCard} from "@/routes/-components/hover-content-card";
// import { Flex, Image, Text } from "@chakra-ui/react";
// import XIcon from "@/assets/icons/x.svg";
// import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu.tsx";
// import { useState } from "react";
import {ProfilesService, ProjectCreate, ProjectsService} from "@/client";
import {QueryClient, queryOptions, skipToken, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import NotFound from "@/components/Common/NotFound";
import {AddProjectModal} from "@/components/ui/modal-project.tsx";
import {translateStatusToPolish} from "@/utils.ts";

const getQueryOptions = ( userId?: string) => {
  return queryOptions({
    queryKey: ["my_projects",  userId],
    queryFn: userId ? () => ProfilesService.readUserProjects({ userId }) : skipToken,
    placeholderData: (prevData) => prevData,
  })
}

export const useProjectMutation = (queryClient: QueryClient, userId?: string) => {
  return useMutation({
    mutationFn: (createInfo: ProjectCreate) =>
      ProjectsService.createProject({
        requestBody: createInfo
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["my_projects", userId]});
    }
  });
}

export const Route = createFileRoute("/_layout/_auth/my-projects")({
  component: MyProjectsPage,
});

  // const menuItems = (project: ProjectPublic, onClick: () => void) => [
  //   {
  //     value: "Usuń",
  //     element:
  //       <Flex
  //         gap="12px"
  //         p="12px"
  //         w="100%"
  //         h="100%"
  //         onClick={onClick}
  //       >
  //         <Image opacity="50%" w="20px" src={XIcon} />
  //         <Text fontSize="md" fontWeight="500">Usuń</Text>
  //       </Flex>
  //   },
  // ] as ("separator" | ContextMenuItem)[];

function MyProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {user: currentUser} = useAuth();


  const { data, isLoading } = useQuery({
    ...getQueryOptions( currentUser?.id ),
  });

  const createProject = useProjectMutation(queryClient, currentUser?.id);

  if (isLoading) return "Loading";

  if (!currentUser) {
    return <NotFound />
  }

  const addProjectModal = <AddProjectModal
    headerText="Dodaj projekt"
    trigger={<AddButton />}
    titlePlaceholder="Tytuł"
    descriptionPlaceholder="Opisz projekt..."
    cancelButtonText="Anuluj"
    sendButtonText="Akceptuj"
    onSend={(title: string, description: string, tags: string[])=> createProject.mutate({title, description, tags: (tags.map((name) => ({ name })))})}
  />

  const projects = data?.projects || []
  
  return (
    <StaticSectionCardWrapper
      cardSectionProps={{
        title: "Moje projekty",
        titleElements: addProjectModal,
        width: "100%",
        mt: "40px"
      }}
      listProps={{
        w: "100%",
        topStackProps: { w: "100%", mb: "-24px" }
      }}
      cards={projects.map((project) => (
        <HoverContentCard
          key={project.id}
          title={project.title}
          titleProps={{
            onClick: (() =>
              navigate({
                to: "/project/$projectId",
                params: { projectId: project.id },
              })
            ),
            style: { cursor: "pointer" },
          }}
          description={project.description ?? "FIXME"} // TODO: if no description
          descriptionProps={{
            mt: "12px",
            mb: "24px",
            fontWeight: "500",
            onClick: (() =>
              navigate({
                to: "/project/$projectId",
                params: { projectId: project.id },
              })
            ),
            style: { cursor: "pointer" }
          }}
          footerList={<TagListWrapper tags={project.tags.map(tag => tag.name)} limit={4} />}
          cardVariant="header"
          actionElement={(
            <ContentCardHeader
              onClick={() =>
                navigate({
                  to: "/project/$projectId",
                  params: { projectId: project.id },
                })
              }
              headerContent={<DefaultStatusBadge status={translateStatusToPolish(project.project_status)} />}
              // icons={
              //   <ContextMenu
              //     trigger={
              //       <Flex
              //         direction="column"
              //         alignSelf="start"
              //         h="100%"
              //       >
              //         <DotsButton />
              //       </Flex>
              //     }
              //     // menuItems={menuItems(project)}
              //     // menuItemProps={{ w: "114px" }}
              //   />
              // }
            />
          )}
        />)
      )}
    />
  );
}
