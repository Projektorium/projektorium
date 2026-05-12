import { defineSlotRecipe } from "@chakra-ui/react"

export const tooltipRecipe = defineSlotRecipe({
  slots: ['content'],
  base: {
    content: {
      py: "4px",
      px: "8px",
      borderRadius: "4px",
      bgColor: "text.primary",
      color: "rgba(255, 255, 255, 1)",
      fontWeight: "600",
      fontSize: "sm",
      lineHeight: 1.5,
    },
  },
})
