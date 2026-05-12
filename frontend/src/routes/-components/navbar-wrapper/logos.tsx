import { IconButtonProps, IconButton, Text, Image } from "@chakra-ui/react";
import WhiteLogoIcon from "@/assets/icons/projektorium-logo-white.svg"
import BlueLogoIcon from "@/assets/icons/projektorium-logo-blue.svg"

export const WhiteLogo = ({
  ...props
}: IconButtonProps) => (
  <IconButton bg={"transparent"} {...props}>
    <Image src={WhiteLogoIcon} />
    <Text
      color="#FFFFFF"
      fontWeight="semibold"
      textStyle="xl"
      objectPosition="right"
      pl="12.38px"
    >
      Projektorium
    </Text>
  </IconButton>
);

export const BlueLogo = ({
  ...props
}: IconButtonProps) => (
  <IconButton bg={"transparent"} {...props}>
    <Image src={BlueLogoIcon} />
    <Text
      color="text.primary"
      fontWeight="semibold"
      textStyle="xl"
      objectPosition="right"
      pl="12.38px"
    >
      Projektorium
    </Text>
  </IconButton>
);