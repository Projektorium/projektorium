import { ApplicantPublic, ParticipantPublic } from "@/client";
import { CARD_PADDING_X } from "@/routes/_layout";

export const formatParticipant = (user: ParticipantPublic) => {
  const title = user.position_title || "";
  return title == "Owner" ? "Właściciel(ka)" : title;
};

export const formatApplicant = (user: ParticipantPublic | ApplicantPublic) => {
  return user.position_title || "";
};

export const getNegativeHalfPadding = () => {
  return Object.fromEntries(
    Object.entries(CARD_PADDING_X).map(([key, value]) => [key, `calc(-${value} / 2)`])
  );
};