import TeamDisplay from '@/app/components/views/lobby/TeamDisplay';
import { Json } from '@/app/types/supabase'; // Adjust this import path as needed
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

type Team = {
  can_select: boolean;
  color: string;
  heroes_ban: Json;
  heroes_selected: Json;
  id: number;
  is_turn: boolean;
  name: string;
  ready: boolean;
  room_id: number | null;
};

export default {
  title: 'Components/Lobby/TeamDisplay',
  component: TeamDisplay,
  argTypes: {
    team: { control: 'object' },
    isCurrentTeam: { control: 'boolean' },
  },
} as Meta;

const Template: StoryFn<typeof TeamDisplay> = (args) => (
  <TeamDisplay {...args} />
);

const createMockTeam = (overrides: Partial<Team> = {}): Team => ({
  can_select: false,
  color: 'blue',
  heroes_ban: null,
  heroes_selected: null,
  id: 1,
  is_turn: false,
  name: 'Team Name',
  ready: false,
  room_id: 1,
  ...overrides,
});

export const BlueTeam = Template.bind({});
BlueTeam.args = {
  team: createMockTeam({
    id: 1,
    name: 'Blue Team',
    color: 'blue',
    ready: false,
  }),
  isCurrentTeam: true,
};

export const RedTeam = Template.bind({});
RedTeam.args = {
  team: createMockTeam({
    id: 2,
    name: 'Red Team',
    color: 'red',
    ready: true,
  }),
  isCurrentTeam: false,
};
