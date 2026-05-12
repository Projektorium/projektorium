import {Meta, StoryObj} from "@storybook/react";
import {Image, Text} from "@chakra-ui/react";
import {MainSearchHeader, MainSearchHeaderProps} from "@/components/ui/main-search-header.tsx";
import {action} from "@storybook/addon-actions";
import SearchWhiteIcon from "@/assets/icons/search-white.svg";

const meta: Meta<MainSearchHeaderProps> = {
  title: "UI/MainSearchHeader",
  component: MainSearchHeader,

  tags: ['autodocs']
};

export default meta;

export const MainSearchHeaderDefault: StoryObj<typeof meta> = {
  args: {
    maxSearchWidth: "800px",
    height: "350px",
    searchBarProps: {
      searchBarText: "np. \"Projekty łączące biologię z matematyką\"",
      buttonText: "Wyszukaj",
      buttonProps: {bgColor: "#05213D", onClick: action("Clicked the search button")},
      buttonIcon: <Image w="14px" h="14px" objectFit="contain" src={SearchWhiteIcon}/>
    },
    headerText: <Text
      style={{ whiteSpace: "pre-line" }}
      fontSize="40px"
      fontWeight="600"
      color="white"
      lineHeight="shorter"
      overflow="hidden">
      {"Znajdź coś\n dla Siebie"}
    </Text>,
    bgColor: "#3182CE"
  },
  render: ({...args}) => (
    <MainSearchHeader {...args}/>
  )
}