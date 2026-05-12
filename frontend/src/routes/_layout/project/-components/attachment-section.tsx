import { Text, Image, Flex } from "@chakra-ui/react";
import { DotsButton, AddButton } from "@/components/ui/icon-buttons";
import { StaticSectionCardWrapper } from "@/routes/-components/static-section-wrapper";
import { Attachment } from "@/components/ui/attachment";

import { attachments as defaultAttachments } from "@/mock-data/mock-attachment";
import React from "react";
import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu.tsx";
import XIcon from "@/assets/icons/x.svg";
import { ModalFileUpload } from "@/components/ui/modal-file-upload.tsx";
import { CARD_PADDING_X } from "../../../_layout";

const negHalfPadding = Object.fromEntries(
  Object.entries(CARD_PADDING_X).map(([key, value]) => [key, `calc(-${value} / 2)`])
);

const menuItems = (title: string) =>
  [
    {
      value: "Usuń",
      element: (
        <Flex gap="12px" p="12px" w="100%" h="100%" onClick={() => alert(`Removing attachment: ${title}`)}>
          <Image opacity="50%" w="20px" src={XIcon} />
          <Text fontSize="md" fontWeight="500">
            Usuń
          </Text>
        </Flex>
      ),
    },
  ] as ("separator" | ContextMenuItem)[];

export const AttachmentsSection: React.FC<{ editable: boolean }> = ({ editable }) => {
  const attachments = defaultAttachments;

  return (
    <StaticSectionCardWrapper
      cardSectionProps={{
        title: "Załączniki",
        titleElements: editable ? (
          <ModalFileUpload
            headerText={"Wgraj pliki"}
            trigger={<AddButton />}
            sendButtonText="Zatwierdź"
            onSend={(f) => alert(f.map((x) => x.name))}
            dropzoneContent={<Text>Przeciągnij pliki tutaj</Text>}
          />
        ) : undefined,
        width: "100%",
      }}
      listProps={{
        w: "100%",
        topStackProps: { w: "100%" },
      }}
      cards={attachments.map((attachment) => (
        <Attachment
          key={attachment.id}
          fileName={
            <Text cursor="pointer" fontWeight="semibold" color="text.primary" textStyle="md">
              {attachment.fileName}
            </Text>
          }
          fileDsc={
            <Text color="text.secondary" fontWeight="500" fontSize="0.9375rem">
              {attachment.fileDsc}
            </Text>
          }
          date={
            <Text color="text.secondary" fontWeight="500" fontSize="0.9375rem">
              {attachment.date}
            </Text>
          }
          actionButton={
            <ContextMenu
              trigger={
                <Flex direction="column" alignSelf="start" h="100%">
                  <DotsButton />
                </Flex>
              }
              menuItems={menuItems(attachment.fileName)}
              menuItemProps={{ w: "114px" }}
            />
          }
          buttonProps={{ size: "lg" as const, bgColor: "#EBF3FB", borderRadius: "8px" }}
          iconProps={{ color: "#3182CE" }}
          onClick={() => alert("attachment " + attachment.id)}
          px="20px"
          py="24px"
          marginX={negHalfPadding}
        />
      ))}
    />
  );
};
