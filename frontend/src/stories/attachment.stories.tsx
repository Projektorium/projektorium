import {ComponentProps} from "react";
import type {Meta, StoryObj} from "@storybook/react";
import {Attachment} from "@/components/ui/attachment";
import {action} from "@storybook/addon-actions";
import {Box, Text} from "@chakra-ui/react";

type StoryProps = ComponentProps<typeof Attachment> & {
  maxBoxWidth: string
  fileNameStr: string,
  fileDscStr: string,
  dateStr: string
};

const meta : Meta<StoryProps> = {
  title: 'UI/Attachment',
  component: Attachment,

  args: {
    maxBoxWidth: "500px"
  },

  argTypes: {
    fileName: {
      control: false
    },
    fileDsc: {
      control: false
    },
    date: {
      control: false
    }
  },

  tags: ['autodocs'],
}

export default meta;

export const AttachmentDefault: StoryObj<typeof meta> = {
  args: {
    fileNameStr: "Raport z pierwszej fazy projektu",
    fileDscStr: "PDF – 2,4 MB",
    dateStr: "24 Lis, 2024",
    buttonProps: {size: 'lg', bg: "#EBF3FB"},
    iconProps: {color: "#3182CE"},
    onClick: action("Clicked to download")
  },
  render: ({maxBoxWidth, fileNameStr, fileDscStr, dateStr, fileName, fileDsc, date, ...args}) => (
    // Ignoring fileName, fileDsc, date passed to the function.
    <Box width="100%" maxWidth={maxBoxWidth} height={50}>
      <Attachment
        fileName={<Text style={{cursor : 'pointer'}} fontWeight="semibold">{fileNameStr}</Text>}
        fileDsc={<Text color="fg.muted" textStyle="sm">{fileDscStr}</Text>}
        date={<Text color="fg.muted" textStyle="sm">{dateStr}</Text>}
        {...args}
      />
    </Box>
  )
}