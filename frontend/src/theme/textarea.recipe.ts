import { defineRecipe } from "@chakra-ui/react"

export const textareaRecipe = defineRecipe({
  base: {
    border: 'borders.primary',
    color: 'text.primary',
    _placeholder: {
      color: 'text.secondary',
    },
    fontFamily: 'body',
  },
  variants: {
    variant: {
      outline: {
        bg: "transparent",
        border: 'border.primary',
        focusVisibleRing: "inside",
      },
    },
  },
})
