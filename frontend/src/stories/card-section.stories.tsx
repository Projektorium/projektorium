import { ComponentProps } from "react";
import { StaticCardSection } from "../components/ui/static-card-section";
import { Meta, StoryObj } from "@storybook/react";

import { ProjectListStory,  OpenPositionsList} from "./content-card-list.stories";
import { Separator } from "@chakra-ui/react";

type StoryProps = ComponentProps<typeof StaticCardSection>;

const meta: Meta<StoryProps> = {
  title: "UI/ContentCard/ProjectSection",
  component: StaticCardSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

const defaultlistProps = {
  ...(ProjectListStory.args as StoryProps),
  cards: [
    ...(ProjectListStory.args?.cards ?? []),
    ...(ProjectListStory.args?.cards ?? []),
    ...(ProjectListStory.args?.cards ?? []),
  ],
};

const TextProps = {
  fontSize: "20px",
  fontWeight: "600",
  width: "100%"
}

const stackProps = {
  titleSeparator : <Separator width={"100%"}/>,
  border: "1px solid gray",
  borderRadius: "16px",
  width: "700px",
  padding: "40px"
}

export const ActualProjects: Story = {
  args: {
    title: "Aktualne projekty",
    listProps: defaultlistProps,
    titleProps: TextProps,
    itemsPerPage: 4,
    ...stackProps,

  },
};

export const OpenPositions: Story = {
  args: {
    title: "Otwarte Stanowiska",
    listProps: {...defaultlistProps, ...OpenPositionsList.args},
    titleProps: TextProps,
    itemsPerPage: 4,
    ...stackProps,
  },
};
