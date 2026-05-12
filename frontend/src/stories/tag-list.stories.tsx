import { ComponentProps } from "react";
import { Tag, TagProps } from "../components/ui/tag";
import { TagList } from "../components/ui/tag-list";
import { Meta, StoryObj } from "@storybook/react";
import { Box, Text } from "@chakra-ui/react";

type StoryProps = ComponentProps<typeof TagList> & {
  tags: string[]
  containerSize: string
};

const meta: Meta<StoryProps> = {
  title: "UI/TagList",
  component: TagList,
  argTypes: {
    children: {
      control : false
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const tagArgs : TagProps = {
  size: "md",
  fontSize: "sm",
  backgroundColor: "blue.200",
  closable: false,
};

const tooltipProps = { content: <Text>Wyszukaj projekt</Text>}

const sampleTags = [
  "Filologia",
  "Archiwa",
  "Dziedzictwo Kulturowe",
  "Literatura",
  "Historia",
  "Inne",
];

export const tagListLimit: Story = {
  args: {
    tags: sampleTags,
    containerSize: "400px",
    fontSize: "sm",
    showLessProps: tagArgs,
    limit: 3
  },
  render: ({ tags, containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <TagList {...args}>
        {tags.map((tag) => (<Tag key={tag} tooltipProps={tooltipProps}> {tag} </Tag>))}
      </TagList>
    </Box>
  ),
};

export const tagListOneLine: Story = {
  args: {
    tags: sampleTags,
    containerSize: "400px",
    showLessProps: tagArgs,
    oneLine: true
  },
  render: ({ tags, containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <TagList {...args}>
        {tags.map((tag) => (<Tag key={tag} tooltipProps={tooltipProps}> {tag} </Tag>))}
      </TagList>
    </Box>
  ),
};