import React from "react";
import { Text, Separator } from "@chakra-ui/react";
import { OptionSection } from "@/components/ui/option-section";
import { SkeletonList } from "@/components/ui/card-skeletons";

interface SearchListSkeletonProps {
  titleText: string;
}

export const SearchListSkeleton: React.FC<SearchListSkeletonProps> = ({ titleText }) => {
  // Use the exact same props as the real SearchList component
  const stackProps = {
    titleSeparator: <Separator width="100%" />,
    width: "800px",
    mt: "40px",
  };

  const tabElements = [
    {
      tabValue: "projects",
      tabName: (
        <Text fontSize="xl" fontWeight="600">
          Projekty (<Text as="span" display="inline">...</Text>)
        </Text>
      ),
      tabContent: <SkeletonList type="project" count={3} />,
    },
    {
      tabValue: "members",
      tabName: (
        <Text fontSize="xl" fontWeight="600">
          Osoby (<Text as="span" display="inline">...</Text>)
        </Text>
      ),
      tabContent: <SkeletonList type="person" count={3} />,
    },
  ];

  return (
    <OptionSection
      tabElements={tabElements}
      defaultTab="projects"
      titleElements={
        <Text fontWeight="600" fontSize="xl" alignContent="start" mt="-6px">
          {titleText}
        </Text>
      }
      {...stackProps}
    />
  );
};