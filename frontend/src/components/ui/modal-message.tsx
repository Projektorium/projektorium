import React from 'react';
import { Textarea } from '@chakra-ui/react';

import { BaseModalWindow } from './modal-base-window.tsx';
import { SendMessageButton } from './icon-buttons';

interface MessageModalProps {
  headerText: string;
  trigger: React.ReactElement;
  placeholder: string;
  initialMessage?: string;
  sendButtonText?: string;
  onSend: (message: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  headerText,
  trigger,
  placeholder,
  initialMessage,
  sendButtonText = "Wyślij",
  onSend,
}) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(initialMessage ? initialMessage : '');

  const handleSend = () => {
    onSend(message);
    if (!initialMessage) {
      setMessage('');
    }
    setOpen(false); // Close the modal
  };

  return (
    <BaseModalWindow
      headerText={headerText}
      open={open}
      onOpenChange={({ open }) => {
        setOpen(open);
        if (!open) {
          setMessage(initialMessage ? initialMessage : '');
        }
      }}
      trigger={React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      body={
        <Textarea
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      }
      sendButton={
        <SendMessageButton onClick={handleSend}>{sendButtonText}</SendMessageButton>
      }
    />
  );
};