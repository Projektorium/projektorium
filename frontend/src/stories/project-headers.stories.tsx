import { ComponentProps } from "react";
import { ProfilePage, ContentCardHeader, StatusBadge } from "../components/ui/content-card-headers";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test"
import { HeartButton, EyeButton, ContactButton, DotsButton } from "../components/ui/icon-buttons";
import {Text, Image, Box, AvatarImage, AvatarRoot} from "@chakra-ui/react";

type StoryProps = ComponentProps<typeof ContentCardHeader> & {
  containerSize: string
};

const meta: Meta<StoryProps> = {
  title: "UI/ContentCard/Headers",
  component: ContentCardHeader,

  args: {
    containerSize: "800px",
  },

  argTypes: {
    icons: {
      control : false
    },
    headerContent: {
      control : false
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;


const ProfileArgs = {
  profilePhoto: (
    <Box height="80px">
      <AvatarRoot size="full">
        <AvatarImage
          src="https://fastly.picsum.photos/id/797/150/150.jpg?hmac=qFxiqguNGmKvv8cJn_7wYLM1uCYvxMF5cN4DMHyIAqs"
        />
      </AvatarRoot>
    </Box>),
  name: <Text fontSize="28px" fontWeight="bold" color="rgba(5, 33, 61, 1)">Anna Podgorska</Text>,
  additionalInfo: <Text color="rgba(5, 33, 61, 0.7)" fontSize="16px">Studentka • Filologia Angielska • II rok</Text>,
  gap: "24px",
};

const defaultStatusProps = {
  fontWeight: "bold",
  padding: "8px",
  borderRadius: "8px",
  fontSize: "14px",
  height: "32px"
};

export const AddmissionProjectCardHeader: StoryObj<typeof meta> = {
  args: {
    headerContent: <StatusBadge {...defaultStatusProps} status="REKRUTACJA" backgroundColor="rgba(49, 130, 206, 0.1)" color="rgba(49, 130, 206, 1)"/>,
    icons: [<HeartButton onClick={fn()}/>, <EyeButton onClick={fn()}/>, <ContactButton text="Kontakt" onClick={fn()}/>]
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args} />
    </Box>
  )
};

export const ActiveProjectCardHeader: StoryObj<typeof meta> = {
  args: {
    headerContent: <StatusBadge {...defaultStatusProps} status="AKTYWNY" backgroundColor="rgba(56, 161, 105, 0.1)" color="rgba(56, 161, 105, 1)" />,
    icons: [<HeartButton onClick={fn()}/>, <EyeButton onClick={fn()}/>, <ContactButton text="Kontakt" onClick={fn()}/>]
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args}/>
    </Box>
  )
};

export const FinishedProjectCardHeader: StoryObj<typeof meta> = {
  args: {
    headerContent: <StatusBadge {...defaultStatusProps} status="ZAKOŃCZONY" backgroundColor="rgba(5, 33, 61, 0.05)" color="rgba(5, 33, 61, 1)" />,
    icons: [<HeartButton onClick={fn()}/>, <EyeButton onClick={fn()}/>, <ContactButton text="Kontakt" onClick={fn()}/>]
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args} />
    </Box>
  )
};

export const MyProjectCardHeader: StoryObj<typeof meta> = {
  args: {
    headerContent: <StatusBadge {...defaultStatusProps} status="OTWARTA REKRUTACJA" backgroundColor="rgba(49, 130, 206, 0.1)" color="rgba(49, 130, 206, 1)"/>,
    icons : <DotsButton onClick={fn()}/>
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args}/>
    </Box>
  ),
};

export const ProfileHeader: Story = {
  args: {
    headerContent : <ProfilePage {...ProfileArgs}/>,
    icons: [<HeartButton onClick={fn()}/>, <ContactButton text="Kontakt" onClick={fn()}/>]
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args} />
    </Box>
  ),
};

export const ProjectHeader : Story = {
  args: {
    headerContent : <Text fontWeight="medium" fontSize="28px" color="rgba(5, 33, 61, 1)">Digitalizacja zbiorów literackich Uniwersytetu Warszawskiego</Text>,
    icons: [<HeartButton onClick={fn()}/>, <ContactButton text="Kontakt" onClick={fn()}/>]
  },
  render: ({ containerSize, ...args }) => (
    <Box border="2px solid black" w={containerSize} p={4} boxShadow="md" bg="gray.100">
      <ContentCardHeader {...args} />
    </Box>
  ),
}

