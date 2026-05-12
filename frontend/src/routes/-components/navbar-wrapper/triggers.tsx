import {IconButton, HStack, AvatarRoot, Image, Text, IconButtonProps} from "@chakra-ui/react";
import { ReactElement } from "react";
import WhiteHamburgerIcon from "@/assets/icons/hamburger-white.svg"
import BlueHamburgerIcon from "@/assets/icons/hamburger-blue.svg"

export const WhiteMenuTrigger = ({
  userAvatar
}: { userAvatar: ReactElement<typeof AvatarRoot> }) => (
  <IconButton
    outline="none"
    bgColor="transparent"
    w="90px"
    h="48px"
    borderRadius="24px"
    border="primary"
    _hover={{ background: "text.primary/5" }}
    p="8px"
    pl="16px"
  >
    <HStack gap="10px">
      <Image src={BlueHamburgerIcon} />
      {userAvatar}
    </HStack>
  </IconButton>
);

export const BlueMenuTrigger = ({
  userAvatar
}: { userAvatar: ReactElement<typeof AvatarRoot> }) => (
  <IconButton
    outline="none"
    bgColor="transparent"
    w="90px"
    h="48px"
    borderRadius="24px"
    border="secondary"
    _hover={{ background: "text.primary/5" }}
    p="8px"
    pl="16px"
  >
    <HStack gap="10px">
      <Image src={WhiteHamburgerIcon} />
      {userAvatar}
    </HStack>
  </IconButton>
);

export const LoginTrigger = ({
  variant,
  ...props
}: {
  variant: "white" | "blue"
} & IconButtonProps) => (
  <IconButton
    outline="none"
    bgColor="transparent"
    w="90px"
    h="48px"
    borderRadius="24px"
    border={variant == "white" ? "primary" : "secondary"}
    _hover={{ background: "text.primary/5" }}
    display="flex"
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <Text color={variant == "white" ? "text.primary" : "white"}>Zaloguj</Text>
  </IconButton>
)