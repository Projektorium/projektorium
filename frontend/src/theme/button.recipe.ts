import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    colorPalette: "gray.300",
  },
  variants: {
    variant: {
      primary: {
        borderRadius: "24px",
        bgColor: "rgba(49, 130, 206, 1)",
        color: "rgba(255, 255, 255, 1)",
        fontWeight: "600",
      },
      secondary: {
        borderRadius: "24px",
        bgColor: "text.primary/5", // 5% opacity
        color: "text.primary",
        fontWeight: "600",
        _hover: {
          bgColor: "text.primary/10",
        }
      },
      circle: {
        borderRadius: "full",
        px: "16px",
        boxSize: "48px",
        size: "sm",
        bgColor: "text.primary/5",
        color: "text.primary",
        fontWeight: "600",
        _hover: {
          bgColor: "text.primary/10",
        }
      }
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})
