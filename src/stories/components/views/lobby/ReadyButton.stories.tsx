import ReadyButton from '@/app/components/views/lobby/ReadyButton';
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
  title: 'Components/Lobby/ReadyButton',
  component: ReadyButton,
  argTypes: {
    currentTeam: { control: 'object' },
    otherTeam: { control: 'object' },
  },
} as Meta;

const Template: StoryFn<typeof ReadyButton> = (args) => (
  <ReadyButton {...args} />
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

export const NotReady = Template.bind({});
NotReady.args = {
  currentTeam: createMockTeam({
    name: 'Blue Team',
    color: 'blue',
    ready: false,
  }),
  otherTeam: createMockTeam({
    id: 2,
    name: 'Red Team',
    color: 'red',
    ready: false,
  }),
};

export const Ready = Template.bind({});
Ready.args = {
  currentTeam: createMockTeam({
    name: 'Blue Team',
    color: 'blue',
    ready: true,
  }),
  otherTeam: createMockTeam({
    id: 2,
    name: 'Red Team',
    color: 'red',
    ready: false,
  }),
};
