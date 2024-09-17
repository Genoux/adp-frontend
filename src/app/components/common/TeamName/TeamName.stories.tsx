import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import TeamName, { TeamNameProps } from './TeamName';

export default {
  title: 'Components/TeamName',
  component: TeamName,
  argTypes: {
    color: {
      control: { type: 'select', options: ['blue', 'red'] },
    },
    name: { control: 'text' },
    className: { control: 'text' },
  },
} as Meta<typeof TeamName>;

const Template: StoryFn<TeamNameProps> = (args) => <TeamName {...args} />;

export const BlueTeam = Template.bind({});
BlueTeam.args = {
  color: 'blue',
  name: 'Blue Team',
};

export const RedTeam = Template.bind({});
RedTeam.args = {
  color: 'red',
  name: 'Red Team',
};

// Optional: A story to show both variations side by side
export const BothTeams: StoryFn<TeamNameProps> = () => (
  <div className="flex space-x-4">
    <TeamName color="blue" name="Blue Team" />
    <TeamName color="red" name="Red Team" />
  </div>
);
