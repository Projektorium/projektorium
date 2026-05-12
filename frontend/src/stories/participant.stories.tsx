import {Participant, ParticipantProps} from "@/components/ui/participants.tsx";
import {Meta, StoryObj} from "@storybook/react";
import {AvatarImage, AvatarRoot, Box, Text} from "@chakra-ui/react";
import {action} from "@storybook/addon-actions";

type StoryProps = ParticipantProps & {
  boxWidth: string
};

const meta: Meta<StoryProps> = {
  title: "UI/Participants/Participant",
  component: Participant,

  args: {
    boxWidth: "250px"
  },

  tags: ['autodocs']
};

export default meta;

export const ParticipantDefault: StoryObj<typeof meta> = {
  args: {
    profilePhoto: <AvatarRoot onClick={action("Avatar clicked")} style={{cursor : 'pointer'}}>
                    <AvatarImage src="https://mighty.tools/mockmind-api/content/human/91.jpg"/>
                  </AvatarRoot>,
    name: <Text fontWeight="semibold" onClick={action("Name clicked")} style={{cursor : 'pointer'}}>Jan Kowalski</Text>,
    additionalInfo: <Text color="fg.muted" textStyle="sm">Specjalista ds. technologii OCR i skanowania 3D</Text>
  },
  render: ({boxWidth, ...args}) => (
    <Box border="2px solid black" width={boxWidth} p={4}>
      <Participant {...args} />
    </Box>
  )
}