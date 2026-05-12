import React, {ReactElement} from "react";
import {Box, BoxProps, Flex} from "@chakra-ui/react";
import {MainSearchBar, MainSearchBarProps} from "@/components/ui/main-search-bar.tsx";

export interface MainSearchHeaderProps extends BoxProps {
  maxSearchWidth?: string,
  searchBarProps: MainSearchBarProps;
  headerText: ReactElement<typeof Text>
}

export const MainSearchHeader: React.FC<MainSearchHeaderProps> = ({
  maxSearchWidth = "800px",
  searchBarProps,
  headerText,
  ...rest
}) => {
  return (
    <Box bgColor="white" h="100%" w="100%" {...rest}>
      <Flex
        direction="column"
        alignItems="left"
        h="100%"
        justifyContent="center"
        maxWidth={maxSearchWidth}
        ml="auto"
        mr="auto"
      >
        {headerText}
        <Box mt="25px">
          <MainSearchBar {...searchBarProps}/>
        </Box>
      </Flex>
    </Box>
  )
}
