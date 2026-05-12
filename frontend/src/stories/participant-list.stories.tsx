import {Participant, ParticipantList, ParticipantListProps} from "@/components/ui/participants.tsx";
import {Meta, StoryObj} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {Text, AvatarRoot, AvatarFallback, AvatarImage} from "@chakra-ui/react";

const participantsExample = [
  {
    key: 0,
    name: "Artur Kopytko",
    additionalInfo: "Kierownik projektu, ekspert ds. literatury i archiwów",
    image: "https://mighty.tools/mockmind-api/content/human/104.jpg"
  },
  {
    key: 1,
    name: "Jan Kowalski",
    additionalInfo: "Specjalista ds. technologii OCR i skanowania 3D",
    image: ""
  },
  {
    key: 2,
    name: "Katarzyna Wiśniewska",
    additionalInfo: "Grafik, odpowiedzialna za obróbkę wizualną skanów",
    image: "https://mighty.tools/mockmind-api/content/human/97.jpg"
  },
  {
    key: 3,
    name: "Piotr Zieliński",
    additionalInfo: "Programista, twórca platformy online",
    image: "https://mighty.tools/mockmind-api/content/human/96.jpg"
  },
  {
    key: 4,
    name: "Anna Podgórska",
    additionalInfo: "Redaktorka, odpowiedzialna za tworzenie metadanych.",
    image: "https://mighty.tools/mockmind-api/content/human/108.jpg"
  }
]

type StoryProps = ParticipantListProps & {
  participantsArray: typeof participantsExample
  avatarSize: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "2xs" | "xs"
};

const meta: Meta<StoryProps> = {
  title: "UI/Participants/ParticipantList",
  component: ParticipantList,

  args: {
    participantsArray: participantsExample,
    participants: [],
    avatarSize: "xl"
  },

  argTypes: {
    participants: {
      control: false
    },
    avatarSize: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full", "2xs", "xs"]
    }
  },

  tags: ['autodocs']
};

export default meta;

const participantListRender = ({ participantsArray, avatarSize, participants, ...args }: StoryProps) => (
  // Ignoring participants argument passed to the function.
  <ParticipantList
    participants={
      participantsArray.map((usr) => {
        return <Participant
          key={usr.key}
          p={"20px"}
          profilePhoto={
            <AvatarRoot size={avatarSize} onClick={action("Avatar clicked")} style={{cursor : 'pointer'}}>
              <AvatarFallback name={usr.name}/>
              <AvatarImage src={usr.image}/>
            </AvatarRoot>
          }
          name={<Text fontWeight="semibold" onClick={action("Name clicked")} style={{cursor : 'pointer'}}>{usr.name}</Text>}
          additionalInfo={<Text color="fg.muted" textStyle="sm">{usr.additionalInfo}</Text>}
        />
      })
    }
    {...args}/>
)

type Story = StoryObj<typeof meta>;

export const ParticipantListDefault: Story = {
  args: {
    maxWidth: "600px",
    minWidth: "260px",
    minColWidth: "230px",
    title: "Uczestnicy",
    noParticipantMsg: "Brak uczestników.",
  },
  render: participantListRender
}

export const ParticipantListNarrow: Story = {
  args: {
    maxWidth: "300px",
    minWidth: "260px",
    minColWidth: "230px",
    title: "Uczestnicy",
    noParticipantMsg: "Brak uczestników."
  },
  render: participantListRender
}

export const ParticipantListNoUsers: Story = {
  args: {
    maxWidth: "600px",
    minWidth: "260px",
    minColWidth: "230px",
    title: "Uczestnicy",
    noParticipantMsg: "Brak uczestników.",
    participantsArray: []
  },
  render: participantListRender
}
