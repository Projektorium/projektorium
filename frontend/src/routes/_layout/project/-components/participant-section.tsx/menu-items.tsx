import { ContextMenuItem, ContextMenuOption } from "@/components/ui/context-menu";
import CheckIcon from "@/assets/icons/check-circle.svg";
import XIcon from "@/assets/icons/x.svg";
import EditIcon from "@/assets/icons/edit.svg";
import { ApplicantPublic, ParticipantPublic } from "@/client";

export interface ParticipantWithActions extends ParticipantPublic {
  onEdit?: (userId: string, title: string, description: string | null) => void;
  onRemove?: (userId: string) => void;
}

export interface ApplicationWithActions extends ApplicantPublic {
  onAccept?: (userId: string) => void;
  onReject?: (userId: string) => void;
}

// Simple function to get menu items without internal state management
export const getParticipantMenuItems = (user: ParticipantWithActions): ("separator" | ContextMenuItem)[] => [
  {
    value: "Edytuj",
    element: (
      <ContextMenuOption
        icon={EditIcon}
        text="Edytuj"
        onClick={() => {
          if (user.onEdit) {
            user.onEdit(user.user_id, user.position_title || "", user.position_description);
          }
        }}
      />
    ),
  },
  "separator",
  {
    value: "Usuń",
    element: (
      <ContextMenuOption
        icon={XIcon}
        text="Usuń"
        onClick={() => {
          if (user.onRemove) {
            user.onRemove(user.user_id);
          } else {
            alert(`Removing user: ${user.name}`);
          }
        }}
      />
    ),
  },
];

export const getApplicantMenuItems = (user: ApplicationWithActions): ("separator" | ContextMenuItem)[] => [
  {
    value: "Akceptuj",
    element: (
      <ContextMenuOption
        iconProps={{ objectFit: "contain" }}
        icon={CheckIcon}
        text="Akceptuj"
        onClick={() => {
          if (user.onAccept) {
            console.log("Sending\n");
            user.onAccept(user.user_id);
          }
        }}
      />
    ),
  },
  "separator",
  {
    value: "Odrzuć",
    element: (
      <ContextMenuOption
        icon={XIcon}
        text="Odrzuć"
        onClick={() => {
          if (user.onReject) {
            console.log("Sending\n");

            user.onReject(user.user_id);
          }
        }}
      />
    ),
  },
];
