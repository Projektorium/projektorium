// likesQueries.ts
import { queryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query"
import { 
  LikesService, 
  LikesGetUsersLikeInfoData, 
  LikesGetProjectsLikeInfoData,
  UserPublic,
  ProjectPublic
} from "@/client"

// Better typed response interfaces
interface UserLikeInfo {
  user_id: string;
  is_liked: boolean;
}

interface ProjectLikeInfo {
  project_id: string;
  is_liked: boolean;
}


export const getUserLikesQueryOptions = ({requestBody: user_ids} : LikesGetUsersLikeInfoData) => {
  return queryOptions({
    queryKey: ["user-likes", user_ids],
    queryFn: () => LikesService.getUsersLikeInfo({requestBody: user_ids}),
  })
}

export const getProjectLikesQueryOptions = ({requestBody: project_ids} : LikesGetProjectsLikeInfoData) => {
  return queryOptions({
    queryKey: ["project-likes", project_ids],
    queryFn: () => LikesService.getProjectsLikeInfo({requestBody: project_ids}),
  })
}

export const getLikedUsersQueryOptions = (skip?: number, limit?: number) => {
  return queryOptions({
    queryKey: ["liked-users", skip, limit],
    queryFn: () => LikesService.getLikedUsers({ skip, limit }),
  })
}

export const getLikedProjectsQueryOptions = (skip?: number, limit?: number) => {
  return queryOptions({
    queryKey: ["liked-projects", skip, limit],
    queryFn: () => LikesService.getLikedProjects({ skip, limit }),
  })
}

interface UserParams {
  user_ids: string[];
}

interface ProjectParams {
  project_ids: string[];
}

interface UserProjectParams extends UserParams, ProjectParams {}

interface PaginationParams {
  skip?: number;
  limit?: number;
}

export const useUserLike = ({user_ids}: UserParams): Record<string, boolean> => {
  const {data} = useSuspenseQuery(getUserLikesQueryOptions({requestBody: user_ids}))

  const result: Record<string, boolean> = {};
  data.forEach((userLike: UserLikeInfo) => {
    result[userLike.user_id] = userLike.is_liked;
  });

  return result;
}

export const useProjectLike = ({project_ids}: ProjectParams): Record<string, boolean> => {
  const {data} = useSuspenseQuery(getProjectLikesQueryOptions({requestBody: project_ids}))

  const result: Record<string, boolean> = {};
  data.forEach((projectLike: ProjectLikeInfo) => {
    result[projectLike.project_id] = projectLike.is_liked;
  });

  return result;
}

export const useUserProjectLike = ({user_ids, project_ids}: UserProjectParams): {
  userLikes: Record<string, boolean>;
  projectLikes: Record<string, boolean>;
} => {
  const results = useSuspenseQueries({
    queries: [
      getUserLikesQueryOptions({requestBody: user_ids}),
      getProjectLikesQueryOptions({requestBody: project_ids})
    ],
    combine: (results) => {
      const [userResults, projectResults] = results;
      
      const userLikes: Record<string, boolean> = {};
      userResults.data?.forEach((userLike: UserLikeInfo) => {
        userLikes[userLike.user_id] = userLike.is_liked;
      });
      
      const projectLikes: Record<string, boolean> = {};
      projectResults.data?.forEach((projectLike: ProjectLikeInfo) => {
        projectLikes[projectLike.project_id] = projectLike.is_liked;
      });
      
      return { userLikes, projectLikes };
    }
  });
  
  return results;
}


export const useLiked = (params: PaginationParams = {}): {
  likedUsers: UserPublic[];
  likedProjects: ProjectPublic[];
} => {
  const { skip, limit } = params;
  
  const results = useSuspenseQueries({
    queries: [
      getLikedUsersQueryOptions(skip, limit),
      getLikedProjectsQueryOptions(skip, limit)
    ],
    combine: (results) => {
      const [usersResults, projectsResults] = results;
      return {
        likedUsers: usersResults.data || [],
        likedProjects: projectsResults.data || []
      };
    }
  });
  
  return results;
}