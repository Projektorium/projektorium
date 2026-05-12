import { Tag, TagProps } from "@/components/ui/tag";
import { TagList, TagListProps } from "@/components/ui/tag-list";
import { Text } from "@chakra-ui/react";

const defaultTagProps: TagProps = {
  size: "md",
  fontSize: "sm",
  backgroundColor: "blue.200",
  closable: false,
};

const defaultTooltipProps = { content: <Text>Wyszukaj projekt</Text> };

interface TagListWrapperProps extends Omit<TagListProps, "children"> {
  tags: string[];
  tagProps?: Partial<TagProps>;
}

export const TagListWrapper = ({ tags, tagProps, ...tagListProps }: TagListWrapperProps) => {
  return (
    <TagList showLessProps={defaultTagProps} {...tagListProps}>
      {tags.map((tag) => (
        <Tag key={tag} {...tagProps} tooltipProps={defaultTooltipProps}>
          {tag}
        </Tag>
      ))}
    </TagList>
  );
};
