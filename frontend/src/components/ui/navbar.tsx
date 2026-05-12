import React, { ReactElement } from "react";
import { Flex, Box, FlexProps, BoxProps } from "@chakra-ui/react";

export interface NavbarProps extends FlexProps {
  logo: ReactElement;
  searchBar?: ReactElement;
  userActions?: ReactElement;
  backgroundProps?: BoxProps;
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  searchBar,
  userActions,
  backgroundProps,
  ...props
}) => {
  return (
    <Box
      width={"100%"}
      bgColor= 'bg.primary'
      borderBottomWidth= "1px"
      borderBottomStyle= "solid"
      {...backgroundProps}
    >
      <Flex alignItems="center" justifyContent="space-between" {...props}>
        {logo}
        {searchBar}
        {userActions}
      </Flex>
    </Box>
  );
};
