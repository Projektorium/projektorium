import { PaginatedList } from "@/components/ui/static-card-section";
import { HStack, Separator, Text, Flex, AvatarImage, AvatarRoot, AvatarFallback } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentCard } from "@/components/ui/content-card";
import { ContactButton } from "@/components/ui/icon-buttons";
import { OptionSection } from "@/components/ui/option-section";
import { MessageModal } from "@/components/ui/modal-message.tsx";
import { useNavigateScroll as useNavigate } from "@/components/ui/link-scroll.tsx";
import { useAllMessages } from "@/routes/-message-utils/queries";
import { MessagePublic } from "@/client";
import { formatDateToPolish, getImageUrl } from "@/utils";
import { useSendMessage } from "@/routes/-message-utils/mutations.tsx";

const searchSchema = z.object({
  section: z.enum(["projects", "people"]).default("projects"),
  page: z.coerce.number().int().min(1).default(1),
});

export const Route = createFileRoute("/_layout/_auth/messages")({
  component: MassagePage,
  validateSearch: searchSchema,
});

const MessageCard: React.FC<{
  message: MessagePublic;
  footer?: JSX.Element;
  navigate: ReturnType<typeof useNavigate>;
  incoming: boolean,
  last?: boolean;
}> = ({
  message,
  footer,
  navigate,
  incoming,
  last
}) => {
  return (
    <ContentCard
      w="100%"
      title={
        incoming ?
        `${message.sender_name} ${message.sender_last_name}` :
        `${message.receiver_name} ${message.receiver_last_name}`
    }
      titleProps={{
        mt: "0",
        onClick: (() =>
            navigate({
              to: "/person/$personId",
              params: { personId: incoming ? message.sender : message.receiver},
            })
        ),
        style: {cursor: "pointer"}
      }}
      description={message.message}
      descriptionProps={{ mb: "20px", fontWeight: "500" }}
      cardVariant="none"
      bodyProps={last ? { paddingX: "0", pb: "0" } : { paddingX: "0" }}
      border={"none"}
      borderRadius={"none"}
      avatar={
        <AvatarRoot
          size="2xl"
          onClick={() =>
            navigate({
              to: "/person/$personId",
              params: { personId: incoming ? message.sender : message.receiver },
            })
          }
          style={{cursor: "pointer"}}
        >
          <AvatarFallback name={
            incoming ?
            `${message.sender_name} ${message.sender_last_name}` :
            `${message.receiver_name} ${message.receiver_last_name}`
          }/>
          <AvatarImage
            src={getImageUrl(incoming ? message.sender_profile_image : message.receiver_profile_image)}
            alt="Profile Photo"
          />
        </AvatarRoot>
      }
      footerList={footer}
    />
  );
}

const MessageFooter: React.FC<{
  incoming: boolean;
  message: MessagePublic;
  sendMessage: (message: string, receiverId: string) => void;
}> = ({
  incoming,
  message,
  sendMessage
}) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" h="40px">
      <HStack>
        <MessageModal
          headerText="Nawiąż Kontakt"
          trigger={<ContactButton text="Napisz" height="40px" padding="16px"/>}
          placeholder="Wpisz treść wiadomości..."
          sendButtonText = "Wyślij"
          onSend={(msg: string) => sendMessage(msg, incoming ? message.sender : message.receiver)}
        />
        {/*
          incoming &&
          <ShareButton
            beforeShare="Udostępnij dane"
            afterShare="Udostępniono"
            color="text.primary"
            bgColor="rgba(243, 244, 245, 1)"
            colorScheme="grey"
            height="40px"
            padding="16px"
          />
        */}
      </HStack>
      <Text color="text.primary/50" fontSize="15px" fontWeight="500" alignSelf="flex-end">
        {formatDateToPolish(message.sent_at)}
      </Text>
    </Flex>
  );
}

interface MessageTabProps {
  navigate: ReturnType<typeof useNavigate>;
  messages: MessagePublic[];
  incoming: boolean;
  sendMessage: (message: string, receiverId: string) => void;
}


const MessagesTab: React.FC<MessageTabProps> = ({
  navigate,
  messages,
  incoming,
  sendMessage
}) => {
  return (
    <PaginatedList
      itemsPerPage={4}
      separator={<Separator />}
      cards={messages.map((message, index) => (
        <MessageCard
          key={message.id}
          incoming={incoming}
          message={message}
          footer={<MessageFooter incoming={incoming} message={message} sendMessage={sendMessage}/>}
          navigate={navigate}
          last={index + 1 == messages.length}
        />
      ))}
    />
  );
}

function MassagePage() {
  const navigate = useNavigate();
  const { sentMessages, receivedMessages }  = useAllMessages();
  const { sendMessage } = useSendMessage();
  const sortedSentMessages = sentMessages.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  const sortedReceivedMessages = receivedMessages.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  const tabElements = [
    {
      tabValue: "incoming",
      tabName: <Text fontSize="xl"
                     fontWeight="600">Przychodzące ({sortedReceivedMessages.length})</Text>,
      tabContent: <MessagesTab incoming={true} messages={sortedReceivedMessages} navigate={navigate} sendMessage={sendMessage}/>,
    },
    {
      tabValue: "outcoming",
      tabName: (
        <Text fontSize="xl"
              fontWeight="600">Wychodzące ({sortedSentMessages.length})</Text>
      ),
      tabContent: <MessagesTab incoming={false} messages={sortedSentMessages} navigate={navigate} sendMessage={sendMessage}/>,
    },
  ];

  return (
    <OptionSection
      mt="40px"
      tabElements={tabElements}
      titleSeparator={<Separator width="100%" />}
      width={"100%"}
      defaultTab="incoming"
      titleElements={
        <Text fontWeight="600" fontSize="xl" alignContent="start" mt="-6px">
          Wiadomości
        </Text>
      }
    />
  );
}
