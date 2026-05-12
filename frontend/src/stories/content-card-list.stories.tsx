import { ComponentProps } from "react";
import { ContentCardList } from "../components/ui/content-card-list";
import { Meta, StoryObj } from "@storybook/react";

import { ActualProject1, ActualProject2, ActualProject3, ApplyProject, Person } from "./content-card.stories"
import { tagListLimit as TagListStory } from './tag-list.stories';

import { ContentCard, ContentCardProps } from "../components/ui/content-card";
import { TagList, TagListProps } from "../components/ui/tag-list";
import { Tag } from "../components/ui/tag";
import { Separator } from "@chakra-ui/react";


type StoryProps = ComponentProps<typeof ContentCardList>;

const meta: Meta<StoryProps> = {
  title: "UI/ContentCard/ProjectList",
  component: ContentCardList,
  args: {
    width: "600px"
  },
  argTypes: {
    cards: {
      control: false,
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleTagList = (tags: string[], tagListArgs: TagListProps) => (
  <TagList {...TagListStory.args} {...tagListArgs}>
    {tags.map((tag) => (<Tag key={tag} tooltipProps={{content: "Wyszukaj Projekt"}}>{tag}</Tag>))}
  </TagList>
);

const tags = ["Filologia", "Archiwa", "Dziedzictwo Kulturowe", "Literatura", "Historia", "Inne"]
const tagList = sampleTagList(tags, TagListStory.args as TagListProps);

const args = {border: "none", borderRadius: "none", separator: undefined, bodyProps: {paddingX: "0"}};


export const ProjectListStory: Story = {
  args: {
    separator: <Separator/>,
    cards: [<ContentCard {...(ActualProject1.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(ActualProject2.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(ActualProject3.args as ContentCardProps)} footerList={tagList} {...args}/>,
    ],
  },
};

export const OpenPositionsList: Story = {
  args: {
    separator: <Separator/>,
    cards: [<ContentCard {...(ApplyProject.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(ApplyProject.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(ApplyProject.args as ContentCardProps)} footerList={tagList} {...args}/>,
    ],
  },
};

export const PeopleList: Story = {
  args: {
    separator: <Separator/>,
    cards: [<ContentCard {...(Person.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(Person.args as ContentCardProps)} footerList={tagList} {...args}/>,
            <ContentCard {...(Person.args as ContentCardProps)} footerList={tagList} {...args}/>,
    ],
  },
};