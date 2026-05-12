import { MainSearchBar, MainSearchBarProps } from "@/components/ui/main-search-bar.tsx";
import SearchIcon from "@/assets/icons/search.svg"
import { Image } from "@chakra-ui/react";

interface SearchBarProps extends Partial<MainSearchBarProps> {
  onSearch : (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ( { onSearch, ...props }) => {
  const newProps = {
    ...props,
    searchBarProps: {
      bgColor: "rgba(244, 245, 245, 1)",
      ...props.searchBarProps,
    }
  };


  return (
  <MainSearchBar
    width="280px"
    h="48px"
    searchBarText='np. "Big Data"'
    buttonProps={{ p: "0", color: "black", bgColor: "transparent" }}
    reverse={true}
    onInputSubmit={onSearch}
    buttonIcon={<Image w="14px" h="14px" objectFit="contain" src={SearchIcon} />}
    {...newProps}
  />
)}
