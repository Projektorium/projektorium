import React from "react";
import { ContentCard, ContentCardProps } from "../../components/ui/content-card";
import { CARD_PADDING_X } from "@/routes/_layout";


const halfPadding = Object.fromEntries(
  Object.entries(CARD_PADDING_X).map(([key, value]) => [key, `calc(${value} / 2)`])
);

const negHalfPadding = Object.fromEntries(
  Object.entries(CARD_PADDING_X).map(([key, value]) => [key, `calc(-${value} / 2)`])
)

const hoverProps = {
  bodyProps: { paddingX: halfPadding },
  separator: undefined,
  border: "none",
  borderRadius: "none",
  mx: negHalfPadding,
  _hover: { bg: "bg.hover", borderRadius: "16px"}
}

export const HoverContentCard: React.FC<ContentCardProps> = (props) => {
  return (
    <ContentCard {...hoverProps} {...props}/>
  );
}
