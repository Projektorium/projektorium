import { SearchService } from "@/client"
import { queryOptions, useSuspenseQueries } from "@tanstack/react-query"
import { SearchGetPeopleData, SearchGetProjectsData } from "@/client"

export const getPeopleQueryOptions = ({query, limit} : SearchGetPeopleData) => {
  return queryOptions({
    queryKey: ["search-people", { query, limit }],
    queryFn: () => SearchService.getPeople({ query, limit}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // 10 minutes
  })
}

export const getProjectQueryOptions = ({query, limit} : SearchGetProjectsData) => {
  return queryOptions({
    queryKey: ["search-projects", { query, limit }],
    queryFn: () => SearchService.getProjects({ query, limit}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000    // 10 minutes
  })
}

interface SearchParams {
  query?: string;
  peopleLimit?: number;
  projectsLimit?: number;
}


export const useSearchResults = ({
  query = '',
  peopleLimit = 10,
  projectsLimit = 10
}: SearchParams) => {
  const results = useSuspenseQueries({
    queries: [
      getPeopleQueryOptions({ query, limit: peopleLimit }),
      getProjectQueryOptions({ query, limit: projectsLimit })
    ]
  })

  const [peopleResults, projectResults] = results

  return {
    people: peopleResults.data.users,
    projects: projectResults.data.projects,
    isPeopleLoading: peopleResults.isLoading,
    isProjectsLoading: projectResults.isLoading,
    isPeopleError: peopleResults.isError,
    isProjectsError: projectResults.isError,
    peopleError: peopleResults.error,
    projectsError: projectResults.error,
    refetch: () => {
      peopleResults.refetch()
      projectResults.refetch()
    }
  }
}