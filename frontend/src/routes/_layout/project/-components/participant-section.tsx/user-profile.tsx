import { ParticipantPublic, ApplicantPublic } from "@/client";
import { AvatarRoot, AvatarFallback, AvatarImage, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { formatParticipant } from "./fomat";
import { getImageUrl } from "@/utils";

export const UserProfile = ({ user }: { user: ParticipantPublic | ApplicantPublic }) => (
  <>
    <Link key={user.user_id} to={`/person/${user.user_id}`}>
      <AvatarRoot size="xl" cursor="pointer">
        <AvatarFallback name={user.name + user.last_name} />
        <AvatarImage src={getImageUrl(user.profile_image)} />
      </AvatarRoot>
    </Link>
    <Link key={`name-${user.user_id}`} to={`/person/${user.user_id}`}>
      <Text color="text.primary" fontSize="md" fontWeight="semibold" cursor="pointer">
        {user.name}
      </Text>
    </Link>
    <Text color="text.primary/70" fontSize="0.9375rem" fontWeight="500">
      {formatParticipant(user)}
    </Text>
  </>
);