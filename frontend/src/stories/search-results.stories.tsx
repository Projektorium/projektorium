import { ComponentProps } from "react";
import { OptionSection } from "../components/ui/option-section";
import { Meta, StoryObj } from "@storybook/react";
import { IconButtonProps, Separator, Text, Image, IconButton } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { PeopleList, ProjectListStory } from "./content-card-list.stories";
import { PaginatedList } from "../components/ui/static-card-section";
import { fn } from "@storybook/test";
import { Attachment } from "@/components/ui/attachment";
import { Publication } from "@/components/ui/publication";


type StoryProps = ComponentProps<typeof OptionSection>;

const meta: Meta<StoryProps> = {
  title: "UI/ContentCard/OptionSection",
  component: OptionSection,
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

const attachmentProps = {
  fileName: <Text style={{cursor : 'pointer'}} fontWeight="semibold">Raport z pierwszej fazy projektu</Text>,
  fileDsc: <Text color="fg.muted" textStyle="sm">PDF – 2,4 MB</Text>,
  date: <Text color="fg.muted" textStyle="sm">24 Lis, 2024</Text>,
  buttonProps: {size: 'lg', bg: "#EBF3FB"} as IconButtonProps,
  iconProps: {color: "#3182CE"},
  p: "20px",
  mY: "8px",
  onClick: fn(),
}

const publicationProps = {
  image: <Image src="https://economy-finance.ec.europa.eu/sites/default/files/styles/oe_theme_publication_thumbnail/public/2024-12/ip304_en-1.png?itok=SB6duXjC" h="100px"/>,
  fileName: <Text style={{cursor : 'pointer'}} fontWeight="semibold">Digitalizacja i jej wpływ na ochronę dziedzictwa kulturowego</Text>,
  fileDsc: <Text color="fg.muted" textStyle="sm">Nowe technologie w służbie historii</Text>,
  date: <Text color="fg.muted" textStyle="sm">24 Lis, 2024</Text>,
  author: <Text color="fg.muted" fontWeight="semibold" textStyle="sm">- Maria Jankowska</Text>,
  p: "20px",
  mY: "8px",
  onClick: fn()
}

const attachments = [<Attachment {...attachmentProps}/>, <Attachment {...attachmentProps}/>, <Attachment {...attachmentProps}/>]
const publications = [<Publication {...publicationProps}/>, <Publication {...publicationProps}/>]


const tabElements1 = [
  {
    tabValue: "projects",
    tabName: <Text fontSize="lg">Projekty ({defaultlistProps.cards.length})</Text>,
    tabContent: <PaginatedList itemsPerPage={4} {...defaultlistProps}/>,
  },
  {
    tabValue: "members",
    tabName: <Text fontSize="lg">Osoby ({PeopleList.args?.cards?.length ?? 0})</Text>,
    tabContent: <PaginatedList itemsPerPage={4} {...defaultlistProps} {...PeopleList.args}/>
  }
]

const tabElements2 = [
  {
    tabValue: "attachments",
    tabName: <Text fontSize="lg">Załączniki ({attachments.length})</Text>,
    tabContent: <PaginatedList itemsPerPage={4} {...defaultlistProps} cards={attachments} width="100%"/>,
  },
  {
    tabValue: "publications",
    tabName: <Text fontSize="lg">Publikacje ({publications.length})</Text>,
    tabContent: <PaginatedList itemsPerPage={4} {...defaultlistProps} cards={publications} width="100%"/>
  }
]


const stackProps = {
  titleSeparator : <Separator width={"100%"}/>,
  border: "1px solid gray",
  borderRadius: "16px",
  width: "700px",
  padding: "40px"
}

export const SearchResults: Story = {
  args: {
    tabElements: tabElements1,
    defaultTab: "projects",
    titleElements: <Text fontWeight={"bold"} fontSize={"xl"} alignContent={"center"}>Wyniki wyszukania</Text>,
    ...stackProps
  },
};

export const AttachmentsPublications: Story = {
  args: {
    tabElements: tabElements2,
    defaultTab: "attachments",
    titleElements: <IconButton aria-label="add" bgColor={"white"} color={"grey"}><FiPlus /></IconButton>,
    ...stackProps,
    tabHeaderProps: {flexDirection: "row-reverse"}
  },
};