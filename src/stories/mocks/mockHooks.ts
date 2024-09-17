// mockHooks.ts
import { mockSocket, mockTeamData } from './mockData';

export const useTeamsMock = () => mockTeamData;
export const useSocketMock = () => ({ socket: mockSocket });
