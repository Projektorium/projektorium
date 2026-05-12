import { ComponentProps } from "react";
import { PersonCardSkeleton,   } from "@/components/ui/card-skeletons";
import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@chakra-ui/react";



type StoryProps = ComponentProps<typeof PersonCardSkeleton>;

const meta: Meta<StoryProps> = {
  title: "UI/Skeletons/PersonCardSkeleton",
  component: PersonCardSkeleton,
};

export default meta;

type Story = StoryObj<typeof meta>;



export const PersonCardSkeletonStory: Story = {
  render: ({...args}) => (
    <Box width="800px">
      <PersonCardSkeleton {...args}/>
    </Box>
  )
};
