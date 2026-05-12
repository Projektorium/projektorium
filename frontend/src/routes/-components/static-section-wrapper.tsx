import { Separator, TextProps } from "@chakra-ui/react";
import {CardContentSectionProps, PaginatedListProps, StaticCardSection} from "../../components/ui/static-card-section";

interface CardContentSectionWrapperProps
  extends Partial<Omit<CardContentSectionProps, "title">>,
    Required<Pick<CardContentSectionProps, "title">> {}


interface ProjectCardWrapperProps {
  cards: React.ReactElement[]
  textProps?: TextProps
  cardSectionProps: CardContentSectionWrapperProps
  listProps?: Omit<PaginatedListProps, "cards" | "itemsPerPage">
}

export const StaticSectionCardWrapper: React.FC<ProjectCardWrapperProps> = ({
  cards,
  textProps,
  cardSectionProps,
  listProps
}) => {

  const defaultTextProps = {
    fontSize: "20px",
    fontWeight: "600",
    color: "text.primary",
    mb: "12px",
    width: "100%",
    ...textProps
  };

  const projectStackProps = {
    titleSeparator: <Separator width={"100%"}/>,
    titleProps: defaultTextProps,
    itemsPerPage: 4,
    border: "primary",
    borderRadius: "primary",
    padding: "40px",
    listProps: {
      separator: <Separator />,
      cards,
      ...listProps
    },
    ...cardSectionProps
  };

  return <StaticCardSection {...projectStackProps} />
}
