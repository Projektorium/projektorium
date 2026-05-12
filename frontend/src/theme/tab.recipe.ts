import { defineSlotRecipe } from "@chakra-ui/react";

export const tabsSlotRecipe = defineSlotRecipe({
  slots: ["root", "list", "trigger"],
  base: {
    root: {
      color: "text.primary",
    }
  },
  variants: {
    variant: {
      line: {
        trigger: {
          color: "text.primary/50",
          fontWeight: "600",
          _selected: {
            color: "text.primary",
            _horizontal: {
              "--indicator-color": "colors.text.primary",
            },
          },
        },
      },
    },
  },
});
