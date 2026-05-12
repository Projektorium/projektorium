import { defineSlotRecipe } from "@chakra-ui/react";

export const tagRecipe = defineSlotRecipe({
  slots: ["root"],
  variants: {
      variant: {
        primary: {
          root: {
          paddingX: "18px",
          paddingY: "12px",
          borderRadius: "24px",
          backgroundColor: "text.primary/5",
          color: "text.primary",
          fontWeight: "600",
          _hover: {
            backgroundColor: "text.primary/10",
          },
        }}
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
