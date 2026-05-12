import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '@chakra-ui/react';
import { Tag } from '../components/ui/tag';
import { ComponentProps } from 'react';

type StoryProps = ComponentProps<typeof Tag> & {
  tagText : string;
};

const meta : Meta<StoryProps> = {
  title: 'UI/Tag',
  component: Tag,

  tags: ['autodocs'],
  argTypes: {
    tagText: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fontSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    closable: {
      control: 'boolean',
    },
    onClose: {
      action: 'closed',
    },
  },
}

export default meta;

type Story = StoryObj<typeof meta>;

const tooltipProps = { content: <Text>Wyszukaj projekt</Text>}

export const NonClosable: Story = {
  args: {
    tagText: "Philosophy",
    size : "lg",
    fontSize: "lg",
    closable: false,
    tooltipProps,
  },
  render: ({ tagText, ...args}) => {
    return <Tag {...args}>{tagText}</Tag>
  }
};

export const Closable: Story = {
  args: {
    tagText: "Philosophy",
    size : "lg",
    fontSize: "lg",
    closable: true,
    tooltipProps,

  },
  render: ({ tagText, ...args}) => {
    return (
      <Tag {...args}>{tagText}</Tag>
    )
  }
};