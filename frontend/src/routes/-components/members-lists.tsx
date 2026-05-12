// File: src/pages/components/MembersList.tsx
import { PaginatedList } from "@/components/ui/static-card-section";
import {AvatarFallback, HStack, Separator} from "@chakra-ui/react";
import { AvatarRoot, AvatarImage } from "@chakra-ui/react";
import { HoverContentCard } from "@/routes/-components/hover-content-card";
import { TagListWrapper } from "@/routes/-components/tag-list-wrapper";
import { HeartButton, ContactButton } from "@/components/ui/icon-buttons";
import { MessageModal } from "@/components/ui/modal-message";
import { useNavigateScroll } from "@/components/ui/link-scroll";
import { UserPublic } from "@/client";
import { useUserLikeToggle } from "@/routes/-like-utils/mutations";
import { useUserLike } from "@/routes/-like-utils/queries";
import { getImageUrl } from "@/utils";
import { useSendMessage } from "../-message-utils/mutations";

interface MembersListProps {
  people: UserPublic[];
  navigate: ReturnType<typeof useNavigateScroll>;
}

export function MembersList({ people, navigate }: MembersListProps) {
  const profileNavigate = (personId: string) => {
    navigate({
      to: "/person/$personId",
      params: { personId },
    });
  };

  const userIds = people.map(person => person.id);

  // Get like status for all users
  const userLikes = useUserLike({ user_ids: userIds });
  const { toggleUserLike } = useUserLikeToggle();
  const { sendMessage } = useSendMessage();

  return (
    <PaginatedList
      itemsPerPage={4}
      separator={<Separator />}
      cards={people.map((person) => {
        const isLiked = userLikes[person.id] || false;
        return (
        <HoverContentCard
          key={person.id}
          title={person.name}
          titleProps={{
            mt: "0",
            onClick: () => profileNavigate(person.id),
            style: { cursor: "pointer" },
          }}
          description={person.description ?? ""}
          descriptionProps={{
            lineClamp: 3,
            mt: "8px",
            mb: "16px",
            fontWeight: "500",
            onClick: () => profileNavigate(person.id),
            style: { cursor: "pointer" },
          }}
          footerList={<TagListWrapper tags={person.tags.map((tag) => tag.name)} limit={3} mt="8px" />}
          avatar={
            <AvatarRoot
              size="2xl"
              onClick={() => profileNavigate(person.id)}
              style={{ cursor: "pointer" }}
            >
              <AvatarFallback name={person.name + " " + person.last_name} />
              <AvatarImage src={getImageUrl(person.profile_image)} alt="Profile Photo" />
            </AvatarRoot>
          }
          cardVariant="side-button"
          actionElement={
            <HStack mr="17px">
              <HeartButton initialLiked={isLiked} onClick={() => toggleUserLike(person.id, isLiked)} />
              <MessageModal
                headerText="Nawiąż Kontakt"
                trigger={<ContactButton text="Kontakt" />}
                placeholder="Wpisz treść wiadomości..."
                sendButtonText="Wyślij"
                onSend={(message) => sendMessage(message, person.id)}
              />
            </HStack>
          }
        />
      )})}
    />
  );
}
