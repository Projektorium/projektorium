import {Stack, Text, AvatarImage, Flex, Image, AvatarFallback, AvatarRoot} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigateScroll as useNavigate, useNavigateScroll } from "@/components/ui/link-scroll";
import { z } from "zod";
import SearchWhiteIcon from "@/assets/icons/search-white.svg";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";

// Component imports
import { NavbarWrapper } from "@/routes/-components/navbar-wrapper/navbar-wrapper";
import { MainSearchHeader } from "@/components/ui/main-search-header";

import { useSearchResults } from "./-search-utils/queries";
import { SearchList } from "./-components/search-list/search-list";
import { Suspense } from "react";
import { SearchListSkeleton } from "./-components/search-list/search-list-skeleton";
import { getImageUrl } from "@/utils";

// Route configuration
const searchSchema = z.object({
  section: z.enum(["projects", "people"]).default("projects"),
  page: z.coerce.number().int().min(1).default(1),
});

export const Route = createFileRoute("/")({
  component: LandingPage,
  validateSearch: searchSchema,
});


function LandingPage() {
  const navigate = useNavigate();
  const {user} =  useAuth();

  const profilePhoto = <AvatarRoot w="32px" h="32px">
    <AvatarFallback name={`${user ? user.name : ""} ${user ? user.last_name : ""}`} />
    <AvatarImage src={user && user.profile_image ? getImageUrl(user.profile_image) : undefined} />
  </AvatarRoot>;

  return (
    <>
      <NavbarWrapper
        variant="blue"
        loggedin={isLoggedIn()}
        userAvatar={profilePhoto}
        notification={false}
        navigate={navigate}
      />
      <Header navigate={navigate} />
      <Flex flex="1" overflow="hidden">
        <Flex flex="1" direction="column" p={4} pt={0} overflowY="auto">
          <Stack width="800px" gap={10} mx="auto">
            <Suspense fallback={<SearchListSkeleton titleText="Szukam🚀..."/>}>
              <RecommendationsList navigate={navigate} />
            </Suspense>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
}

// This component must be outside the landing page so that when it suspends the other components
// are still visible.
function RecommendationsList({ navigate }: { navigate: ReturnType<typeof useNavigateScroll> }) {
  const { people, projects } = useSearchResults({});

  return (
    <SearchList
      projects={projects}
      people={people}
      titleText="Polecane dla Ciebie"
      navigate={navigate}
    />
  );
}

function Header({ navigate }: {navigate: ReturnType<typeof useNavigateScroll>}) {
  return (
    <MainSearchHeader
      maxSearchWidth="800px"
      height="264px"
      searchBarProps={{
        searchBarText: 'np. "Projekty łączące biologię z matematyką"',
        buttonText: "Wyszukaj",
        buttonProps: {
          bgColor: "#05213D",
          px: "25px",
        },
        buttonIcon: <Image w="14px" h="14px" objectFit="contain" src={SearchWhiteIcon} />,
        onInputSubmit: (query: string) => navigate({ to: "/search", search: { query } }),
      }}
      headerText={
        <Text
          style={{ whiteSpace: "pre-line" }}
          fontSize="40px"
          fontWeight="600"
          color="white"
          lineHeight="shorter"
          overflow="hidden"
        >
          {"Znajdź coś\n dla Siebie"}
        </Text>
      }
      bgColor="rgba(49, 130, 206, 1)"
    />
  );
}

export default LandingPage;