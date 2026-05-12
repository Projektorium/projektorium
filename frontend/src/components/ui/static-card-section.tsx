import React, {ReactElement, useState} from "react"
import {Flex, FlexProps, HStack, StackProps, Text, TextProps, VStack} from '@chakra-ui/react'
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "./pagination"
import { ContentCardList, ContentCardListProps } from "./content-card-list";

export interface CardContentSectionProps extends StackProps {
  listProps: ContentCardListProps;
  itemsPerPage? : number;
  title : string;
  titleProps? : TextProps;
  titleSeparator?: React.ReactElement;
  titleElements?: ReactElement | ReactElement[];
  tabHeaderProps?: FlexProps;
  addCardCount?: boolean;
}

export interface PaginatedListProps extends ContentCardListProps {
  itemsPerPage : number;
  topStackProps?: StackProps;
}

export const PaginatedList: React.FC<PaginatedListProps> = ({
  cards,
  itemsPerPage,
  topStackProps,
  ...props
}) => {
  const [page, setPage] = useState(1)

  const startRange = (page - 1) * itemsPerPage
  const endRange = startRange + itemsPerPage
  const visibleItems = cards.slice(startRange, endRange)

  return (
    <VStack w="100%" {...topStackProps}>
      <ContentCardList w="100%" cards={visibleItems} {...props}/>

      { cards.length > itemsPerPage &&
        <PaginationRoot
          count={cards.length}
          pageSize={itemsPerPage}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      }
    </VStack>
  )
}

export const StaticCardSection: React.FC<CardContentSectionProps> = ({
  listProps,
  title,
  titleProps,
  titleSeparator,
  itemsPerPage = 5,
  titleElements,
  tabHeaderProps,
  addCardCount = true,
  ...props
}) => {
  const {cards, ...rest} = listProps

  const items =
    Array.isArray(titleElements) || !titleElements
      ? titleElements
      : [titleElements];

  return (
    <VStack w="100%" backgroundColor="bg.component" {...props}>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        w="100%"
        {...tabHeaderProps}
      >
        <Text {...titleProps}> {title} {addCardCount ? `(${cards.length})` : undefined}</Text>
        {items?.map((titleElement) => titleElement)}
      </Flex>
      {titleSeparator}

      <PaginatedList cards={cards} itemsPerPage={itemsPerPage} w="100%" {...rest}/>
    </VStack>
  );
};
