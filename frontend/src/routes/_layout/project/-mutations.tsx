// src/routes/_layout/project/$projectId/mutations.ts
import { useMutation, QueryClient } from "@tanstack/react-query";
import { 
  ProjectsService, 
  PositionsService, 
  ProjectUpdate, 
  PositionUpdate,
  PositionCreate, 
  ProjectApplicationsService
} from "@/client";

export const useProjectMutations = (projectId: string, queryClient: QueryClient) => {
  // Project mutations
  const updateProject = useMutation({
    mutationFn: (updateInfo: ProjectUpdate) =>
      ProjectsService.updateProject({
        projectId,
        requestBody: updateInfo
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_projects", { projectId }] });
    }
  });

  const deleteProject = useMutation({
    mutationFn: () =>
      ProjectsService.deleteProject({projectId}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_projects", { projectId }] });
    }
  });

  // Position mutations
  const createPosition = useMutation({
    mutationFn: (position: PositionCreate) =>
      PositionsService.addPosition(
        { projectId, requestBody: position }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_positions", { projectId }] });
    }
  });

  const updatePosition = useMutation({
    mutationFn: (position: PositionUpdate & { positionId: string }) =>
      PositionsService.updatePosition({
        projectId,
        positionId: position.positionId,
        requestBody: position
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_positions", { projectId }] });
    }
  });

  const deletePosition = useMutation({
    mutationFn: ({ projectId, positionId }: { projectId: string; positionId: string }) =>
      PositionsService.deletePosition({ projectId, positionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_positions", { projectId }] });
    }
  })


  return {
    updateProject,
    deleteProject,
    createPosition,
    updatePosition,
    deletePosition
  };
};


export const useApplicantMutations = (projectId: string, queryClient: QueryClient) => {
  // Accept applicant mutation
  const acceptApplicant = useMutation({
    mutationFn: ({ userId, positionId }: { userId: string; positionId: string }) =>
      ProjectApplicationsService.acceptApplication({ 
        userId,
        positionId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_applicants", { projectId }] });
      queryClient.invalidateQueries({ queryKey: ["project_participants", { projectId }] });
    }
  });

  // Reject applicant mutation
  const rejectApplicant = useMutation({
    mutationFn: ({ userId, positionId }: { userId: string; positionId: string }) =>
      ProjectApplicationsService.rejectApplication({ 
        userId, 
        positionId 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_applicants", { projectId }] });
    }
  });

  return {
    acceptApplicant,
    rejectApplicant
  };
};

export const useApplicationMutations = (queryClient: QueryClient) => {
  const applyToPosition = useMutation({
    mutationFn: ({ positionId }: { positionId: string }) =>
      ProjectApplicationsService.applyToProject({
        positionId
      }),
    onSuccess: (data) => {
      const projectId = data.position_id; // This might be different based on your API response
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project_positions", { projectId }] });
      }
    }
  });

  return {
    applyToPosition
  };
};