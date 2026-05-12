import React, {ReactElement, useRef, useState} from "react";
import {Box, Button, ButtonProps, Flex, FlexProps, Input, InputProps} from "@chakra-ui/react";

export interface MainSearchBarProps extends FlexProps {
  searchBarProps?: InputProps,
  searchBarText: string,
  buttonProps?: ButtonProps,
  buttonText?: string,
  onInputSubmit?: (prompt: string) => void,
  reverse?: boolean,
  initialValue?: string,
  buttonIcon: ReactElement
}

export const MainSearchBar: React.FC<MainSearchBarProps> = ({
  searchBarProps,
  searchBarText,
  buttonProps,
  buttonText,
  onInputSubmit,
  reverse = false,
  buttonIcon,
  initialValue='',
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);

  return (
    <Flex alignItems="center" h="64px" flexDirection={reverse ? "row-reverse" : "row"} {...rest}>
      <Input
        borderTopLeftRadius={reverse ? "0" : "full"}
        borderBottomLeftRadius={reverse ? "0" : "full"}
        borderTopRightRadius={reverse ? "full" : "0"}
        borderBottomRightRadius={reverse ? "full" : "0"}
        placeholder={searchBarText}
        bgColor="white"
        border="none"
        outline="none"
        h="100%"
        w="100%"
        pl={reverse ? 0 : "20px"}
        pr={reverse ? "20px" : 0}
        fontSize="18px"
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onInputSubmit) {
            onInputSubmit(e.currentTarget.value);
          }
        }}
        {...searchBarProps}
      />
      <Box
        borderTopRightRadius={reverse ? "0" : "full"}
        borderBottomRightRadius={reverse ? "0" : "full"}
        borderTopLeftRadius={reverse ? "full" : "0"}
        borderBottomLeftRadius={reverse ? "full" : "0"}
        bgColor={searchBarProps?.bgColor ?? "white"}
        h="100%"
        p={2}
      >
        <Button
          borderRadius="full"
          h="100%"
          fontSize="16px"
          onClick={() => {
            if (inputRef.current && onInputSubmit) {
              onInputSubmit(inputRef.current.value);
            }
          }}
          {...buttonProps}
        >
          {buttonIcon}
          {buttonText}
        </Button>
      </Box>
    </Flex>
  )
}
