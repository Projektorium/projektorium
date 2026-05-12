import { Tag as ChakraTag } from "@chakra-ui/react"
import { Tooltip, TooltipProps } from "./tooltip"
import * as React from "react"


export interface TagProps extends ChakraTag.RootProps {
  onClose?: VoidFunction
  closable?: boolean
  fontSize?: 'sm' | 'md' | 'lg'
  tooltipProps? : TooltipProps
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag(props, ref) {
    const {
      onClose,
      closable = !!onClose,
      children,
      fontSize = "md",
      tooltipProps,
      ...styles
    } = props


    return (
      <Tooltip
        positioning={{ offset: { mainAxis: 4, crossAxis: 0 } }}
        content=""
        {...tooltipProps}
        closeDelay={100}
        disabled={!tooltipProps}
      >
        <ChakraTag.Root ref={ref} {...styles}>
          <ChakraTag.Label fontSize={fontSize} lineHeight="normal">
            {children}
          </ChakraTag.Label>
          {closable && (
            <ChakraTag.EndElement>
              <ChakraTag.CloseTrigger onClick={onClose} />
            </ChakraTag.EndElement>
          )}
        </ChakraTag.Root>
     </Tooltip>
    )
  },
)
