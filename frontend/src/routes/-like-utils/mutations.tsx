// likesMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LikesService } from "@/client"

// Generic function to create like/unlike mutations
function createLikeMutation(
  mutationFn: (id: string) => Promise<any>,
  entityType: 'user' | 'project',
  isLike: boolean
) {
  return () => {
    const queryClient = useQueryClient();
    const idKey = entityType === 'user' ? 'user_id' : 'project_id';
    const likesQueryKey = entityType === 'user' ? 'user-likes' : 'project-likes';
    const entityQueryKey = entityType === 'user' ? 'liked-users' : 'liked-projects';
  
    const updateLikeStatus = (id: string, liked: boolean) => {
      // Update any queries that include this entity's like status
      queryClient.setQueriesData(
        { queryKey: [likesQueryKey] },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            const exists = oldData.some(item => item[idKey] === id);

            if (exists) {
              // Update existing entity
              return oldData.map(item => 
                item[idKey] === id ? { ...item, is_liked: liked } : item
              );
            } else if (liked) {
              // Add new entity if it's being liked
              const newItem = { [idKey]: id, is_liked: true };
              return [...oldData, newItem];
            }
          }
          return oldData;
        }
      );
    };

    return useMutation({
      mutationFn: (id: string) => mutationFn(id),
      
      onMutate: async (id) => {
        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries({ queryKey: [likesQueryKey] });
        await queryClient.cancelQueries({ queryKey: [entityQueryKey] });

        // Snapshot the previous values
        const previousLikes = queryClient.getQueryData([likesQueryKey]);
        const previousEntities = queryClient.getQueryData([entityQueryKey]);

        // Optimistically update to the new value
        updateLikeStatus(id, isLike);
        
        // If unliking, also remove from liked entities list if present
        if (!isLike && previousEntities && Array.isArray(previousEntities)) {
          queryClient.setQueryData(
            [entityQueryKey], 
            (previousEntities as any[]).filter(entity => entity.id !== id)
          );
        }
        
        // Return a context object with the snapshotted values
        return { previousLikes, previousEntities };
      },
      
      onError: (_err, _id, context) => {
        // If the mutation fails, use the context to roll back
        if (context?.previousLikes) {
          queryClient.setQueryData([likesQueryKey], context.previousLikes);
        }
        if (context?.previousEntities) {
          queryClient.setQueryData([entityQueryKey], context.previousEntities);
        }
      },
      
      onSettled: () => {
        // Always refetch after error or success to ensure data consistency
        queryClient.invalidateQueries({ queryKey: [likesQueryKey] });
        queryClient.invalidateQueries({ queryKey: [entityQueryKey] });
      },
    });
  };
}

// Individual mutation hooks using the factory function
export const useLikeUser = createLikeMutation(
  (userId) => LikesService.likeUser({ userId }), 
  'user', 
  true
);

export const useUnlikeUser = createLikeMutation(
  (userId) => LikesService.unlikeUser({ userId }), 
  'user', 
  false
);

export const useLikeProject = createLikeMutation(
  (projectId) => LikesService.likeProject({ projectId }), 
  'project', 
  true
);

export const useUnlikeProject = createLikeMutation(
  (projectId) => LikesService.unlikeProject({ projectId }), 
  'project', 
  false
);

// For backwards compatibility: combined hook that returns all mutations
export const useLikeMutations = () => {
  const likeUser = useLikeUser();
  const unlikeUser = useUnlikeUser();
  const likeProject = useLikeProject();
  const unlikeProject = useUnlikeProject();

  return {
    likeUser,
    unlikeUser,
    likeProject,
    unlikeProject
  };
};

export const useProjectLikeToggle = () => {
  const likeProjectMutation = useLikeProject();
  const unlikeProjectMutation = useUnlikeProject();

  const toggleProjectLike = (projectId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) {
      unlikeProjectMutation.mutate(projectId);
    } else {
      likeProjectMutation.mutate(projectId);
    }
  };

  return {
    toggleProjectLike,
    likeProjectMutation,
    unlikeProjectMutation
  };
};


export const useUserLikeToggle = () => {
  const likeUserMutation = useLikeUser();
  const unlikeUserMutation = useUnlikeUser();

  const toggleUserLike = (personId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) {
      unlikeUserMutation.mutate(personId);
    } else {
      likeUserMutation.mutate(personId);
    }
  };

  return {
    toggleUserLike,
    likeUserMutation,
    unlikeUserMutation
  };
};