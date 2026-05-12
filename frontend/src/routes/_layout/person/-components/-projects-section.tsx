import React from "react";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll.tsx";
import { StaticSectionCardWrapper } from "@/routes/-components/static-section-wrapper";
import { ProjectPublic } from "@/client";
import { ProjectCard } from "@/routes/-components/project-card";
import { useProjectLikeToggle } from "@/routes/-like-utils/mutations";
import { useProjectLike } from "@/routes/-like-utils/queries";
import { useSendMessage } from "@/routes/-message-utils/mutations";

export const ProjectsSection: React.FC<{
  projects: ProjectPublic[];
  navigate: ReturnType<typeof useNavigate>;
}> = ({ projects, navigate }) => {
  const projectIds = projects.map(project => project.id)
  const projectLikes = useProjectLike({ project_ids: projectIds})

  const {toggleProjectLike} = useProjectLikeToggle();
  const { sendMessage } = useSendMessage();
  return (
    <StaticSectionCardWrapper
      cardSectionProps={{ title: "Aktualne projekty" }}
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
    />
  );
};
