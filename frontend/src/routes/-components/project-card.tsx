import { ProjectPublic } from "@/client";
import { ContentCardHeader, DefaultStatusBadge } from "@/components/ui/content-card-headers";
import { HeartButton, ContactButton } from "@/components/ui/icon-buttons";
import { useNavigateScroll } from "@/components/ui/link-scroll";
import { MessageModal } from "@/components/ui/modal-message";
import { HoverContentCard } from "./hover-content-card";
import { TagListWrapper } from "./tag-list-wrapper";
import React from "react";
import {translateStatusToPolish} from "@/utils.ts";

export interface ProjectCardsProps {
  project: ProjectPublic;
  isLiked: boolean;
  navigate: ReturnType<typeof useNavigateScroll>;
  toggleProjectLike: (projectId: string, isLiked : boolean) => void;
  onSendMessage: (message: string, receiverId: string) => void;
}


// Change the return type to explicitly be an array of ReactElements
export const ProjectCard: React.FC<ProjectCardsProps> = ({ project, isLiked, navigate, toggleProjectLike, onSendMessage }) => {
  return (
      <HoverContentCard
        key={project.id}
        title={project.title}
        titleProps={{
          onClick: () => navigate({ to: "/project/$projectId", params: { projectId: project.id } }),
          style: { cursor: "pointer" },
        }}
        description={project.description ?? ""}
        descriptionProps={{
          mt: "12px",
          mb: "24px",
          fontWeight: "500",
          onClick: () => navigate({ to: "/project/$projectId", params: { projectId: project.id } }),
          style: { cursor: "pointer" },
        }}
        footerList={<TagListWrapper tags={project.tags.map((tag) => tag.name)} limit={4} />}
        cardVariant="header"
        actionElement={
          <ContentCardHeader
            headerContent={<DefaultStatusBadge status={translateStatusToPolish(project.project_status)} />}
            icons={[
              <HeartButton
                key="heart"
                initialLiked={isLiked}
                onClick={() => toggleProjectLike(project.id, isLiked)}
              />,
              <MessageModal
                key="contact"
                headerText="Nawiąż Kontakt"
                trigger={<ContactButton text="Kontakt" />}
                placeholder="Wpisz treść wiadomości..."
                sendButtonText="Wyślij"
                onSend={(message: string) => onSendMessage(message, project.owner_id)}
              />,
            ]}
          />
        }
      />
    );
};