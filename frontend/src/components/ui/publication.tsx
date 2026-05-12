import {Box, Flex, Text, Image, FlexProps} from "@chakra-ui/react";
import React, {ReactElement} from "react";


export interface AttachmentProps extends FlexProps {
  image: ReactElement<typeof Image>,
  fileName: ReactElement<typeof Text>,
  fileDsc: ReactElement<typeof Text>,
  author: ReactElement<typeof Text>,
  date: ReactElement<typeof Text>,
  actionButton?: ReactElement,
  onClick: (event: any) => void
}

export const Publication: React.FC<AttachmentProps> = ({
  image,
  fileName,
  fileDsc,
  author,
  date,
 actionButton,
  onClick,
  ...props
}) => {
  return (
    <Flex alignItems="top" gap="20px" {...props}>
      {image}
      <Flex direction="column" width="100%">
        <Flex w={"100%"}>
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
        <Box mt={"auto"}>
          {author}
        </Box>
      </Flex>
      {actionButton}
    </Flex>
  )
}
