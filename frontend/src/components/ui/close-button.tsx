import type { ButtonProps } from "@chakra-ui/react"
import { IconButton as ChakraIconButton, Button as ChakraButton } from "@chakra-ui/react"
import * as React from "react"
import { LuX } from "react-icons/lu"

export type CloseButtonProps = ButtonProps

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
      {props.children ?? <LuX />}
    </ChakraIconButton>
  )
})


// New TextCloseButton Component
export const TextCloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function TextCloseButton(props, ref) {
  return (
    <ChakraButton
      ref={ref}
      variant="ghost"
      fontFamily="body"
      fontSize="16px"
      lineHeight="28px"
      color="text.secondary"
      border={0}
      {...props}
    >
      {props.children}
    </ChakraButton>
  );
});
