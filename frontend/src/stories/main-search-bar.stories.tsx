import {Meta, StoryObj} from "@storybook/react";
import {MainSearchBar, MainSearchBarProps} from "@/components/ui/main-search-bar.tsx";
import {Box, Image} from "@chakra-ui/react";
import {action} from "@storybook/addon-actions";
import SearchIcon from "@/assets/icons/search.svg"

const meta: Meta<MainSearchBarProps> = {
  title: "UI/MainSearchBar",
  component: MainSearchBar,

  tags: ['autodocs']
};

export default meta;

export const MainSearchBarDefault: StoryObj<typeof meta> = {
  args: {
    searchBarProps: {w: "600px"},
    searchBarText: "np. \"Projekty łączące biologię z matematyką\"",
    buttonText: "Wyszukaj",
    buttonProps: {bgColor: "#05213D", onClick: action("Clicked the search button")},
    buttonIcon: <Image w="14px" h="14px" objectFit="contain" src={SearchIcon}/>
  },
  render: ({...args}) => (
    <Box bgColor="black" border="1px black solid">
      <MainSearchBar {...args}/>
    </Box>
  )
}