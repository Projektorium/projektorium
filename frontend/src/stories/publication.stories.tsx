import {ComponentProps} from "react";
import type {Meta, StoryObj} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {Box, Text, Image} from "@chakra-ui/react";
import {Publication} from "@/components/ui/publication";

type StoryProps = ComponentProps<typeof Publication> & {
  maxBoxWidth: string
  imageStr: string,
  fileNameStr: string,
  fileDscStr: string,
  dateStr: string,
  authorStr: string
};

const meta : Meta<StoryProps>= {
  title: 'UI/Publication',
  component: Publication,

  args: {
    maxWidth: "600px"
  },

  argTypes: {
    fileName: {
      control: false
    },
    fileDsc: {
      control: false
    },
    author: {
      control: false
    },
    date: {
      control: false
    }
  },

  tags: ['autodocs'],
}

export default meta;

export const Publication1: StoryObj<typeof meta> = {
  args: {
    image: <Image src="https://economy-finance.ec.europa.eu/sites/default/files/styles/oe_theme_publication_thumbnail/public/2024-12/ip304_en-1.png?itok=SB6duXjC" h="100px"/>,
    fileNameStr: "Digitalizacja i jej wpływ na ochronę dziedzictwa kulturowego",
    fileDscStr: "Nowe technologie w służbie historii",
    dateStr: "24 Lis, 2024",
    authorStr: "- Maria Jankowska",
    onClick: action("Clicked to download")
  },
  render: ({maxBoxWidth, fileNameStr, fileDscStr, authorStr, dateStr, fileName, fileDsc, date, author, ...args}) => (
    // Ignoring fileName, fileDsc, date, author passed to the function.
    <Box width="100%" maxWidth={maxBoxWidth} height={50}>
      <Publication
        fileName={<Text style={{cursor : 'pointer'}} fontWeight="semibold">{fileNameStr}</Text>}
        fileDsc={<Text color="fg.muted" textStyle="sm">{fileDscStr}</Text>}
        date={<Text color="fg.muted" textStyle="sm">{dateStr}</Text>}
        author={<Text color="fg.muted" fontWeight="semibold" textStyle="sm">{authorStr}</Text>}
        {...args}
      />
    </Box>
  )
}

export const Publication2: StoryObj<typeof meta> = {
  args: {
    image: <Image src="https://economy-finance.ec.europa.eu/sites/default/files/styles/oe_theme_publication_thumbnail/public/2024-05/ip287_en-300.png?itok=r1xQlWfm" h="100px"/>,
    fileNameStr: "Digitalizacja i jej wpływ na ochronę dziedzictwa kulturowego",
    fileDscStr: "Nowe technologie w służbie historii",
    dateStr: "24 Lis, 2024",
    authorStr: "- Maria Jankowska",
    onClick: action("Clicked to download")
  },
  render: ({maxWidth, fileNameStr, fileDscStr, authorStr, dateStr, fileName, fileDsc, date, author, ...args}) => (
    // Ignoring fileName, fileDsc, date, author passed to the function.
    <Box width="100%" maxWidth={maxWidth} height={50}>
      <Publication
        fileName={<Text style={{cursor : 'pointer'}} fontWeight="semibold">{fileNameStr}</Text>}
        fileDsc={<Text color="fg.muted" textStyle="sm">{fileDscStr}</Text>}
        date={<Text color="fg.muted" textStyle="sm">{dateStr}</Text>}
        author={<Text color="fg.muted" fontWeight="semibold" textStyle="sm">{authorStr}</Text>}
        {...args}
      />
    </Box>
  )
}
