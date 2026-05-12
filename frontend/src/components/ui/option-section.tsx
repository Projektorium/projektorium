import React, { ReactElement } from "react";
import {
  Flex,
  Stack,
  Tabs,
  useTabs,
  FlexProps,
  StackProps,
} from "@chakra-ui/react";

export interface TabProps {
  tabValue: string;
  tabName: ReactElement | string;
  tabContent: ReactElement | string;
}

interface OptionSectionProps extends StackProps {
  tabElements: TabProps[];
  titleElements?: ReactElement | ReactElement[];
  defaultTab: string;
  titleSeparator?: ReactElement;
  tabHeaderProps?: FlexProps;
}

export const OptionSection: React.FC<OptionSectionProps> = ({
  tabElements,
  titleElements,
  titleSeparator,
  defaultTab,
  tabHeaderProps,
  ...props
}) => {
  const tabs = useTabs({
    defaultValue: defaultTab,
  });

  const items =
    Array.isArray(titleElements) || !titleElements
      ? titleElements
      : [titleElements];

  return (
    <Stack
      backgroundColor="bg.component"
      border="primary"
      borderRadius="primary"
      padding="layoutPadding"
      {...props}
    >
      <Tabs.RootProvider value={tabs}>
        <Flex
          flexDirection="row"
          justifyContent={"space-between"}
          {...tabHeaderProps}
        >
          {items?.map((titleElement) => titleElement)}
          <Tabs.List>
            {tabElements.map((tab) => (
              <Flex mr={tab == tabElements[tabElements.length - 1] ? "0" : "24px"}>
                <Tabs.Trigger
                  value={tab.tabValue}
                  p={0}
                  pb="20px"
                >
                  {tab.tabName}
                </Tabs.Trigger>
              </Flex>
            ))}
          </Tabs.List>
        </Flex>
        {titleSeparator}

        {tabElements.map((tab) => (
          <Tabs.Content value={tab.tabValue} py="0">{tab.tabContent}</Tabs.Content>
        ))}
      </Tabs.RootProvider>
    </Stack>
  );
};
