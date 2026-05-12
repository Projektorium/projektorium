import React, { ReactElement } from 'react'
import {
  Box,
  Card,
  CardBodyProps,
  CardDescriptionProps,
  CardRootProps,
  CardTitleProps,
  Flex,
  HStack
} from '@chakra-ui/react'
import Markdown from 'react-markdown'
import { Prose } from './prose'

export interface ContentCardProps extends CardRootProps {
  title: string
  description: string
  width?: string
  separator?: ReactElement
  footerList?: ReactElement
  cardVariant?: 'none' | 'header' | 'side-button' | 'title-button'
  bodyProps?: CardBodyProps
  titleProps?: CardTitleProps
  descriptionProps?: CardDescriptionProps
  /**
   * The action element displayed in the card.
   * - If `variant` is `'header'`, this should be a `Header` component.
   * - If `variant` is `'side-button'` or `'title-button'`, this should be a `Button` component.
   * - If `variant` is `'none'`, this should be omitted or `undefined`.
   */
  actionElement?: React.ReactElement
  avatar?: ReactElement
  descriptionElement?: ReactElement
}

export const ContentCard = ({
  title,
  description,
  cardVariant: variant = "none",
  actionElement,
  footerList,
  bodyProps,
  descriptionProps,
  titleProps,
  separator,
  avatar,
  descriptionElement,
  ...props
}: ContentCardProps) => {

  const bodyStyling = {
    gap: "0",
    paddingLeft: "40px",
    paddingRight: "40px",
    ...bodyProps,
  }

  const cardTitle = <Card.Title mt="2" color="text.primary" {...titleProps}>{title}</Card.Title>;

  const titleSection = variant === "title-button" && actionElement ? (
    <Flex justifyContent="space-between">
      {cardTitle}
      {actionElement}
    </Flex>
  ) : cardTitle;

  const descriptionSection = descriptionElement ? (
    descriptionElement
  ) : (
    <Prose
      maxW="none"
      color="text.secondary"
      fontSize="md"
      lineHeight="24px"
      css={{"& p:first-of-type": {marginTop: "0"},
            "& p:last-of-type": {marginBottom: "0"}}}
      {...descriptionProps}>
      {/* Allow for boldness, cursive, and list markdown */}
      <Markdown allowedElements={["strong", "em", "ul", "ol", "li", "p"]} unwrapDisallowed>
        {description}
      </Markdown>
    </Prose>
  );

  const cardBody = variant === "side-button" && actionElement ? (
    <>
    <Flex justifyContent="space-between">
      <Box width="100%">
        {titleSection}
        {descriptionSection}
      </Box>
      <Box justifySelf="flex-start">{actionElement}</Box>
    </Flex>
    </>
  ) : (
    <>
      {titleSection}
      {descriptionSection}
    </>
  );

  const cardContentSection = (
    <>
      {variant === "header" && actionElement && actionElement}
      {cardBody}
      {separator}
      {footerList}
    </>
  );

  return (
    <Card.Root backgroundColor={"bg.component"} {...props}>
      <Card.Body {...bodyStyling}>
      {avatar ? (
          <HStack align="start" gap="20px">
            {avatar}
            <Box flex="1">
              {cardContentSection}
            </Box>
          </HStack>
        ) : (
          cardContentSection
        )}
      </Card.Body>
    </Card.Root>
  )
}