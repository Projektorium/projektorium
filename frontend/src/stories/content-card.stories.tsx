import type { Meta, StoryObj } from "@storybook/react";

import { ContentCard } from "../components/ui/content-card";
import { ComponentProps } from "react";
import {
  ContactButton,
  EditButton,
  HeartButton,
  ShareButton,
} from "../components/ui/icon-buttons";
import {
  ContentCardHeader,
  ContentCardHeaderProps,
} from "../components/ui/content-card-headers";
import {Button, Separator, Image, Flex, HStack, Text, AvatarImage, AvatarRoot} from "@chakra-ui/react";
import { TagList, TagListProps } from "../components/ui/tag-list";
import { tagListLimit as TagListStory } from "./tag-list.stories";
import { Tag } from "../components/ui/tag";
import {
  AddmissionProjectCardHeader,
  ActiveProjectCardHeader,
  FinishedProjectCardHeader,
} from "./project-headers.stories";

type StoryProps = ComponentProps<typeof ContentCard> & {
  tags: string[];
  TagListProps: TagListProps;
};

const meta: Meta<StoryProps> = {
  title: "UI/ContentCard/ContentCard",
  component: ContentCard,

  args: {
    tags: [
      "Filologia",
      "Archiwa",
      "Dziedzictwo Kulturowe",
      "Literatura",
      "Historia",
      "Inne",
    ],
    width: "800px",
  },

  argTypes: {
    footerList: {
      control: false,
    },
    actionElement: {
      control: false,
    },
    cardVariant: {
      control: "select",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTagList = (tags: string[], tagListArgs: TagListProps) => (
  <TagList {...TagListStory.args} {...tagListArgs}>
    {tags.map((tag) => (
      <Tag key={tag} tooltipProps={{ content: "Wyszukaj Projekt" }}>
        {tag}
      </Tag>
    ))}
  </TagList>
);

export const AboutProject: Story = {
  args: {
    title: "O projekcie",
    description: `📖 Ten projekt skupia się na digitalizacji cennych zbiorów literackich przechowywanych na Uniwersytecie Warszawskim. Zdigitalizujemy rękopisy, książki i czasopisma, które mają ogromne znaczenie historyczne.
                  \n🌐 Powstanie ogólnodostępne archiwum online, które wesprze badaczy, nauczycieli i miłośników literatury.
                  \n🛠️ Wykorzystujemy zaawansowane technologie, takie jak OCR i skanowanie 3D, aby zachować najwyższą jakość. dolor.`,
    cardVariant: "none",
    actionElement: <EditButton />,
    descriptionProps: {mt: "16px", mb: "32px"},
    separator: <Separator mb="32px" />,
  },
  render: (args) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const ActualProject1: Story = {
  args: {
    title: "Digitalizacja zbiorów literackich Uniwersytetu Warszawskiego",
    description: `Projekt ma na celu stworzenie cyfrowego archiwum zbiorów literackich przechowywanych na Uniwersytecie Warszawskim. Obejmuje digitalizację rękopisów, książek oraz czasopism, z uwzględnieniem materiałów o dużej wartości historycznej. Inicjatywa ma także na celu udostępnienie zbiorów w formie ogólnodostępnego katalogu online, wspierającego zarówno badania naukowe, jak i popularyzację literatury wśród społeczeństwa.`,
    cardVariant: "header",
    actionElement: (
      <ContentCardHeader
        {...(AddmissionProjectCardHeader.args as ContentCardHeaderProps)}
      />
    ),
    descriptionProps: {mt: "12px", mb: "24px"},
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const ActualProject2: Story = {
  args: {
    title: "Badanie zmian klimatycznych w Polsce na przestrzeni XX wieku",
    description: `Celem projektu jest analiza zmian klimatycznych w Polsce, wykorzystując dane meteorologiczne zgromadzone od początku XX wieku. Projekt skupia się na identyfikacji trendów w temperaturach, opadach oraz ekstremalnych zjawiskach pogodowych. Wyniki badań mają być podstawą do prognozowania przyszłych zmian klimatu i opracowania strategii adaptacyjnych.`,
    cardVariant: "header",
    actionElement: (
      <ContentCardHeader
        {...(ActiveProjectCardHeader.args as ContentCardHeaderProps)}
      />
    ),
    descriptionProps: {mt: "12px", mb: "24px"},
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const ActualProject3: Story = {
  args: {
    title: "Rozwój nowoczesnych metod nauczania języków obcych",
    description: `Projekt skupia się na opracowaniu innowacyjnych metod nauczania języków obcych, wykorzystujących technologie takie jak sztuczna inteligencja i rzeczywistość wirtualna. Celem jest zwiększenie efektywności nauki przez interaktywne środowiska edukacyjne, personalizowane ćwiczenia oraz automatyczne korekty błędów. Projekt jest realizowany we współpracy z międzynarodowymi uniwersytetami i szkołami językowymi.`,
    cardVariant: "header",
    actionElement: (
      <ContentCardHeader
        {...(FinishedProjectCardHeader.args as ContentCardHeaderProps)}
      />
    ),
    descriptionProps: {mt: "12px", mb: "24px"},
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const AboutMe: Story = {
  args: {
    title: "O Mnie",
    description: `Moje zainteresowania obejmują tłumaczenia literackie, szczególnie z zakresu literatury współczesnej i klasycznej. W ramach studiów realizuje dodatkowe zajęcia z teorii tłumaczeń oraz stylistyki, które pozwalają jej zgłębiać niuanse języka. Odbyłam praktyki w wydawnictwie, gdzie współpracowała przy redakcji przekładów literackich.`,
    cardVariant: "title-button",
    actionElement: <EditButton />,
    descriptionProps: {mt: "16px", mb: "32px"},
    separator: <Separator mb="32px" />,
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const MarkdownTest: Story = {
  args: {
    title: "Markdown Test",
    description: `Testing lists:\n* Boldness with **: **bolded test**\n* Cursive with *: *cursive test*\n* Cursive with _: _cursive test_\n* Bolded and cursive test: ***cursive bolded test***
                  \n## Titling does not work`,
    cardVariant: "none",
    separator: undefined,
  },
};

export const ApplyProject: Story = {
  args: {
    title: "Specjalista ds. OCR i analizy tekstu 💻🔍",
    description: `Przetwarzanie zeskanowanych dokumentów na tekst, optymalizacja algorytmów OCR, czyszczenie danych.`,
    cardVariant: "side-button",
    actionElement: (
      <Button
        borderRadius="full"
        pl="16px"
        pr="16px"
        color="while"
        bgColor="rgba(49, 130, 206, 1)"
      >
        {" "}
        Aplikuj{" "}
      </Button>
    ),
    descriptionProps: {mt: "8px", mb: "24px"},
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};

export const Message: Story = {
  args: {
    title: "Artur Kopytko",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    cardVariant: "none",
    avatar: (
      <AvatarRoot size="2xl">
        <AvatarImage
          src="https://fastly.picsum.photos/id/797/150/150.jpg?hmac=qFxiqguNGmKvv8cJn_7wYLM1uCYvxMF5cN4DMHyIAqs"
        />
      </AvatarRoot>
    ),
    width: "760px",
    footerList: (
      <Flex flexDirection="row" justifyContent="space-between">
        <HStack>
          <ContactButton text="Napisz" />
          <ShareButton
            beforeShare={"Udostępnij dane"}
            afterShare="Udostępniono"
            color="rgba(5, 33, 61, 1)"
            bgColor={"rgba(243, 244, 245, 1)"}
            colorScheme={"grey"}
          />
        </HStack>
        <Text
          color="rgba(5, 33, 61, 0.5)"
          fontSize="15px"
          alignSelf={"flex-end"}
        >
          24 lis, 2024
        </Text>
      </Flex>
    ),
    titleProps: {mt: "0"},
    descriptionProps: {mt: "4px", mb: "20px"}
  },
};

export const Person: Story = {
  args: {
    title: "Artur Kopytko",
    description: `Moje zainteresowania obejmują tłumaczenia literackie, szczególnie z zakresu literatury współczesnej i klasycznej. W ramach studiów realizuje dodatkowe zaję...`,
    cardVariant: "side-button",
    actionElement: (
      <HStack>
        <HeartButton />
        <ContactButton text="Kontakt" />
      </HStack>
    ),
    avatar: (
      <AvatarRoot size="2xl">
        <AvatarImage
          src="https://fastly.picsum.photos/id/797/150/150.jpg?hmac=qFxiqguNGmKvv8cJn_7wYLM1uCYvxMF5cN4DMHyIAqs"
        />
      </AvatarRoot>
    ),
    titleProps: {mt: "0"},
    descriptionProps: {mt: "8px", mb: "16px"}
  },
  render: ({ ...args }) => {
    return (
      <ContentCard
        title={args.title}
        description={args.description}
        cardVariant={args.cardVariant}
        footerList={sampleTagList(args.tags, args.TagListProps)}
        {...args}
      />
    );
  },
};
