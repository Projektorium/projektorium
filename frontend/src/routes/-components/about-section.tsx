import { CARD_PADDING_X } from "@/routes/_layout";
import {CardBodyProps, CardTitleProps, Separator} from "@chakra-ui/react";
import { ContentCard } from "../../components/ui/content-card";
import { TagListWrapper } from "./tag-list-wrapper";
import React from "react";
import { ContentCardEditableWrapper } from "@/components/ui/content-card-editable.tsx";

export interface AboutSectionProps {
  title: string;
  description: string;
  tags: string[];
  editable: boolean;
  titleProps?: CardTitleProps;
  bodyProps?: CardBodyProps;
  onAccept?: (dsc: string, tags: string[]) => void;
  acceptButtonText?: string;
  cancelButtonText?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  description,
  tags,
  editable,
  onAccept,
  acceptButtonText = "Zatwierdź",
  cancelButtonText = "Anuluj",
  ...props
}) => {
  return ( editable ? (
      <ContentCardEditableWrapper
        title={title}
        description={description}
        tags={tags}
        bodyProps={{ paddingX: CARD_PADDING_X }}
        descriptionProps={{mt: "16px", fontWeight: "500"}}
        separator={<Separator my="32px" />}
        border="primary"
        borderRadius="primary"
        textareaProps={{height: "150px", mt: "16px"}}
        acceptButtonText={acceptButtonText}
        cancelButtonText={cancelButtonText}
        cancelButtonProps={{
          color: "text.primary/50",
          bgColor: "rgba(243, 244, 245, 1)",
          colorScheme: "grey"
        }}
        onAccept={onAccept}
        {...props}
      />
    ) : (
      <ContentCard
        title={title}
        description={description}
        footerList={<TagListWrapper tags={tags} />}
        bodyProps={{ paddingX: CARD_PADDING_X }}
        cardVariant="none"
        descriptionProps={{mt: "16px", fontWeight: "500"}}
        separator={<Separator my="32px" />}
        border="primary"
        borderRadius="primary"
        {...props}
      />
    )
  );
};
