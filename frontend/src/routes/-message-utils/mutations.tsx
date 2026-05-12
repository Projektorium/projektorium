import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesService } from "@/client";

// Custom hook for message mutations
export const useMessageMutations = () => {
  const queryClient = useQueryClient();

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ receiverId, message }: { receiverId: string; message: string }) => 
      MessagesService.sendMessage({
        receiverId,
        requestBody: { message }
      }),

    // When mutation is successful, invalidate relevant queries to update UI
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sent-messages"] });
      queryClient.invalidateQueries({ queryKey: ["received-messages"] });
    },
  });

  return {
    sendMessageMutation,
  };
};

// Hook for sending messages
export const useSendMessage = () => {
  const { sendMessageMutation } = useMessageMutations();
  return {
    sendMessage: (message:string , receiverId: string) => sendMessageMutation.mutate({message, receiverId})
  };
};
