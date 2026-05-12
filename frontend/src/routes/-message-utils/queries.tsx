import { MessagesService } from "@/client";
import { queryOptions, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";

// Query options for sent messages
export const getSentMessagesQueryOptions = (skip?: number, limit?: number) => {
  return queryOptions({
    queryKey: ["sent-messages", skip, limit],
    queryFn: () => MessagesService.getSentMessages({ skip, limit }),
  });
};

// Query options for received messages
export const getReceivedMessagesQueryOptions = (skip?: number, limit?: number) => {
  return queryOptions({
    queryKey: ["received-messages", skip, limit],
    queryFn: () => MessagesService.getReceivedMessages({ skip, limit }),
  });
};

interface MessageParams {
  skip?: number;
  limit?: number;
}

// Hook to get sent messages
export const useSentMessages = (params: MessageParams = {}) => {
  const { skip, limit } = params;
  const { data, isLoading, isError, error, refetch } = useSuspenseQuery(
    getSentMessagesQueryOptions(skip, limit)
  );

  return {
    messages: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// Hook to get received messages
export const useReceivedMessages = (params: MessageParams = {}) => {
  const { skip, limit } = params;
  const { data, isLoading, isError, error, refetch } = useSuspenseQuery(
    getReceivedMessagesQueryOptions(skip, limit)
  );

  return {
    messages: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// Hook to get both sent and received messages
export const useAllMessages = (params: MessageParams = {}) => {
  const { skip, limit } = params;
  
  const results = useSuspenseQueries({
    queries: [
      getSentMessagesQueryOptions(skip, limit),
      getReceivedMessagesQueryOptions(skip, limit)
    ],
    combine: (results) => {
      const [sentResults, receivedResults] = results;

      return {
        sentMessages: sentResults.data || [],
        receivedMessages: receivedResults.data || [],
        isLoading: sentResults.isLoading || receivedResults.isLoading,
        isError: sentResults.isError || receivedResults.isError,
        error: sentResults.error || receivedResults.error,
        refetch: () => {
          sentResults.refetch();
          receivedResults.refetch();
        }
      };
    }
  });
  
  return results;
};