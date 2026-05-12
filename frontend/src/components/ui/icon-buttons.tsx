import React, { useState } from "react";
import {
  Text,
  IconButton,
  IconButtonProps,
  Image,
  Icon,
  Box,
  BoxProps,
} from "@chakra-ui/react";
import HeartIcon from "@/assets/icons/heart.svg";
import FilledHeart from "@/assets/icons/filled-heart.svg";
import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eye-off.svg";
import EditIcon from "@/assets/icons/edit.svg";
import EditWhiteIcon from "@/assets/icons/edit-white.svg";
import DotsIcon from "@/assets/icons/dots-vertical.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import MailIcon from "@/assets/icons/mail.svg";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import WhiteXIcon from "@/assets/icons/x-white.svg";

import { Tooltip, TooltipProps } from "./tooltip";
import { IconProps } from "node_modules/@chakra-ui/react/dist/types/components/avatar/namespace";

interface TooltipButtonProps extends IconButtonProps {
  unsetText?: string;
  setText?: string;
  tooltipProps?: TooltipProps;
}

export const HeartButton: React.FC<TooltipButtonProps & {initialLiked?: boolean}> = ({
  unsetText = "Dodaj do polubionych",
  setText = "Usuń z polubionych",
  tooltipProps,
  onClick,
  initialLiked = false,
  ...props
}) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setLiked(!liked);
    if (onClick) onClick(event);
  };

  const config = {
    "aria-label": "Like",
    onClick: handleClick,
    ...props,
  };

  return (
    <Tooltip
      positioning={{ offset: { mainAxis: 4, crossAxis: 0 } }}
      content={!liked ? unsetText : setText}
      closeDelay={100}
      {...tooltipProps}
    >
      <IconButton variant="circle" {...config}>
        <Image src={!liked ? HeartIcon : FilledHeart} alt="Heart Icon" />
      </IconButton>
    </Tooltip>
  );
};

export const EyeButton: React.FC<TooltipButtonProps> = ({
  unsetText = "Nie pokazuj więcej",
  setText = "Odznacz",
  tooltipProps,
  onClick,
  ...props
}) => {
  const [hidden, setHidden] = useState(false);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setHidden(!hidden);
    if (onClick) onClick(event);
  };

  const config = {
    "aria-label": "Like",
    onClick: handleClick,
    ...props,
  };

  return (
    <Tooltip
      positioning={{ offset: { mainAxis: 4, crossAxis: 0 } }}
      content={!hidden ? unsetText : setText}
      closeDelay={100}
      {...tooltipProps}
    >
      <IconButton variant="circle" {...config}>
        <Image src={!hidden ? Eye : EyeOff} alt="Eye Icon" />
      </IconButton>
    </Tooltip>
  );
};

export const ContactButton: React.FC<IconButtonProps & { text: string }> = ({
  text,
  ...props
}) => {
  return (
    <IconButton
      aria-label="Contact"
      colorScheme="blue"
      variant="ghost"
      borderRadius="24px"
      backgroundColor="rgba(49, 130, 206, 1)"
      color="white"
      padding="22px"
      height="48px"
      {...props}
    >
      <Image
        src={MailIcon}
        alt="Mail Icon"
        height="1.2em"
      />
      <Text fontSize="16px" lineHeight="28px">
        {text}
      </Text>
    </IconButton>
  );
};

export const ShareButton: React.FC<
  IconButtonProps & { beforeShare: string; afterShare: string }
> = ({ beforeShare, afterShare, onClick, ...props }) => {
  const [shared, setShared] = useState(false);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setShared(!shared);
    if (onClick) onClick(event);
  };

  return (
    <IconButton
      aria-label="Share"
      colorScheme="blue"
      variant="ghost"
      borderRadius="24px"
      backgroundColor="rgba(49, 130, 206, 1)"
      color="white"
      padding="22px"
      height="48px"
      size={"sm"}
      onClick={handleClick}
      {...props}
    >
      {shared && <Image src={CheckCircleIcon} alt="Check Circle Icon" height="1.2em" />}
      <Text fontSize="16px" lineHeight="28px">
        {!shared ? beforeShare : afterShare}
      </Text>
    </IconButton>
  );
};

export const EditButton: React.FC<IconButtonProps> = ({ ...props }) => {
  return (
    <IconButton
      aria-label="Edit"
      colorScheme="blue"
      bgColor="transparent"
      outline="none"
      m="-8px"
      {...props}
    >
      <Image
        opacity="50%"
        src={EditIcon}
      />
    </IconButton>
  );
};

export const EditBigButton: React.FC<IconButtonProps & { text: string }> = ({
  text,
  ...props
}) => {
  return (
    <IconButton
      aria-label="Contact"
      colorScheme="blue"
      variant="ghost"
      borderRadius="24px"
      backgroundColor="rgba(49, 130, 206, 1)"
      color="white"
      pl="14px"
      pr="16px"
      height="48px"
      {...props}
    >
      <Image
        src={EditWhiteIcon}
        alt="Edit Icon"
        height="1.2em"
      />
      <Text fontSize="16px" lineHeight="28px">
        {text}
      </Text>
    </IconButton>
  );
};

export const RemoveBigButton: React.FC<IconButtonProps & { text: string }> = ({
  text,
  ...props
}) => {
  return (
    <IconButton
      aria-label="Contact"
      colorScheme="blue"
      variant="ghost"
      borderRadius="24px"
      backgroundColor="rgba(255,114,118)"
      color="white"
      pl="12px"
      pr="16px"
      height="48px"
      {...props}
    >
      <Image
        src={WhiteXIcon}
        alt="X Icon"
        height="1.4em"
      />
      <Text fontSize="16px" lineHeight="28px" ml="-3px">
        {text}
      </Text>
    </IconButton>
  );
};

export const DotsButton: React.FC<IconButtonProps> = ({ ...props }) => {
  return (
    <IconButton
      bgColor="transparent"
      outline="none"
      m="-8px"
      {...props}
    >
      <Image
        src={DotsIcon}
        opacity="50%"
      />
    </IconButton>
  );
};

export const AddButton: React.FC<IconButtonProps> = ({ ...props }) => {
  return (
    <IconButton
      aria-label="add"
      bgColor="transparent"
      outline="none"
      m="-8px"
      {...props}
    >
      <Image opacity="50%" src={PlusIcon}/>
    </IconButton>
  );
};

export const SendMessageButton: React.FC<
  IconButtonProps & { children: React.ReactNode }
> = ({ children, ...props }) => {
  return (
    <IconButton
      aria-label="Send"
      colorScheme="blue"
      variant="ghost"
      borderRadius="24px"
      backgroundColor="rgba(49, 130, 206, 1)"
      color="white"
      padding="22px"
      height="48px"
      size="sm"
      {...props}
    >
      <Text fontSize="16px" lineHeight="28px">
        {children}
      </Text>
    </IconButton>
  );
};

export const BellIcon: React.FC<
  IconButtonProps & { iconProps?: IconProps }
> = ({ iconProps, ...props }) => {
  return (
    <IconButton aria-label="Notifications" {...props}>
      <Icon {...iconProps}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Icon>
    </IconButton>
  );
};

export const BellWithNotificationIcon: React.FC<
  IconButtonProps & { iconProps?: IconProps; circleProps?: BoxProps }
> = ({ iconProps, circleProps, ...props }) => {
  return (
    <IconButton {...props}>
      <Box position="relative" display="inline-block">
        <Icon color={"white"} boxSize={"24px"} {...iconProps}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Icon>
        <Box
          position="absolute"
          boxSizing="content-box"
          top="0px"
          right="0px"
          boxSize="8px"
          bg="white"
          borderRadius="full"
          borderWidth="2px"
          borderStyle="solid"
          {...circleProps}
        />
      </Box>
    </IconButton>
  );
};
