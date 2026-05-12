import type { Meta, StoryObj } from '@storybook/react';
import { MessageModal} from '../components/ui/modal-message.tsx';
import { AddPositionModal, AddUserModal } from '../components/ui/modal-project.tsx';
import { action } from '@storybook/addon-actions';
import {Button, Text} from '@chakra-ui/react';
import {ModalFileUpload} from "@/components/ui/modal-file-upload.tsx"; // Adjust the import path if necessary

type StoryProps = {};

const meta: Meta<StoryProps> = {
  title: 'UI/Modals',
  tags: ['autodocs'],
};

export default meta;


// Specific simplified implementations of MessageModal


export const Contact: StoryObj<StoryProps> = {
  render: () =>
    <MessageModal
      headerText="Nawiąż Kontakt"
      trigger={<Button variant="solid" colorScheme="blue">Otwórz kontakt</Button>}
      placeholder="Wpisz treść wiadomości..."
      sendButtonText = "Wyślij"
      onSend={(message) => {
        console.log('Message sent:', message);
        action('onSend')();
      }}
    />
};


export const Apply: StoryObj<StoryProps> = {
  render: () => 
    <MessageModal
      headerText="Aplikuj"
      trigger={<Button variant="solid" colorScheme="blue">Open Modal</Button>}
      placeholder="Apply..."
      sendButtonText = "Wyślij"
      onSend={(message) => {
        console.log('Message sent:', message);
        action('onSend')();
      }}
    />
};

export const AddPosition: StoryObj<StoryProps> = {
  render: () => 
    <AddPositionModal
      headerText="Dodaj pozycje"
      trigger={<Button variant="solid" colorScheme="blue">Dodaj pozycje</Button>}
      titlePlaceholder="Tytuł"
      descriptionPlaceholder="Opisz pozycje..."
      cancelButtonText="Anuluj"
      sendButtonText="Akceptuj"
      onSend={(title, description) => console.log('Position:', title, description)}
    />
  
};

export const AddUser: StoryObj<StoryProps> = {
  render: () => 
    <AddUserModal
      headerText="Dodaj Uczestnika"
      trigger={<Button variant="solid" colorScheme="blue">Dodaj uczestnika</Button>}
      selectPlaceholder="Select option"
      descriptionPlaceholder="Opisz uczestnika..."
      cancelButtonText="Anuluj"
      sendButtonText="Akceptuj"
      options={['React', 'Vue', 'Angular', 'Svelte']}
      onSend={(option, description) => console.log('Option:', option, 'Desc:', description)}
    />
};

export const Upload: StoryObj<StoryProps> = {
  render: () => (
    <ModalFileUpload
      headerText='Wgraj pliki'
      trigger={<Button variant="solid" colorScheme="blue">Wgraj pliki</Button>}
      sendButtonText="Zatwierdź"
      onSend={((f) => alert(f.map((x) => x.name)))}
      dropzoneContent={<Text>Przeciągnij pliki tutaj</Text>}
    />
  ),
};

