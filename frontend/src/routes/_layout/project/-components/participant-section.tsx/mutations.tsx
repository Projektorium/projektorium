import { useMutation, QueryClient } from "@tanstack/react-query";
import { ParticipantsService } from "@/client";

export const useParticipantMutations = (projectId: string, queryClient: QueryClient) => {
  // Update participant position
  const updateParticipantPosition = useMutation({
    mutationFn: ({ userId, title, description }: { userId: string; title: string; description?: string | null }) =>
      ParticipantsService.updateParticipantPosition({
        projectId,
        userId,
        requestBody: {
          position_title: title,
          position_description: description
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_participants", { projectId }] });
    }
  });

  // Remove participant
  const removeParticipant = useMutation({
    mutationFn: (userId: string) =>
      ParticipantsService.removeParticipant({
        projectId,
        userId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_participants", { projectId }] });
    }
  });

  return {
    updateParticipantPosition,
    removeParticipant
  };
};