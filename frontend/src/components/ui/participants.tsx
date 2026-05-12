import React, { ReactElement} from "react";
import {
  AvatarRoot,
  Box,
  CardBody, CardDescription,
  CardRoot, CardRootProps, CardTitle,
  CardTitleProps, Flex, FlexProps,
  Separator,
  SimpleGrid, SimpleGridProps,
  Stack,
  Text
} from "@chakra-ui/react";
import {DefaultStatusBadge} from "@/components/ui/content-card-headers.tsx";

export interface ParticipantProps extends FlexProps {
  profilePhoto: ReactElement<typeof AvatarRoot>
  name: ReactElement<typeof Text>
  additionalInfo?: ReactElement<typeof Text>
  actionButton?: ReactElement
  applying?: boolean
}

export interface ParticipantListProps extends CardRootProps {
  participants: ReactElement<typeof Participant>[]
  minColWidth?: string
  title: string
  titleProps?: CardTitleProps
  gridProps?: SimpleGridProps
  noParticipantMsg?: string
}

export const Participant: React.FC<ParticipantProps> = ({
  profilePhoto,
  name,
  additionalInfo,
  actionButton,
  applying = false,
  ...props
}) => {
  return (
    <Flex gap="20px" {...props}>
      {profilePhoto}
      <Stack gap="0" w="100%">
        {applying ? <Box mb="5px"><DefaultStatusBadge status="APLIKUJE" /></Box> : undefined}
        {name}
        {additionalInfo}
      </Stack>
      {actionButton}
    </Flex>
  )
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  title,
  titleProps,
  gridProps,
  minColWidth = "230px",
  noParticipantMsg= "Brak uczestników.",
  ...props
}) => {
  return (
    <CardRoot p="25px" width="100%" {...props}>
        <CardTitle mb="10px" {...titleProps}>
          {title + " (" + participants.length + ")"}
        </CardTitle>
        <Separator/>
        <CardBody p={0} pt="35px">
          {/* templateColumns={"repeat(auto-fit, minmax(" + minColWidth + ", 1fr))"} */}
          <SimpleGrid columns={2} rowGap="40px" columnGap="40px" {...gridProps}>
            {participants.length != 0 ? participants : <CardDescription>{noParticipantMsg}</CardDescription>}
          </SimpleGrid>
        </CardBody>
    </CardRoot>
  )
}