import { queryOptions } from "@tanstack/react-query";
import { ProjectsService, PositionsService, ParticipantsService, ApplicantsService } from "@/client";

// Query options
export const getProjectQueryOptions = ({ projectId }: { projectId: string }) => {
  return queryOptions({
    queryKey: ["my_projects", { projectId }],
    queryFn: () => ProjectsService.readProject({ projectId }),
  });
};

export const getPositionsQueryOptions = ({ projectId }: { projectId: string }) => {
  return queryOptions({
    queryKey: ["project_positions", { projectId }],
    queryFn: () => PositionsService.listPositions({ projectId }),
  });
};

export const getParticipantsQueryOptions = ({ projectId }: { projectId: string }) => {
  return queryOptions({
    queryKey: ["project_participants", { projectId }],
    queryFn: () => ParticipantsService.listParticipants({ projectId })
  });
};

export const getApplicantsQueryOptions = ({ projectId }: { projectId: string }) => {
  return queryOptions({
    queryKey: ["project_applicants", { projectId }],
    queryFn: () => ApplicantsService.listApplicants({projectId})
  });
};

// const getAttachmentsQueryOptions = ({ projectId }: { projectId: string }) => {
//   return queryOptions({
//     queryKey: ["project_attachments", { projectId }],
//     queryFn: () => AttachmentsService.listAttachments({ projectId })
//   });
// };
