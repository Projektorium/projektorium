import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"
import { separatorRecipe } from "./theme/separator.recipe"
import { tooltipRecipe } from "./theme/tooltip.recipe"
import { tagRecipe } from "./theme/tag.recipe"
import { tabsSlotRecipe } from "./theme/tab.recipe"
import { textareaRecipe } from "./theme/textarea.recipe"

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      fontSize: "16px",
      backgroundColor:" rgba(248, 248, 248, 1)",
    },
    body: {
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    },
  },
  theme: {
    tokens: {
      colors: {
        text: {
          primary: {value: 'rgba(5, 33, 61, 1)'},
          secondary: {value: 'rgba(5, 33, 61, 0.7)'},
        },
        bg: {
          component: {value: 'rgba(255, 255, 255, 1)'},
          hover: {value: 'rgba(248, 248, 248, 1)'},
          primary: {value: 'rgba(49, 130, 206, 1)'}
        },
        link: { value: "rgba(49, 130, 206, 1)" },        // #3182CE
        linkHover: { value: "rgba(44, 82, 130, 1)" },      // #2C5282
      },
      fonts: {
        body: { value: "Inter, sans-serif" },
        heading: { value: "Inter, sans-serif" },
      },
      borders: {
        primary: {value: '1px solid rgba(226, 232, 240, 1)'},
        secondary: {value: '1px solid rgba(255, 255, 255, 0.25)'}
      },
      radii: {
        primary: { value: "16px" },
      },
      spacing: {
        layoutPadding: { value: "40px", description: "padding used for layout in stack, flex components" },
      }
    },
    recipes: {
      button: buttonRecipe,
      separator: separatorRecipe,
      textarea: textareaRecipe,
    },
    slotRecipes: {
      tooltip: tooltipRecipe,
      tag: tagRecipe,
      tabs: tabsSlotRecipe,
    }
  },
})
