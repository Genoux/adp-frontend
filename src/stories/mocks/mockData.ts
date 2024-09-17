// mockData.ts
export const mockTeamData = {
  currentTeam: {
    id: '1',
    name: 'Blue Team',
    color: 'blue',
    ready: false,
    room_id: 'room1',
  },
  otherTeam: {
    id: '2',
    name: 'Red Team',
    color: 'red',
    ready: false,
    room_id: 'room1',
  },
  redTeam: {
    id: '2',
    name: 'Red Team',
    color: 'red',
    ready: false,
    room_id: 'room1',
  },
  blueTeam: {
    id: '1',
    name: 'Blue Team',
    color: 'blue',
    ready: false,
    room_id: 'room1',
  },
};

export const mockSocket = {
  emit: (event: string, data: any) =>
    console.log(`Emitted ${event} with`, data),
  on: (event: string, callback: Function) => {},
  // Add other methods as needed
};
