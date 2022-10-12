import { Button, Chip, Icon } from '@equinor/eds-core-react';
import { account_circle, more_vertical } from '@equinor/eds-icons';
import { Meta, Story } from '@storybook/react';

import DataCard, { DataCardProps } from './DataCard';

import styled from 'styled-components';

export default {
  title: 'DataDisplay/DataCard',
  component: DataCard,
} as Meta;

const DataTypeCardBody = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 4em;
`;

const Template: Story<DataCardProps> = (args) => (
  <div style={{ width: '300px' }}>
    <DataCard {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  headerText: 'PETROPHYSICIST',
  title: 'Composite',
};

export const Compact = Template.bind({});
Compact.args = {
  headerText: 'PETROPHYSICIST',
  title: 'Composite',
  rightIcon: account_circle,
};

export const IconLongText = Template.bind({});
IconLongText.args = {
  headerText: 'PETROMOST',
  title: 'This is a long text and will be collapsed down.',
  rightIcon: account_circle,
};

export const ButtonLongText = Template.bind({});
ButtonLongText.args = {
  headerText: 'PETROMOST',
  title: 'This is a long text and will be collapsed down.',
  rightElement: (
    <Button variant="ghost_icon">
      <Icon data={account_circle} />
    </Button>
  ),
  body: (
    <DataTypeCardBody>
      <Chip>Responsible user</Chip>
      <Button variant="ghost_icon">
        <Icon data={account_circle} />
      </Button>
    </DataTypeCardBody>
  ),
};

export const Body = Template.bind({});
Body.args = {
  headerText: 'PETROPHYSICIST',
  title: 'Composite',
  rightElement: <Icon data={account_circle} style={{ marginRight: '12px' }} />,
  body: (
    <DataTypeCardBody>
      <Chip>Responsible user</Chip>
      <Button variant="ghost_icon">
        <Icon data={more_vertical} />
      </Button>
    </DataTypeCardBody>
  ),
};
