import {Flex, FlexProps} from "@chakra-ui/react";
import React, {useState} from "react";
import { Tag } from "./tag";

export interface TagListProps extends FlexProps {
  children?: React.ReactElement<typeof Tag> | React.ReactElement<typeof Tag>[]
  limit?: number
  /**
   * If `oneLine` is set, in the current implementation the height of each Tag
   * must be around 50px to work correctly.
  */
  oneLine?: boolean
  showLessProps?: React.ComponentProps<typeof Tag>
  addTagComponent?: React.ReactElement
}

export const TagList : React.FC<TagListProps> = ({
  children,
  limit,
  showLessProps,
  oneLine = false,
  addTagComponent,
 ...props
}) => {
  const [expanded, setExpanded] = useState(false);

  const tags = React.Children.toArray(children);
  const limitedChildren = limit && !expanded ? tags.slice(0, limit) : limit === 0 && !expanded ? [] : tags;
  const hiddenTags = tags.length - limitedChildren.length;
  const gap = 2;

  return (
    // If `oneLine` option is provided. It assumes that the tag height is arount 50px
    // the text is wrapped to the next line (overflowing) and the hidden property excludes
    // the overflowing tags.
    // To adjust for the dynamical sizes, measure flex height (without wrapping) with useMeasure hook.
    // Or pass the height of the tag.
    <Flex gap={gap} {...props} wrap="wrap" overflow="hidden" height={oneLine ? "50px" : "auto"}>
      {limitedChildren}

      {
        hiddenTags > 0 && !expanded && !oneLine &&
        (
          <Tag onClick={() => setExpanded(true)}>
            +{tags.length - limitedChildren.length}
          </Tag>
        )
      }

      {
        expanded && (tags && limit && tags.length > limit) &&
        (
          <Tag backgroundColor={"blue.200"} {...showLessProps} onClick={() => setExpanded(false)}>
            Show less
          </Tag>
        )
      }

      {addTagComponent}
    </Flex>
  )
}