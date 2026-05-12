import React from 'react';
import {Dialog} from '@chakra-ui/react';
import { CloseButton } from './close-button';

interface BaseModalWindowProps {
  headerText: string;
  open: boolean;
  onOpenChange: (details: { open: boolean }) => void;
  trigger: React.ReactElement;
  body: React.ReactNode;
  sendButton: React.ReactElement;
}

export const BaseModalWindow: React.FC<BaseModalWindowProps> = ({
  headerText,
  open,
  onOpenChange,
  trigger,
  body,
  sendButton,
  ...props
}) => {
  if (!trigger || !body || !sendButton) {
    console.error(
      'ModalWindow: You must provide `trigger`, `body`, and `sendButton` props.'
    );
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => onOpenChange({ open })} {...props}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content borderRadius="16px">
          <Dialog.CloseTrigger asChild>
            <CloseButton aria-label="Close modal" variant="ghost" position="absolute" top="1rem" right="1rem"/>
            {/* <Button variant="ghost" position="absolute" top="1rem" right="1rem">
              X
            </Button> */}
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>{headerText}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body paddingBottom="10px">{body}</Dialog.Body>
          <Dialog.Footer>{sendButton}</Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
