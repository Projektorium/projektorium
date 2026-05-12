import {Separator} from "@chakra-ui/react";
import {ContentCardEditableWrapper} from "@/components/ui/content-card-editable.tsx";
import {tagListLimit as TagListStory} from "@/stories/tag-list.stories.tsx";
import {ComponentProps} from "react";
import {TagListProps} from "@/components/ui/tag-list.tsx";
import type {Meta, StoryObj} from "@storybook/react";
import {CARD_PADDING_X} from "@/routes/_layout.tsx";

type StoryProps = ComponentProps<typeof ContentCardEditableWrapper> & {
  tags: string[],
  TagListProps: TagListProps
};

const meta : Meta<StoryProps>= {
  title: 'UI/ContentCard/ContentCardEditableWrapper',
  component: ContentCardEditableWrapper,

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

export const AboutProjectEditableWrapper: Story = {
  args: {
    title: "O projekcie",
    description: `📖 Ten projekt skupia się na digitalizacji cennych zbiorów literackich przechowywanych na Uniwersytecie Warszawskim. Zdigitalizujemy rękopisy, książki i czasopisma, które mają ogromne znaczenie historyczne.
                  \n🌐 Powstanie ogólnodostępne archiwum online, które wesprze badaczy, nauczycieli i miłośników literatury.
                  \n🛠️ Wykorzystujemy zaawansowane technologie, takie jak OCR i skanowanie 3D, aby zachować najwyższą jakość. dolor.`,
    textareaProps: {height: "150px", mt: "16px"},
    acceptButtonText: "Zatwierdź",
    cancelButtonText: "Anuluj",
    cancelButtonProps: {
      color: "rgba(5, 33, 61, 0.5)",
      bgColor: "rgba(243, 244, 245, 1)",
      colorScheme: "grey"
    },
    tagListArgs: TagListStory.args,
    tagArgs: {tooltipProps: {content: "Wyszukaj Projekt"}},
    descriptionProps: {mt: "16px", mb: "32px"},
    separator: <Separator mb="32px" />,
  },
  render: ({title, description, tags, acceptButtonText, cancelButtonText, ...props}) => {
    const onAccept = (dsc: string, tags: string[]) => alert(`New description: ${dsc}\nNew tag list: ${tags}`)


    return <ContentCardEditableWrapper
      title={title}
      description={description}
      tags={tags}
      bodyProps={{ paddingX: CARD_PADDING_X }}
      descriptionProps={{mt: "16px", fontWeight: "500"}}
      separator={<Separator my="32px" />}
      border="primary"
      borderRadius="primary"
      textareaProps={{height: "150px", mt: "16px"}}
      acceptButtonText={acceptButtonText}
      cancelButtonText={cancelButtonText}
      cancelButtonProps={{
        color: "rgba(5, 33, 61, 0.5)",
        bgColor: "rgba(243, 244, 245, 1)",
        colorScheme: "grey"
      }}
      onAccept={onAccept}
      {...props}
    />
  }
};