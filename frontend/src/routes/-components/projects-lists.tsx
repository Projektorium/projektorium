import { PaginatedList } from "@/components/ui/static-card-section";
import { Separator } from "@chakra-ui/react";
import { useNavigateScroll } from "@/components/ui/link-scroll";
import { ProjectPublic } from "@/client";
import React from "react";
import { useProjectLike } from "@/routes/-like-utils/queries";
import { useProjectLikeToggle } from "@/routes/-like-utils/mutations";
import { ProjectCard } from "./project-card";
import { useSendMessage } from "../-message-utils/mutations";

interface ProjectsListProps {
  projects: ProjectPublic[];
  navigate: ReturnType<typeof useNavigateScroll>;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, navigate }) => {
  const projectIds = projects.map(project => project.id)
  const projectLikes = useProjectLike({ project_ids: projectIds})
  const { toggleProjectLike } = useProjectLikeToggle();
  const { sendMessage } = useSendMessage();
  return (
    <PaginatedList
      itemsPerPage={4}
      separator={<Separator />}
      w="100%"
      cards={
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isLiked={projectLikes[project.id] || false}
            navigate={navigate}
            toggleProjectLike={toggleProjectLike}
            onSendMessage={sendMessage}
          />
        ))
      }
    />)
}
