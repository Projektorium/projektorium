import { ProfilesService } from "@/client"
import { queryOptions } from "@tanstack/react-query"

export const getProfileQueryOptions = ({ personId } : {personId : string}) => {
  return queryOptions({
    queryKey: ["profile", { personId }],
    queryFn: () => ProfilesService.readProfile({profileId : personId})
  })
}

export const getProjectQueryOptions = ({ personId }: { personId: string }) => {
  return queryOptions({
    queryKey: ["profile_projects", { personId }],
    queryFn: () => ProfilesService.readUserProjects({ userId: personId})
  });
};