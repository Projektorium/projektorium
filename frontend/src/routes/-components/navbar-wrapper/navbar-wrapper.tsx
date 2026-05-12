import { AvatarRoot } from "@chakra-ui/react";
import { ReactElement } from "react";

import useAuth from "@/hooks/useAuth";
import { Navbar, NavbarProps } from "@/components/ui/navbar";
import { BlueLogo, WhiteLogo } from "./logos";
import { UserActions } from "./user-actions";
import { useNavigate } from "@tanstack/react-router";


export interface NavbarWrapperProps {
  variant: "blue" | "white";
  notification: boolean;
  userAvatar: ReactElement<typeof AvatarRoot>;
  navbarProps?: NavbarProps;
  loggedin: boolean;
  navigate: ReturnType<typeof useNavigate>;
  searchBar?: ReactElement;
}

export const NavbarWrapper: React.FC<NavbarWrapperProps> = ({
  variant,
  notification,
  userAvatar,
  navbarProps,
  loggedin,
  navigate,
  searchBar
}) => {
  const { user, logout } = useAuth();
  const navigateParams = user ? {to: "/person/$personId", params: { personId: user.id }}
                              : {to: "/login"}
  const userActionProps = {
    variant,
    notification,
    userAvatar,
    loggedin,
    onClickNotifications: () => navigate({to: "/messages"}),
    onClickSaved: () => navigate({to: "/saved"}),
    onClickMyProfile: () => navigate(navigateParams),
    onClickMyProjects: () => navigate({to: "/my-projects"}),
    // onClickSettings: () => alert('Clicked: settings'),
    onClickLogin: () => navigate({to: "/login"}),
    onClickLogout: () => logout()
  };

  return variant === "blue" ? (
    <Navbar
      logo={<WhiteLogo onClick={() => navigate({to: "/"})} />}
      backgroundProps={{ bgColor: "bg.primary", borderColor: "rgba(231, 231, 231, 0.2)" }}
      userActions={<UserActions {...userActionProps} />}
      width="800px"
      height="80px"
      mx="auto"
      searchBar={searchBar}
      {...navbarProps}
    />
  ) : ( // variant === "white"
    <Navbar
      logo={<BlueLogo onClick={() => navigate({to: "/"})} />}
      backgroundProps={{ bgColor: "white", borderColor: "rgba(226, 232, 240, 1)" }}
      userActions={<UserActions {...userActionProps} />}
      width="800px"
      height="80px"
      mx="auto"
      searchBar={searchBar}
      {...navbarProps}
    />
  );
}