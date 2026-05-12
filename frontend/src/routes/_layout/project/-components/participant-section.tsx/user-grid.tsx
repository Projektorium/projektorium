import { SimpleGrid, Text } from "@chakra-ui/react";
import { AvatarFallback, AvatarImage, AvatarRoot } from "@chakra-ui/react";
import { LinkScroll as Link } from "@/components/ui/link-scroll";
import { ContextMenu, ContextMenuItem } from "@/components/ui/context-menu";
import { Participant } from "@/components/ui/participants";
import { DotsButton } from "@/components/ui/icon-buttons";
import { ApplicantPublic, ParticipantPublic } from "@/client";
import { getNegativeHalfPadding } from "./fomat";
import { ApplicationWithActions, ParticipantWithActions } from "./menu-items";
import { getImageUrl } from "@/utils";

type UserType = ParticipantPublic | ApplicantPublic | ParticipantWithActions | ApplicationWithActions;

interface UserGridProps<T extends UserType> {
  users: T[];
  menuItemsWrapper?: (user: T) => ("separator" | ContextMenuItem)[];
  columnGap?: string;
  rowGap?: string;
  marginTop?: string;
  formatUser: (user: ParticipantPublic | ApplicantPublic) => string
}

export const UserGrid = <T extends UserType>({ 
  users,
  menuItemsWrapper,
  columnGap = "40px",
  rowGap = "40px",
  marginTop = "36px",
  formatUser
}: UserGridProps<T>) => {
  const negHalfPadding = getNegativeHalfPadding();

  return (
    <SimpleGrid columns={2} rowGap={rowGap} columnGap={columnGap} mt={marginTop}>
      {users.map((user) => (
        <Participant
          key={user.user_id}
          padding={negHalfPadding}
          profilePhoto={
            <Link key={user.user_id} to={`/person/${user.user_id}`}>
              <AvatarRoot size="xl" cursor="pointer">
                <AvatarFallback name={`${user.name} ${user.last_name}`} />
                <AvatarImage src={getImageUrl(user.profile_image)} />
              </AvatarRoot>
            </Link>
          }
          name={
            <Link to={`/person/${user.user_id}`}>
              <Text color="text.primary" fontSize="md" fontWeight="semibold" cursor="pointer">
                {`${user.name} ${user.last_name}`}
              </Text>
            </Link>
          }
          additionalInfo={
            <Text color="text.primary/70" fontSize="0.9375rem" fontWeight="medium">
              {formatUser(user)}
            </Text>
          }
          actionButton={
            menuItemsWrapper && (
              <ContextMenu
                trigger={<DotsButton />}
                menuItems={menuItemsWrapper(user)}
                menuItemProps={{ w: undefined }}
              />
            )
          }
        />
      ))}
    </SimpleGrid>
  );
};