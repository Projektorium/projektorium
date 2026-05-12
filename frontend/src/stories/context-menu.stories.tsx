import { Meta, StoryObj } from '@storybook/react'
import { Button, Image, Text } from "@chakra-ui/react";
import { ContextMenu, ContextMenuProps } from "@/components/ui/context-menu.tsx";
import HeartIcon from "@/assets/icons/heart.svg";
import UserIcon from "@/assets/icons/user.svg";
import BriefcaseIcon from "@/assets/icons/briefcase.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import BellIcon from "@/assets/icons/bell.svg";


type StoryProps = ContextMenuProps;

const meta: Meta<StoryProps> = {
  title: 'ui/ContextMenu',
  component: ContextMenu
}

export default meta;

export const UserContextMenu: StoryObj<typeof meta> = {
  args: {
    trigger: <Button>Otwórz Menu</Button>,
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
          <Image opacity="50%" h="20px" src={BellIcon}/>
          <Text fontSize="md" fontWeight="500">Wyloguj</Text>
        </> },
    ]
  }
}