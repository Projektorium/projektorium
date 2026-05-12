import {AvatarFallback, AvatarImage, AvatarRoot, Flex, Stack} from "@chakra-ui/react";
import { Outlet, createFileRoute, useSearch } from "@tanstack/react-router";
import { NavbarWrapper } from "@/routes/-components/navbar-wrapper/navbar-wrapper";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll.tsx";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { SearchBar } from "./-components/navbar-wrapper/search-bar";
import { getImageUrl } from "@/utils";

// import Sidebar from "@/components/Common/Sidebar"
// import { isLoggedIn } from "@/redux/authSlice"
// import store from "@/redux/store"

export const CARD_PADDING_X = { base: "40px", md: "40px", lg: "40px" };

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  const navigate = useNavigate();
  const { query } = useSearch({ strict: false });
  const { user } = useAuth();

  const profilePhoto = <AvatarRoot w="32px" h="32px">
    <AvatarFallback name={(user ? user.name : "") + " " + (user ? user.last_name : "")} />
    <AvatarImage src={user && user.profile_image ? getImageUrl(user.profile_image) : undefined} />
  </AvatarRoot>;

  return (
    <Flex direction="column">
      <NavbarWrapper
        variant="white"
        loggedin={isLoggedIn()}
        userAvatar={profilePhoto}
        notification={false}
        navigate={navigate}
        searchBar={
          <SearchBar
            initialValue={query}
            onSearch={(query: string) => navigate({ to: "/search", search: { query } })}
          />
        }
      />
      <Flex flex="1" overflow="hidden">
        <Flex flex="1" direction="column" p={4} pt={0} overflowY="auto">
          <Stack width={"800px"} gap="24px" mx="auto">
            <Outlet />
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Layout;
