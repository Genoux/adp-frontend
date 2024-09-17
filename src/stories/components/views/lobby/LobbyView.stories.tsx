import LobbyView from '@/app/components/views/lobby/LobbyView';
import { useSocketMock, useTeamsMock } from '@/stories/mocks/mockHooks';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'Views/LobbyView',
  component: LobbyView,
  decorators: [
    (Story) => {
      // Mock the hooks
      jest.mock('@/app/hooks/useTeams', () => useTeamsMock);
      jest.mock('@/app/hooks/useSocket', () => useSocketMock);
      return <Story />;
    },
  ],
} as Meta;

const Template: StoryFn = () => <LobbyView />;

export const Default = Template.bind({});

export const OneTeamReady = Template.bind({});
OneTeamReady.decorators = [
  (Story) => {
    const modifiedTeamData = {
      ...useTeamsMock(),
      currentTeam: { ...useTeamsMock().currentTeam, ready: true },
    };
    jest.mock('@/app/hooks/useTeams', () => () => modifiedTeamData);
    return <Story />;
  },
];

export const BothTeamsReady = Template.bind({});
BothTeamsReady.decorators = [
  (Story) => {
    const modifiedTeamData = {
      ...useTeamsMock(),
      currentTeam: { ...useTeamsMock().currentTeam, ready: true },
      otherTeam: { ...useTeamsMock().otherTeam, ready: true },
    };
    jest.mock('@/app/hooks/useTeams', () => () => modifiedTeamData);
    return <Story />;
  },
];
