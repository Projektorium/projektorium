import React, { ReactElement } from 'react';
import {
  Flex, FlexProps, Image, ImageProps,
  MenuContentProps,
  MenuItemProps, MenuRootProps, Text,
} from '@chakra-ui/react';

import {
  MenuContent,
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
  MenuItem,
} from "@/components/ui/menu";

export interface ContextMenuItem extends Omit<MenuItemProps, 'children'> {
  element: ReactElement;
}

export interface ContextMenuProps extends Partial<MenuRootProps> {
  trigger: ReactElement;
  menuItems: Array<ContextMenuItem | 'separator'>;
  menuContentProps?: MenuContentProps;
  menuItemProps?: Omit<MenuItemProps, "value">;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  trigger,
  menuItems,
  menuContentProps,
  menuItemProps,
  ...props
}) => {
  return (
    <MenuRoot {...props}>
      <MenuTrigger asChild>
        {trigger}
      </MenuTrigger>
      <MenuContent
        borderStyle="1px solid rgba(226, 232, 240, 1)"
        borderRadius="16px"
        padding="16px"
        {...menuContentProps}
      >
        {menuItems.map((item, index) =>
          item === 'separator' ? (
            <MenuSeparator key={`separator-${index}`} my="8px" w="100%" mx="0"/>
          ) : (
            <MenuItem
              key={item.value ?? index}
              h="48px"
              w="208px"
              p="0"
              cursor="pointer"
              {...item}
              {...menuItemProps}
            >
              {item.element}
            </MenuItem>
          )
        )}
      </MenuContent>
    </MenuRoot>
  );
};

export interface ContextMenuOptionProps extends FlexProps {
  icon: string;
  text: string;
  onClick: () => void;
  iconProps?: ImageProps;
}

export const ContextMenuOption: React.FC<ContextMenuOptionProps> = ({
  icon,
  text,
  onClick,
  iconProps,
  ...props
}) => (
  <Flex
    gap="12px"
    p="12px"
    w="100%"
    h="100%"
    onClick={onClick}
    {...props}
  >
    <Image opacity="50%" w="20px" objectFit="contain" src={icon} {...iconProps}/>
    <Text fontSize="md" fontWeight="500">{text}</Text>
  </Flex>
)
