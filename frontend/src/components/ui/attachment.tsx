import {Box, Flex, FlexProps, IconButton, IconButtonProps, Text} from "@chakra-ui/react";
import React, {ReactElement} from "react";
import {RiDownloadLine} from "react-icons/ri";
import {IconBaseProps} from "react-icons";


export interface AttachmentProps extends FlexProps {
  fileName: ReactElement<typeof Text>,
  fileDsc: ReactElement<typeof Text>,
  date: ReactElement<typeof Text>,
  buttonProps?: IconButtonProps,
  iconProps?: IconBaseProps,
  actionButton?: ReactElement,
  onClick: (event: any) => void
}

export const Attachment: React.FC<AttachmentProps> = ({
  fileName,
  fileDsc,
  date,
  buttonProps,
  iconProps,
  actionButton,
  onClick,
  ...props
}) => {
  return (
    <Flex alignItems="center" gap="20px" {...props}>
      <IconButton onClick={onClick} {...buttonProps}>
        <RiDownloadLine {...iconProps}/>
      </IconButton>
      <Flex w="100%">
        <Box>
          <Box onClick={onClick}>
            {fileName}
          </Box>
          {fileDsc}
        </Box>
        <Box ml={"auto"}>
          {date}
        </Box>
      </Flex>
      {actionButton}
    </Flex>
  )
}
