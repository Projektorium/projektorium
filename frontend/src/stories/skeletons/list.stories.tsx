import { ComponentProps } from "react";
import { SkeletonList  } from "@/components/ui/card-skeletons";
import { Meta, StoryObj } from "@storybook/react";
import { Box } from "@chakra-ui/react";



type StoryProps = ComponentProps<typeof SkeletonList>;

const meta: Meta<StoryProps> = {
  title: "UI/Skeletons/ListSkeleton",
  component: SkeletonList,
};

export default meta;

type Story = StoryObj<typeof meta>;



export const SkeletonListStory: Story = {
  render: ({...args}) => (
    <Box width="800px">
      <SkeletonList {...args} />
    </Box>
  )
};
