import { Text, Separator } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CARD_PADDING_X } from "../../../../_layout";
import React, { useState } from "react";
import { OptionSection } from "@/components/ui/option-section";
import { StaticSectionCardWrapper } from "@/routes/-components/static-section-wrapper";
import { ParticipantPublic } from "@/client";
import { UserGrid } from "./user-grid";
import { getParticipantMenuItems, getApplicantMenuItems, ParticipantWithActions, ApplicationWithActions } from "./menu-items";
import { useParticipantMutations } from "./mutations";
import { AddPositionModal } from "@/components/ui/modal-project";
import { getApplicantsQueryOptions } from "../../-queries";
import { useApplicantMutations } from "../../-mutations";
import { formatApplicant, formatParticipant } from "./fomat";

interface ParticipantsSectionParams {
  editable: boolean;
  participants: ParticipantPublic[];
  projectId: string;
  isAdmin: boolean;
}

export const ParticipantsSection: React.FC<ParticipantsSectionParams> = ({ 
  editable, 
  participants, 
  projectId,
  isAdmin,
}) => {
  const {data: applicants} = useQuery({
    ...getApplicantsQueryOptions({ projectId }),
    enabled: isAdmin,
  });

  const queryClient = useQueryClient();
  const { updateParticipantPosition, removeParticipant } = useParticipantMutations(projectId, queryClient);
  const {rejectApplicant, acceptApplicant} = useApplicantMutations(projectId, queryClient)

  // State for modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantPublic | null>(null);

  // Handler for opening the edit modal
  // @ts-ignore
  const handleOpenEditModal = (userId: string, title: string, description: string | null) => {
    const participant = participants.find(p => p.user_id === userId);
    if (participant) {
      setCurrentParticipant(participant);
      setEditModalOpen(true);
    }
  };

  // Add mutation actions to participants
  const participantsWithActions: ParticipantWithActions[] = participants.map(participant => ({
    ...participant,
    onEdit: editable ? handleOpenEditModal : undefined,
    onRemove: editable ? (userId) => {
      if (window.confirm(`Czy na pewno chcesz usunąć uczestnika ${participant.name}?`)) {
        removeParticipant.mutate(userId);
      }
    } : undefined
  }));

  // Add mutation actions to applicants (implementation needed for project/application mutations)
  const applicantsArray = applicants?.applicants ?? [];

  const applicantsWithActions: ApplicationWithActions[] = applicantsArray.map(applicant => ({
    ...applicant,
    onAccept: isAdmin ? (userId) => {
      acceptApplicant.mutate({userId, positionId: applicant.position_id})
    } : undefined,
    onReject: isAdmin ? (userId) => {
      rejectApplicant.mutate({userId, positionId: applicant.position_id})
    } : undefined
  }));


  const tabElements = [
    {
      tabValue: "participants",
      tabName: (
        <Text fontSize="xl" fontWeight="semibold">
          Uczestnicy ({participants.length})
        </Text>
      ),
      tabContent: (
        <>
          <UserGrid
            users={participantsWithActions}
            menuItemsWrapper={getParticipantMenuItems}
            formatUser={formatParticipant}
          />
          {currentParticipant && (
            <AddPositionModal
              externalOpen={editModalOpen}
              setExternalOpen={setEditModalOpen}
              headerText="Edytuj pozycję uczestnika"
              trigger={<div></div>}
              titlePlaceholder="Tytuł"
              descriptionPlaceholder="Opisz pozycje..."
              cancelButtonText="Anuluj"
              sendButtonText="Akceptuj"
              initialTitle={currentParticipant.position_title || ""}
              initialDescription={currentParticipant.position_description || ""}
              onSend={(title, description) => {
                updateParticipantPosition.mutate({ 
                  userId: currentParticipant.user_id, 
                  title,
                  description
                });
                setEditModalOpen(false);
              }}
            />
          )}
        </>
      ),
    },
    {
      tabValue: "applicants",
      tabName: (
        <Text fontSize="xl" fontWeight="semibold">
          Aplikujący ({applicantsArray.length})
        </Text>
      ),
      tabContent: (
        <UserGrid
          formatUser={formatApplicant}
          users={applicantsWithActions}
          menuItemsWrapper={getApplicantMenuItems}
        />
      ),
    },
  ];

  return editable ? (
    <>
      <OptionSection
        tabElements={tabElements}
        defaultTab="participants"
        padding={CARD_PADDING_X}
        titleSeparator={<Separator width={"100%"} />}
        width="100%"
      />
    </>
  ) : (
    <StaticSectionCardWrapper
      cardSectionProps={{
        title: `Uczestnicy (${participants.length})`,
        addCardCount: false,
        width: "100%",
      }}
      listProps={{
        w: "100%",
        topStackProps: { w: "100%" },
      }}
      cards={[<UserGrid formatUser={formatParticipant} key="participants-grid" users={participants} />]}
    />
  );
};