import React, { ReactElement } from "react"
import { Badge, BadgeProps, Flex, FlexProps} from "@chakra-ui/react"
import { Text, Image } from "@chakra-ui/react"

export interface ProjectStatusProps extends BadgeProps {
  status: string
}

export interface ProfilePageHeaderProps extends FlexProps {
  profilePhoto: ReactElement<typeof Image>
  name: ReactElement<typeof Text>
  additionalInfo?: ReactElement<typeof Text>
}

export interface ContentCardHeaderProps extends FlexProps {
  headerContent : ReactElement<typeof StatusBadge> | ReactElement<typeof Text>
  /** Icons */
  icons?: ReactElement | ReactElement[]
}

export const StatusBadge : React.FC<ProjectStatusProps> = ({
  status,
  ...props
}) => {
  return <Badge {...props}>{status}</Badge>;
}

export const DefaultStatusBadge: React.FC<ProjectStatusProps> = ({
  status = "REKRUTACJA", // Default to "REKRUTACJA" if not provided
  ...props
}) => {
  const args = {
    fontWeight: "bold",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "14px",
    height: "32px",
    backgroundColor: "rgba(49, 130, 206, 0.1)",
    color: "rgba(49, 130, 206, 1)",
  };

  const validStatuses = ["Rekrutacja", "Aktywny", "Zakończony"];
  if (validStatuses.includes(status)) {
    switch (status) {
      case "Aktywny":
        args.backgroundColor = "rgba(56, 161, 105, 0.1)";
        args.color = "rgba(56, 161, 105, 1)";
        break;
      case "Zakończony":
        args.backgroundColor = "rgba(5, 33, 61, 0.05)";
        args.color = "rgba(5, 33, 61, 1)";
        break;
      default:
        break;
    }
  }

  return <Badge {...args} {...props}>{status}</Badge>;
};

export const ProfilePage: React.FC<ProfilePageHeaderProps> = ({
  profilePhoto,
  name,
  additionalInfo,
  ...props
}) => {
  return (
    <Flex gap={3} {...props}>
      {profilePhoto}
      <Flex direction={"column"} justifyContent={"center"} gap={1}>
        {additionalInfo}
        {name}
      </Flex>
    </Flex>
  )
}

export const ContentCardHeader : React.FC<ContentCardHeaderProps> = ({
  headerContent,
  icons,
  onClick,
  ...props
}) => {
  return (
    <Flex justifyContent={"space-between"} {...props} cursor={onClick ? "pointer" : undefined} onClick={onClick}>
      {headerContent}
      <Flex justifyContent={"flex-end"} gap={2}>
        {icons}
      </Flex>
    </Flex>
  )
}
