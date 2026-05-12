import { Text } from "@chakra-ui/react";

import { ContentCardHeader } from "@/components/ui/content-card-headers";
import {ContactButton, EditBigButton, HeartButton, RemoveBigButton} from "@/components/ui/icon-buttons";
import { MessageModal } from "@/components/ui/modal-message";
import React from "react";
import {ProjectPublic, ProjectStatus} from "@/client";
import { useProjectLikeToggle } from "@/routes/-like-utils/mutations";
import { useProjectLike } from "@/routes/-like-utils/queries";
import {ChangeStatusModal} from "@/components/ui/modal-project.tsx";

interface ProjectHeaderProps {
  project: ProjectPublic;
  loggedIn: boolean;
  editable: boolean;
  onEditTitle: (title: string) => void;
  onEditStatus: (status: ProjectStatus) => void;
  onDelete: () => void;
  onSendMessage: (message: string, user_id: string) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, editable, onEditTitle, onEditStatus, onDelete, loggedIn, onSendMessage }) => {
  const userLikes = useProjectLike({ project_ids: [project.id] });
  const {toggleProjectLike} = useProjectLikeToggle();
  const isLiked = userLikes[project.id] || false;

  const renderIcons = () => {
    if (!loggedIn) {
      // Don't show any icons if user is not logged in
      return [];
    }

    if (editable) {
      return [
        <MessageModal
          key="edit-title"
          initialMessage={project.title}
          headerText="Edytuj tytuł projektu"
          trigger={<EditBigButton text="Tytuł" />}
          placeholder="Wpisz tutaj tytuł"
          sendButtonText="Edytuj"
          onSend={onEditTitle}
        />,
        <ChangeStatusModal
          key="edit-status"
          initialStatus={project.project_status}
          headerText="Edytuj status projektu"
          trigger={<EditBigButton text="Status" />}
          sendButtonText="Edytuj"
          cancelButtonText="Anuluj"
          onSend={onEditStatus}
        />,
        <RemoveBigButton text="Usuń" onClick={onDelete}/>
      ];
    }

    return [
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
      />
    ];
  };
  return (
    <ContentCardHeader
      mt="48px"
      mb="24px"
      gap="100px"
      headerContent={
        <Text fontWeight="600" fontSize="28px" color="text.primary" maxWidth="55%">
          {project.title}
        </Text>
      }
      icons={renderIcons()}
    />
  );
};
