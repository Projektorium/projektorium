import React, {useState} from 'react';
import {
  FileUpload, FileUploadRootProps, Icon
} from '@chakra-ui/react';
import { LuUpload } from 'react-icons/lu';
import {SendMessageButton} from "@/components/ui/icon-buttons.tsx";
import {BaseModalWindow} from "@/components/ui/modal-base-window.tsx";

export interface ModalWindowUploadProps {
  headerText: string;
  trigger: React.ReactElement;
  sendButtonText?: string;
  onSend?: (message: File[]) => void;
  dropzoneContent?: React.ReactElement;
  fileUploadProps?: FileUploadRootProps;
}

export const ModalFileUpload: React.FC<ModalWindowUploadProps> = ({
  headerText = "Wgraj pliki",
  trigger,
  sendButtonText,
  onSend,
  dropzoneContent,
  fileUploadProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = useState<File[] | null>(null);

  const handleSend = () => {
    if (onSend && files) {
      onSend(files);
    }
    setFiles(null);
    setOpen(false); // Close the modal
  };

  return (
    <BaseModalWindow
      headerText={headerText}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      trigger={React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      body={
        <FileUpload.Root
          maxW="xl"
          alignItems="stretch"
          maxFiles={10}
          onFileAccept={(f) => setFiles(f.files)}
          {...fileUploadProps}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              {dropzoneContent}
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.map((file) => (
                  <FileUpload.Item key={file.name} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger />
                  </FileUpload.Item>
                ))
              }
            </FileUpload.Context>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      }
      sendButton={
        <SendMessageButton onClick={handleSend}>{sendButtonText}</SendMessageButton>
      }
    />
  );
}
