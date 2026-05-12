import { OptionSection } from "@/components/ui/option-section";
import { Text, Separator } from "@chakra-ui/react";
import { MembersList } from "../members-lists";
import { ProjectsList } from "../projects-lists";
import { UserPublic, ProjectPublic } from "@/client";
import { useNavigateScroll } from "@/components/ui/link-scroll";

interface SearchListProps {
  people: UserPublic[];
  projects: ProjectPublic[];
  navigate: ReturnType<typeof useNavigateScroll>;
  titleText: string;
}

export const SearchList: React.FC<SearchListProps> = ({people, projects, titleText, navigate}) =>{
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
            Projekty ({projects.length})
          </Text>
        ),
        tabContent: <ProjectsList projects={projects} navigate={navigate} />,
      },
      {
        tabValue: "members",
        tabName: (
          <Text fontSize="xl" fontWeight="600">
            Osoby ({people.length})
          </Text>
        ),
        tabContent: <MembersList people={people} navigate={navigate} />,
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
)}