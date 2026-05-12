import { ReactElement } from "react";
import { Stack, StackProps } from "@chakra-ui/react";
import { ContentCard } from "./content-card";
import React from "react";

export interface ContentCardListProps extends StackProps {
  cards : ReactElement<typeof ContentCard>[]
}

export const ContentCardList : React.FC<ContentCardListProps> = ({
   cards,
  ...props
}) => {
  return (
      <Stack gap={0} {...props}>
      {cards.map((card) => (
        <>{card}</>
      ))}
      </Stack>
  );
};


