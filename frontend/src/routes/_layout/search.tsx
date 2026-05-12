import { createFileRoute } from "@tanstack/react-router";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll";
import { z } from "zod";
import { SearchList } from "../-components/search-list/search-list";
import { useSearchResults } from "../-search-utils/queries";
import useAuth from "@/hooks/useAuth";
import { Suspense } from "react";
import LandingPage from "..";
import { SearchListSkeleton } from "../-components/search-list/search-list-skeleton";

const searchSchema = z.object({
  section: z.enum(["projects", "people"]).default("projects"),
  page: z.coerce.number().int().min(1).default(1),
  query: z.string().default(""),
});

export const Route = createFileRoute("/_layout/search")({
  component: SearchPageWrapper,
  validateSearch: searchSchema,
});


function SearchPageWrapper() {
  return (
    <Suspense fallback={<SearchListSkeleton titleText="Szukam🚀..."/>}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const navigate = useNavigate();
  useAuth();
  const { query }: { query: string | undefined } = Route.useSearch();
  const { people, projects } = useSearchResults({ query });

  return <SearchList projects={projects} people={people} titleText="Wyniki wyszukiwania" navigate={navigate} />;
}

export default LandingPage;
