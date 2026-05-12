import { Separator } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { TagList, TagListProps } from "@/components/ui/tag-list.tsx";
import type { Meta, StoryObj } from "@storybook/react";
import { ContentCardEditable } from "@/components/ui/content-card-editable.tsx";
import { tagListLimit as TagListStory } from "@/stories/tag-list.stories.tsx";
import { Tag } from "@/components/ui/tag.tsx";

type StoryProps = ComponentProps<typeof ContentCardEditable> & {
  tags: string[],
  TagListProps: TagListProps
};

const meta: Meta<StoryProps> = {
  title: 'UI/ContentCard/ContentCardEditable',
  component: ContentCardEditable,

  args: {
    tags: ["Filologia", "Archiwa", "Dziedzictwo Kulturowe", "Literatura", "Historia", "Inne"],
    width: "800px"
  },

  argTypes: {
    footerList: {
      control: false
    },
    actionElement: {
      control: false
    },
    cardVariant: {
      control: 'select',
    },
  },
  tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTagList = (tags: string[], tagListArgs: TagListProps) => (
  <TagList {...TagListStory.args} {...tagListArgs}>
    {tags.map((tag) => (<Tag key={tag} tooltipProps={{ content: "Wyszukaj Projekt" }}>{tag}</Tag>))}
  </TagList>
);

export const AboutMeEditable: Story = {
  args: {
    title: "O Mnie",
    description: `Moje zainteresowania obejmują tłumaczenia literackie, szczególnie z zakresu literatury współczesnej i klasycznej. W ramach studiów realizuje dodatkowe zajęcia z teorii tłumaczeń oraz stylistyki, które pozwalają jej zgłębiać niuanse języka. Odbyłam praktyki w wydawnictwie, gdzie współpracowała przy redakcji przekładów literackich.`,
    textareaProps: { height: "150px" },
    acceptButtonText: "Zatwierdź",
    cancelButtonText: "Anuluj",
    cancelButtonProps: {
      color: "rgba(5, 33, 61, 0.5)",
      bgColor: "rgba(243, 244, 245, 1)",
      colorScheme: "grey"
    },
    descriptionProps: {mt: "16px", mb: "32px"},
    separator: <Separator mb="32px" />,
  },
  render: ({ ...args }) => {
    return (
      <ContentCardEditable
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        acceptButtonText={args.acceptButtonText}
        cancelButtonText={args.cancelButtonText}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    )
  }
};

export const AboutProjectEditable: Story = {
  args: {
    title: "O projekcie",
    description: `📖 Ten projekt skupia się na digitalizacji cennych zbiorów literackich przechowywanych na Uniwersytecie Warszawskim. Zdigitalizujemy rękopisy, książki i czasopisma, które mają ogromne znaczenie historyczne.
                  \n🌐 Powstanie ogólnodostępne archiwum online, które wesprze badaczy, nauczycieli i miłośników literatury.
                  \n🛠️ Wykorzystujemy zaawansowane technologie, takie jak OCR i skanowanie 3D, aby zachować najwyższą jakość. dolor.`,
    textareaProps: { height: "150px" },
    acceptButtonText: "Zatwierdź",
    cancelButtonText: "Anuluj",
    cancelButtonProps: {
      color: "rgba(5, 33, 61, 0.5)",
      bgColor: "rgba(243, 244, 245, 1)",
      colorScheme: "grey"
    },
    descriptionProps: {mt: "16px", mb: "32px"},
    separator: <Separator mb="32px" />,
  },
  render: ({ ...args }) => {
    return <ContentCardEditable
      title={args.title}
      description={args.description}
      cardVariant={args.cardVariant}
      acceptButtonText={args.acceptButtonText}
      cancelButtonText={args.cancelButtonText}
      footerList={sampleTagList(args.tags, args.TagListProps)}
      {...args}
    />
  }
};