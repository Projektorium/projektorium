import React, { useState } from 'react';
import {Textarea, Input, NativeSelect, Box, Image, Separator, HStack, Badge} from '@chakra-ui/react';
import { BaseModalWindow } from './modal-base-window.tsx';
import { SendMessageButton } from './icon-buttons';
import {TextCloseButton} from './close-button';
import {Tag} from "@/components/ui/tag.tsx";
import {TagList} from "@/components/ui/tag-list.tsx";
import {MessageModal} from "@/components/ui/modal-message.tsx";
import Plus from "@/assets/icons/plus.svg";
import {ProjectStatus} from "@/client";

/* -------------------------------------------------------------------------
   Function AddPositionModal
--------------------------------------------------------------------------- */
type AddPositionModalProps = Omit<AddWithTagsModalProps, "withTags" | "onSend"> & {
  onSend: (title: string, description: string) => void;
}

export const AddPositionModal: React.FC<AddPositionModalProps> = ({
  onSend,
  ...props
}) => (
  <AddWithTagsModal onSend={(title, dsc, _) => onSend(title, dsc)} withTags={false} {...props} />
)

/* -------------------------------------------------------------------------
   Function AddProjectModal
--------------------------------------------------------------------------- */
type AddProjectModalProps = Omit<AddWithTagsModalProps, "withTags">

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  ...props
}) => (
  <AddWithTagsModal withTags={true} {...props} />
)

interface AddWithTagsModalProps {
  headerText: string;
  trigger: React.ReactElement
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  cancelButtonText: string;
  sendButtonText: string;
  onSend: (title: string, description: string, tags: string[]) => void;
  initialTitle?: string;
  initialDescription?: string;
  externalOpen?: boolean;
  setExternalOpen?: (externalOpen: boolean) => void;
  withTags?: boolean;
}

const AddWithTagsModal: React.FC<AddWithTagsModalProps> = ({
  headerText,
  trigger,
  titlePlaceholder,
  descriptionPlaceholder,
  cancelButtonText,
  sendButtonText,
  onSend,
  initialTitle = "",
  initialDescription = "",
  externalOpen,
  setExternalOpen,
  withTags = true
}) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(initialTitle);
  const [positionDesc, setPositionDesc] = React.useState(initialDescription);
  const [tags, setTags] = React.useState<string[]>([]);

  const handleSend = () => {
    onSend(title, positionDesc, tags);
    setTitle('');
    setPositionDesc('');
    setTags([]);
    setOpen(false); // Close the modal
  };

  const addTagModal = <MessageModal
    headerText="Dodaj nowy tag"
    trigger={
      <Tag>
        <Image src={Plus}/>
      </Tag>
    }
    placeholder="Wpisz nazwę"
    sendButtonText = "Dodaj"
    onSend={(tagName) => setTags(prevList => [...prevList, tagName])}
  />

  return (
    <BaseModalWindow
      headerText={headerText}
      open={externalOpen ? externalOpen : open}
      onOpenChange={({ open }) => {
        if (setExternalOpen) {
          setExternalOpen(open);
        } else {
          setOpen(open);
        }

        if (!open) {
          setTitle(initialTitle);
          setPositionDesc(initialDescription);
          setTags([]);
        }
      }}
      trigger={React.cloneElement(trigger, { onClick: () => {
          if (setExternalOpen) {
            setExternalOpen(true);
          } else {
            setOpen(true);
          }
        }})}
      body={
        <>
          <Input
            placeholder={titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder={descriptionPlaceholder}
            value={positionDesc}
            onChange={(e) => setPositionDesc(e.target.value)}
            mt={4}
          />
          {withTags && <Separator my="16px"/>}
          {withTags && <TagList
            addTagComponent={addTagModal}
          >
            {tags.map((tag) => (
              <Tag
                key={tag}
                closable={true}
                onClose={() => {
                  setTags(l =>  l.filter((item) => item !== tag));
                }}
              >
                {tag}
              </Tag>
            ))}
          </TagList>}
        </>
      }
      sendButton={
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} width="100%">
          <TextCloseButton variant="outline" onClick={() => {
            if (setExternalOpen) {
              setExternalOpen(false);
            } else {
              setOpen(false);
            }

            setTitle(initialTitle);
            setPositionDesc(initialDescription);
            setTags([]);
          }}>
            {cancelButtonText}
          </TextCloseButton>
          <SendMessageButton onClick={handleSend}>{sendButtonText}</SendMessageButton>
        </Box>
      }
    />
  );
};

interface ChangeStatusModalProps {
  initialStatus: ProjectStatus;
  headerText: string;
  trigger: React.ReactElement;
  cancelButtonText: string;
  sendButtonText: string;
  onSend: (newStatus: ProjectStatus) => void;
}

export const ChangeStatusModal: React.FC<ChangeStatusModalProps>  = ({
  initialStatus,
  headerText,
  trigger,
  cancelButtonText,
  sendButtonText,
  onSend,
}) => {
  const [selected, setSelected] = useState<ProjectStatus>(initialStatus);
  const [open, setOpen] = React.useState(false);

  const badgeOptions: ProjectStatus[] = ['Active', 'Recruitment', 'Inactive' /*, 'Private'*/ ];

  const badgeColors: Record<string, string> = {
    Active: 'green',
    Recruitment: 'blue',
    Inactive: 'gray',
    Private: 'purple',
  };

  const statusPolish: Record<string, string> = {
    Active: 'Aktywny',
    Recruitment: 'Rekrutacja',
    Inactive: 'Zakończony',
    Private: 'Prywatny',
  };

  const handleSend = (status: ProjectStatus) => {
    onSend(status);
    setOpen(false);
  }

  return <BaseModalWindow
    headerText={headerText}
    open={open}
    onOpenChange={({ open }) => {
      if (!open) {
        setSelected(initialStatus);
      }
      setOpen(open);
    }}
    trigger={React.cloneElement(trigger, { onClick: () => setOpen(true) })}
    body={
      <HStack gap={4}>
        {badgeOptions.map((status) => (
          <Badge
            key={status}
            size="lg"
            variant={selected === status ? 'solid' : 'subtle'}
            colorScheme={badgeColors[status]}
            cursor="pointer"
            onClick={() => setSelected(status)}
          >
            {statusPolish[status]}
          </Badge>
        ))}
      </HStack>
    }
    sendButton={
      <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} width="100%">
        <TextCloseButton variant="outline" onClick={() => {
          setSelected(initialStatus);
          setOpen(false);
        }}>
          {cancelButtonText}
        </TextCloseButton>
        <SendMessageButton onClick={
          () => handleSend(selected)
        }>{sendButtonText}</SendMessageButton>
      </Box>
    }
  />
}

/* -------------------------------------------------------------------------
   Function AddUserModal
--------------------------------------------------------------------------- */
interface AddUserModalProps {
  headerText: string;
  trigger: React.ReactElement
  selectPlaceholder: string;
  descriptionPlaceholder: string;
  cancelButtonText: string;
  sendButtonText: string;
  options: string[];
  onSend: (option: string, description: string) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  headerText,
  trigger,
  selectPlaceholder,
  descriptionPlaceholder,
  cancelButtonText,
  sendButtonText,
  options,
  onSend,
}) => {
  const [open, setOpen] = React.useState(false);
  const [option, setOption] = React.useState('');
  const [userDesc, setUserDesc] = React.useState('');

  const handleSend = () => {
    onSend(option, userDesc);
    setOption('');
    setUserDesc('');
    setOpen(false); // Close the modal
  };

  return (
    <BaseModalWindow
      headerText={headerText}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      trigger={React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      body={
        <>
          {/* THIS MUST CHANGE AFTER SEARCH ENGINE IS IMPLEMENTED! */}
          <NativeSelect.Root size="sm" width="100%">
            <NativeSelect.Field
              placeholder={selectPlaceholder}
              value={option}
              onChange={(e) => setOption(e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Textarea
            placeholder={descriptionPlaceholder}
            value={userDesc}
            onChange={(e) => setUserDesc(e.target.value)}
            mt={4}
          />
        </>
      }
      sendButton={
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} width="100%">
          <TextCloseButton variant="outline" onClick={() => setOpen(false)}>
            {cancelButtonText}
          </TextCloseButton>
          <SendMessageButton onClick={handleSend}>{sendButtonText}</SendMessageButton>
        </Box>
      }
    />
  );
};