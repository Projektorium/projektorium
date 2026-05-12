import { useMutation, QueryClient } from "@tanstack/react-query";
import { 
  ProfilesService,
  UserUpdateMe
} from "@/client";

export const useProfileMutations = (personId: string, queryClient: QueryClient) => {
  const updateProfile = useMutation({
    mutationFn: (updateInfo: UserUpdateMe) =>
      ProfilesService.updateProfile({
        profileId: personId,
        requestBody: updateInfo
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", { personId }] });
    }
  });

  const uploadProfileImage = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return ProfilesService.uploadProfileImage({
        profileId: personId,
        formData: { file }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", { personId }] });
    }
  });


  return {
    updateProfile,
    uploadProfileImage
  };
};