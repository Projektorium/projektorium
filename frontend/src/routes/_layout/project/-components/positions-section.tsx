import React, { ComponentProps, useState } from "react";
import { AddPositionModal } from "@/components/ui/modal-project.tsx";
import { AddButton, DotsButton } from "@/components/ui/icon-buttons.tsx";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import EditIcon from "@/assets/icons/edit.svg";
import XIcon from "@/assets/icons/x.svg";
import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu.tsx";
import { StaticSectionCardWrapper } from "@/routes/-components/static-section-wrapper";
import { ContentCard } from "@/components/ui/content-card.tsx";
import { MessageModal } from "@/components/ui/modal-message.tsx";
import { PositionSchema } from "@/client";
import { useApplicationMutations } from "../-mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useSendMessage } from "@/routes/-message-utils/mutations";

export interface PositionsSectionProps {
  title: string;
  editable: boolean;
  positions?: PositionSchema[];
  onAddPosition: (title: string, description: string) => void;
  onRemovePosition: (id: string) => void;
  onEditPosition: (position: PositionSchema) => void;
  modalProps?: ComponentProps<typeof AddPositionModal>;
  owner_id: string;
}

interface PositionMenuProps {
  position: PositionSchema;
  onEdit: (position: PositionSchema) => void;
  onDelete: () => void;
  modalProps?: ComponentProps<typeof AddPositionModal>;
}

const positionMenuItems = (onEdit: () => void, onDelete: () => void) =>
  [
    {
      value: "Edytuj",
      element: (
        <Flex gap="12px" p="12px" w="100%" h="100%" onClick={onEdit}>
          <Image opacity="50%" w="20px" src={EditIcon} />
          <Text fontSize="md" fontWeight="500">
            {" "}
            Edytuj{" "}
          </Text>
        </Flex>
      ),
    },
    "separator",
    {
      value: "Usuń",
      element: (
        <Flex gap="12px" p="12px" w="100%" h="100%" onClick={onDelete}>
          <Image opacity="50%" w="20px" src={XIcon} />
          <Text fontSize="md" fontWeight="500">
            {" "}
            Usuń{" "}
          </Text>
        </Flex>
      ),
    },
  ] as ("separator" | ContextMenuItem)[];

const PositionMenuWrapper: React.FC<PositionMenuProps> = ({ position, modalProps, onEdit, onDelete }) => {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Flex direction="column" justify="center" align="end" h="100%" w="100%" pl="40px">
      <ContextMenu
        trigger={<DotsButton />}
        menuItems={positionMenuItems(() => setOpenEdit(true), onDelete)}
        menuItemProps={{ w: "114px" }}
      />
      <AddPositionModal
        externalOpen={openEdit}
        setExternalOpen={setOpenEdit}
        headerText="Edytuj pozycję"
        trigger={<div></div>}
        titlePlaceholder="Tytuł"
        descriptionPlaceholder="Opisz pozycje..."
        cancelButtonText="Anuluj"
        sendButtonText="Akceptuj"
        initialTitle={position.title}
        initialDescription={position.description ?? undefined}
        onSend={(title, description) => {
          onEdit({ title, description, id: position.id });
          setOpenEdit(false);
        }}
        {...modalProps}
      />
    </Flex>
  );
};

interface ContactModalProps {
  position: PositionSchema
  onSend: (message: string, positionId: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ position, onSend }) => (
  <MessageModal
    headerText="Aplikuj"
    trigger={
      <Flex pl="40px">
        <Button px="16px">Aplikuj</Button>
      </Flex>
    }
    placeholder="Napisz wiadomość"
    sendButtonText="Wyślij"
    onSend={(message: string) => onSend(message, position.id)}
  />
);

export const PositionsSection: React.FC<PositionsSectionProps> = ({
  title = "Otwarte Pozycje",
  editable,
  positions = [],
  onAddPosition,
  onRemovePosition,
  onEditPosition,
  modalProps,
  owner_id,
}) => {
  const queryClient = useQueryClient()
  const {applyToPosition} = useApplicationMutations(queryClient);
  const { sendMessage } = useSendMessage();

  const handleApplication = (message: string, positionId : string) => {
    if (message) {
      sendMessage(message, owner_id);
    }
    applyToPosition.mutate({positionId});
  }

  const addModalButton = (
    <AddPositionModal
      headerText="Dodaj pozycję"
      trigger={<AddButton />}
      titlePlaceholder="Tytuł"
      descriptionPlaceholder="Opisz pozycje..."
      cancelButtonText="Anuluj"
      sendButtonText="Akceptuj"
      onSend={onAddPosition}
      {...modalProps}
    />
  );

  const renderPositionCards = () =>
    positions.map((position) => (
      <ContentCard
        title={position.title}
        titleProps={{ mt: "0", fontSize: "md", fontWeight: "semibold" }}
        description={position.description ?? ""}
        descriptionProps={{
          mt: "8px",
          // mb: (position.tags ? "24px" : "8px"),
          fontSize: "0.9375rem",
          fontWeight: "500",
        }}
        // footerList={position.tags ? <TagListWrapper tags={position.tags} limit={4} /> : <></>}
        cardVariant="side-button"
        bodyProps={{ paddingX: "0" }}
        border={"none"}
        borderRadius={"none"}
        actionElement={
          editable ? (
            <PositionMenuWrapper
              position={position}
              onEdit={onEditPosition}
              onDelete={() => onRemovePosition(position.id)}
            />
          ) : (
            <ContactModal position={position} onSend={handleApplication} />
          )
        }
      />
    ));
  return (
    <StaticSectionCardWrapper
      cardSectionProps={{
        title: title,
        titleElements: editable ? addModalButton : undefined,
        width: "100%",
      }}
      listProps={{
        w: "100%",
        topStackProps: { w: "100%", mb: "-24px" },
      }}
      cards={renderPositionCards()}
    />
  );
};
