import {
  ContentCard,
  ContentCardProps,
} from "@/components/ui/content-card.tsx";
import {
  Button,
  ButtonProps,
  Flex, Image,
  Textarea,
  TextareaProps
} from "@chakra-ui/react";
import React, {ComponentProps, useState} from "react";
import {EditButton} from "@/components/ui/icon-buttons.tsx";
import {TagList, TagListProps} from "@/components/ui/tag-list.tsx";
import {Tag, TagProps} from "@/components/ui/tag.tsx";
import Plus from '@/assets/icons/plus.svg';
import { MessageModal } from "@/components/ui/modal-message.tsx";


interface HelperProps extends ContentCardProps {
  acceptButtonText: string;
  cancelButtonText: string;
  acceptButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  acceptDesc?: (desc: string) => void;
  onDiscard?: () => void;
  textareaProps?: TextareaProps;
  edit?: boolean;
  setEdit: (value: boolean) => void;
}

export interface ContentCardEditableProps extends Omit<HelperProps, "edit" | "setEdit"> {}

export interface ContentCardEditableWrapperProps extends ContentCardEditableProps {
  tags: string[];
  tagListArgs?: TagListProps;
  tagArgs?: TagProps;
  onAccept?: (dsc: string, tags: string[]) => void;
  addTagModalProps?: ComponentProps<typeof MessageModal>;
}

const Helper: React.FC<HelperProps> = ({
  acceptButtonText,
  cancelButtonText,
  acceptButtonProps,
  cancelButtonProps,
  acceptDesc,
  onDiscard,
  textareaProps,
  description,
  cardVariant = "title-button",
  edit,
  setEdit,
  ...props
}) => {
  const [dsc, setDsc] = useState<string>(description);
  const [prevDsc, setPrevDsc] = useState<string>(description);

  const editButton = <EditButton onClick={() => setEdit(true)} />;

  const handleAccept = () => {
    if (acceptDesc) {
      acceptDesc(dsc);
    }

    setEdit(false);
    setPrevDsc(dsc);
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }

    setDsc(prevDsc);
  }

  const descriptionSection = (
    <Textarea
      {...textareaProps}
      onChange={(e) => {setDsc(e.target.value)}}
      defaultValue={dsc}
    />
  );

  const tagsWithButtons = (
    <>
      {props.footerList}
      {edit && <Flex
        justifyContent="flex-end"
        flexDirection="row"
        columnGap="0.5em"
        w="100%"
        mt="32px"
      >
        <Button {...acceptButtonProps} onClick={handleAccept}>
          {acceptButtonText}
        </Button>
        <Button {...cancelButtonProps} onClick={handleDiscard}>
          {cancelButtonText}
        </Button>
      </Flex>}
    </>
  );

  return (
    <ContentCard
      descriptionElement={edit ? descriptionSection : undefined}
      actionElement={editButton}
      {...props}
      description={dsc}
      cardVariant={edit ? "none" : cardVariant}
      footerList={tagsWithButtons}
    />
  );
};


export const ContentCardEditable: React.FC<ContentCardEditableProps> = ({
  ...props
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  return (
    <Helper
      edit={edit}
      setEdit={setEdit}
      {...props}
    />
  );
};

export const ContentCardEditableWrapper: React.FC<ContentCardEditableWrapperProps> = ({
  tags,
  tagListArgs,
  tagArgs,
  onAccept,
  addTagModalProps,
  ...props
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [list, setList] = useState<string[]>(tags);
  const [prevList, setPrevList] = useState<string[]>(tags);

  const addTagModal = <MessageModal
    headerText="Dodaj nowy tag"
    trigger={
      <Tag>
        <Image src={Plus}/>
      </Tag>
    }
    placeholder="Wpisz nazwę"
    sendButtonText = "Dodaj"
    onSend={(tagName) => setList(prevList => [...prevList, tagName])}
    {...addTagModalProps}
  />

  const footerList = <TagList
    {...tagListArgs}
    addTagComponent={edit ? addTagModal : undefined}
  >
    {list.map((tag) => (
        <Tag
          key={tag}
          {...tagArgs}
          closable={edit}
          onClose={() => {
            setList(l =>  l.filter((item) => item !== tag));
          }}
        >
          {tag}
        </Tag>
    ))}
  </TagList>

  const onAcceptNew = (s : string) => {
    if (onAccept) {
      onAccept(s, list);
    }

    setPrevList(list);
  }

  const onDiscard = () => {
    setEdit(false);
    setList(prevList);
  }

  return <Helper
    {...props}
    edit={edit}
    setEdit={setEdit}
    footerList={footerList}
    acceptDesc={onAcceptNew}
    onDiscard={onDiscard}
  />
}
