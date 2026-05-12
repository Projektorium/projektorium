import { ComponentProps } from "react";
import { ProjectCardSkeleton  } from "@/components/ui/card-skeletons";
import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@chakra-ui/react";



type StoryProps = ComponentProps<typeof ProjectCardSkeleton>;

const meta: Meta<StoryProps> = {
  title: "UI/Skeletons/ProjectCardSkeleton",
  component: ProjectCardSkeleton,
};

export default meta;

type Story = StoryObj<typeof meta>;



export const PersonCardSkeletonStory: Story = {
  render: ({...args}) => (
    <Box width="800px">
      <ProjectCardSkeleton {...args}/>
    </Box>
  )
};
