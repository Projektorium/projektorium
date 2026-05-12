import React, { useState } from "react";
import {AvatarFallback, AvatarImage, AvatarRoot, Box, Image, Text} from "@chakra-ui/react";
import { ModalFileUpload } from "@/components/ui/modal-file-upload.tsx";
import WhitePlusIcon from "@/assets/icons/plus-white.svg";
import { ContentCardHeader, ProfilePage } from "@/components/ui/content-card-headers.tsx";
import { MessageModal } from "@/components/ui/modal-message.tsx";
import { ContactButton, EditBigButton, HeartButton } from "@/components/ui/icon-buttons.tsx";
import { UserPublic } from "@/client";
import { getImageUrl } from "@/utils";
import { useUserLike } from "@/routes/-like-utils/queries";
import { useUserLikeToggle } from "@/routes/-like-utils/mutations";
import { useSendMessage } from "@/routes/-message-utils/mutations";

interface ProfileHeaderProps {
  profile: UserPublic;
  editable: boolean;
  onAcceptName: (name: string) => void;
  onSendFiles: (files: File[]) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, editable, onAcceptName, onSendFiles }) => {
  const [name, setName] = useState(profile.name + " " + profile.last_name);
  const userLikes = useUserLike({ user_ids: [profile.id] });
  const {toggleUserLike} = useUserLikeToggle();
  const { sendMessage } = useSendMessage();
  const isLiked = userLikes[profile.id] || false;

  // Render the profile photo with optional upload capability
  const renderProfilePhoto = () => (
    <Box height="80px" width="80px" position="relative">
      <AvatarRoot size="full">
        <AvatarFallback name={profile.name + " " + profile.last_name} css={{fontSize: "24px"}}/>
        <AvatarImage src={getImageUrl(profile.profile_image) ?? undefined} alt="Profile Photo" />
      </AvatarRoot>
      {editable && renderPhotoUploader()}
    </Box>
  );

  // Render the photo upload overlay (only for editable profiles)
  const renderPhotoUploader = () => (
    <ModalFileUpload
      fileUploadProps={{ maxFiles: 1 }}
      headerText="Wgraj zdjęcie profilowe"
      trigger={
        <Box
          position="absolute"
          borderRadius="full"
          top="0"
          left="0"
          w="100%"
          h="100%"
          bg="blackAlpha.600"
          opacity="0"
          transition="opacity 0.3s"
          _hover={{ opacity: 1 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ cursor: "pointer" }}
        >
          <Image w="30px" h="30px" src={WhitePlusIcon} />
        </Box>
      }
      sendButtonText="Zatwierdź"
      onSend={onSendFiles}
      dropzoneContent={<Text>Przeciągnij plik tutaj</Text>}
    />
  );

  // Render the name display component
  const renderNameDisplay = () => (
    <Text fontSize="1.75rem" fontWeight="bold" color="text.primary">
      {name}
    </Text>
  );

  // Render action icons based on whether the profile is editable
  const renderActionIcons = () => {
    if (editable) {
      return [
        <MessageModal
          key="edit-name"
          initialMessage={name}
          headerText="Edytuj imię i nazwisko"
          trigger={<EditBigButton text="Edytuj imię" />}
          placeholder="Wpisz tutaj imię i nazwisko"
          sendButtonText="Edytuj"
          onSend={(newName) => {onAcceptName(newName); setName(newName)}}
        />,
      ];
    }

    return [
      <HeartButton
        key="heart"
        initialLiked={isLiked}
        onClick={() => toggleUserLike(profile.id, isLiked)}
      />,
      <MessageModal
        key="contact"
        headerText="Nawiąż Kontakt"
        trigger={<ContactButton text="Kontakt" />}
        placeholder="Wpisz treść wiadomości..."
        sendButtonText="Wyślij"
        onSend={(message) => sendMessage(message, profile.id)}
      />,
    ];
  };

  // Profile display configuration
  const profileConfig = {
    profilePhoto: renderProfilePhoto(),
    name: renderNameDisplay(),
    gap: "24px",
  };

  return (
    <ContentCardHeader
      mt="48px"
      mb="24px"
      headerContent={<ProfilePage {...profileConfig} />}
      icons={renderActionIcons()}
    />
  );
};

