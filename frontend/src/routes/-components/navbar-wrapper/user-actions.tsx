import { ContextMenuItem, ContextMenu } from "@/components/ui/context-menu";
import { Flex, IconButton, Text, Image, AvatarRoot } from "@chakra-ui/react";
import { ReactElement, ComponentProps } from "react";
import { BlueMenuTrigger, WhiteMenuTrigger, LoginTrigger } from "./triggers";

import HeartIcon from "@/assets/icons/heart-menu.svg";
import UserIcon from "@/assets/icons/user.svg";
import BriefcaseIcon from "@/assets/icons/briefcase.svg";
// import SettingsIcon from "@/assets/icons/settings.svg";
import BellIcon from "@/assets/icons/bell.svg";
import BlueBellIcon from "@/assets/icons/bell-blue.svg"
import BlueBellNotificationIcon from "@/assets/icons/bell-blue-notification.svg"
import WhiteBellIcon from "@/assets/icons/bell-white.svg"
import WhiteBellNotificationIcon from "@/assets/icons/bell-white-notification.svg"


interface UserActionsProps {
  variant: "blue" | "white";
  notification: boolean;
  userAvatar: ReactElement<typeof AvatarRoot>;
  loggedin: boolean;
  onClickNotifications: () => void;
  onClickSaved: () => void;
  onClickMyProfile: () => void;
  onClickMyProjects: () => void;
  // onClickSettings: () => void;
  onClickLogin: () => void;
  onClickLogout: () => void;
}

const NavbarMenuElement = ({
  icon,
  name,
  imageProps,
  onClick
}: {
  icon: string;
  name: string;
  imageProps?: ComponentProps<typeof Image>;
  onClick?: () => void;
}) => (
  <Flex
    p="12px"
    gap="12px"
    w="100%"
    h="100%"
    align="center"
    onClick={onClick}
  >
    <Image opacity="50%" src={icon} objectFit="contain" {...imageProps} />
    <Text fontSize="md" fontWeight="500">{name}</Text>
  </Flex>
)



export const UserActions: React.FC<UserActionsProps> = ({
  variant,
  notification,
  userAvatar,
  loggedin,
  onClickNotifications,
  onClickSaved,
  onClickMyProfile,
  onClickMyProjects,
  // onClickSettings,
  onClickLogin,
  onClickLogout
}) => {
  const navbarMenuItems = [
    {
      value: "Zapisane",
      element: <NavbarMenuElement
        icon={HeartIcon}
        name={"Zapisane"}
        onClick={onClickSaved}
      />
    },
    'separator',
    {
      value: "Mój profil",
      element: <NavbarMenuElement
        icon={UserIcon}
        name={"Mój profil"}
        onClick={onClickMyProfile}
      />
    },
    {
      value: "Moje Projekty",
      element: <NavbarMenuElement
        icon={BriefcaseIcon}
        name={"Moje projekty"}
        onClick={onClickMyProjects}
      />
    },
    /* {
      value: "Ustawienia",
      element: <NavbarMenuElement
        icon={SettingsIcon}
        name={"Ustawienia"}
        onClick={onClickSettings}
      />
    }, */
    'separator',
    {
      value: "Wyloguj",
      element: <NavbarMenuElement
        icon={BellIcon}
        name={"Wyloguj"}
        onClick={onClickLogout}
      />
    }
  ] as ("separator" | ContextMenuItem)[];

  return variant === "blue" ? (
    <Flex align="center" gap="8px">
      { loggedin &&
        <IconButton
          w="48px"
          h="48px"
          outline="none"
          bg="transparent"
          onClick={onClickNotifications}
        >
          {
            notification ? (
              <Image src={WhiteBellNotificationIcon} />
            ) : (
              <Image src={WhiteBellIcon} />
            )
          }
        </IconButton>
      }
      {!loggedin ? (
        <LoginTrigger variant="blue" onClick={onClickLogin}/>
      ) : (
        <ContextMenu
          closeOnSelect={true}
          menuItems={navbarMenuItems}
          trigger={BlueMenuTrigger({ userAvatar })}
        />
      )}
    </Flex>
  ) : (
    <Flex align="center" gap="8px">
      { loggedin &&
        <IconButton
          w="48px"
          h="48px"
          outline="none"
          bg="transparent"
          onClick={onClickNotifications}
        >
          {
            notification ? (
              <Image src={BlueBellNotificationIcon} />
            ) : (
              <Image src={BlueBellIcon} />
            )
          }
        </IconButton>
      }
      {!loggedin ? (
        <LoginTrigger variant="white" onClick={onClickLogin}/>
      ) : (
        <ContextMenu
          closeOnSelect={true}
          menuItems={navbarMenuItems}
          trigger={WhiteMenuTrigger({ userAvatar })}
        />
      )}
    </Flex>
  );
};