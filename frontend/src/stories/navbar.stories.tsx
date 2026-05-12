import { Navbar, NavbarProps } from '@/components/ui/navbar.tsx'
import { Meta, StoryObj } from '@storybook/react'
import {
  AvatarImage,
  AvatarRoot,
  Flex, HStack,
  IconButton,
  Image,
  Text
} from "@chakra-ui/react";

import whiteLogo from "../assets/icons/projektorium-logo-white.svg"
import blueLogo from "../assets/icons/projektorium-logo-blue.svg"
import { action } from "@storybook/addon-actions";
import { MainSearchBar } from '@/components/ui/main-search-bar';
import {BellIcon, BellWithNotificationIcon } from '@/components/ui/icon-buttons';
import {RxHamburgerMenu} from "react-icons/rx";
import HeartIcon from "@/assets/icons/heart.svg";
import UserIcon from "@/assets/icons/user.svg";
import BriefcaseIcon from "@/assets/icons/briefcase.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import BellIconDesign from "@/assets/icons/bell.svg";
import {ContextMenu, ContextMenuItem} from "@/components/ui/context-menu.tsx";
import {ReactElement} from "react";
import SearchIcon from "@/assets/icons/search.svg";


type StoryProps = NavbarProps;

const meta: Meta<StoryProps> = {
  title: 'ui/Navbar',
  component: Navbar
}

export default meta;

const WhiteLogo= () => (
  <IconButton bg={"transparent"}>
    <Image src={whiteLogo} />
    <Text color="#FFFFFF" fontWeight="semibold" textStyle="xl" objectPosition="right" pl="12.38px">Projektorium</Text>
  </IconButton>
)


const BlueLogo = () => (
  <IconButton bg="transparent">
    <Image src={blueLogo} />
    <Text color="text.primary" fontWeight="semibold"  textStyle="xl" objectPosition="right">Projektorium</Text>
  </IconButton>
)


const menuArgs = (color: string) => ({
  trigger: (<IconButton
    rounded="full"
    variant="outline"
    colorPalette="gray"
    pt="6"
    pb="6"
    pl="2"
    pr="2"
  >
    <HStack gap="3">
      <RxHamburgerMenu size={300} color={color} />
      <AvatarRoot> <AvatarImage src="https://fastly.picsum.photos/id/797/150/150.jpg?hmac=qFxiqguNGmKvv8cJn_7wYLM1uCYvxMF5cN4DMHyIAqs" /> </AvatarRoot>
    </HStack>
  </IconButton>),
  menuItems: [
    { value: "Zapisane", element: <>
        <Image opacity="50%" w="20px" src={HeartIcon}/>
        <Text fontSize="md" fontWeight="500">Zapisane</Text>
      </> },
    'separator',
    { value: "Mój profil", element: <>
        <Image opacity="50%" w="20px" src={UserIcon}/>
        <Text fontSize="md" fontWeight="500">Mój profil</Text>
      </> },
    { value: "Moje Projekty", element: <>
        <Image opacity="50%" w="20px" src={BriefcaseIcon}/>
        <Text fontSize="md" fontWeight="500">Moje projekty</Text>
      </> },

    { value: "Ustawienia", element: <>
        <Image opacity="50%" h="20px" src={SettingsIcon}/>
        <Text fontSize="md" fontWeight="500">Ustawienia</Text>
      </> },
    'separator',
    { value: "Wyloguj", element: <>
        <Image opacity="50%" h="20px" src={BellIconDesign}/>
        <Text fontSize="md" fontWeight="500">Wyloguj</Text>
      </> },
  ] as ("separator" | ContextMenuItem)[],
})

const userActions = (bell: ReactElement, color: string = "white") =>
  <Flex align="center" gap={2}>
    {bell}
    <ContextMenu {...menuArgs(color)} />
  </Flex>

const SearchBar = () => (
  <MainSearchBar
    width="280px"
    h="48px"
    searchBarProps={{ bgColor: "rgba(244, 245, 245, 1)"}}
    searchBarText='np.  "Big Data"'
    buttonProps={{ color: "black", bgColor: "transparent", onClick: action("Clicked the search button") }}
    reverse={true}
    buttonIcon={<Image w="14px" h="14px" objectFit="contain" src={SearchIcon}/>}
  />
)

export const NavbarBlueNotification: StoryObj<typeof meta> = {
  args: {
    logo: <WhiteLogo />,
    backgroundProps: { bgColor: "bg.primary", borderColor: "rgba(231, 231, 231, 0.2)" },
    userActions: userActions(<BellWithNotificationIcon iconProps={{ color: "white", boxSize: "24px"}} circleProps={{borderColor: "bg.primary"}}/>, "white"),
    width: "800px",
    mx: "auto",
  },
}

export const NavbarWhite: StoryObj<typeof meta> = {
  args: {
    logo: <BlueLogo />,
    backgroundProps: { bgColor: "white" },
    userActions: userActions(<BellWithNotificationIcon bgColor="white" iconProps={{color: "black", boxSize: "24px"}} circleProps={{borderColor: "white", bgColor: "bg.primary"}}/>, "black"),
    searchBar: <SearchBar/>,
    width: "800px",
    mx: "auto",
  },
}

export const NavbarWhiteEmptyNotification: StoryObj<typeof meta> = {
  args: {
    logo: <BlueLogo />,
    backgroundProps: { bgColor: "white" },
    userActions: userActions(<BellIcon bgColor="white" iconProps={{color: "black", boxSize: "24px"}}/>, "black"),
    searchBar: <SearchBar />,
    width: "800px",
    mx: "auto",
  },
}