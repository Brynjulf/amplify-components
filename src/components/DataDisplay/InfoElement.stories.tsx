import { Meta, Story } from '@storybook/react';

import InfoElement, { InfoElementProps } from './InfoElement';

export default {
  title: 'DataDisplay/InfoElement',
  component: InfoElement,
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
  },
  args: {
    title: 'Title',
    content: 'Content',
  },
} as Meta;

const Template: Story<InfoElementProps> = (args) => <InfoElement {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
