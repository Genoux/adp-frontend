// import React, { useState, useEffect } from 'react';
// import { tournament } from '@/app/lib/supabase/client';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
// import { Button } from '@/app/components/ui/button'; // Ensure correct import

// interface Team {
//   name: string;
// }

// interface FormSelectProps {
//   onSelect: (blueTeamName: string, redTeamName: string) => void;
// }

// export const FormSelect: React.FC<FormSelectProps> = ({ onSelect }) => {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [blueTeamName, setBlueTeamName] = useState('');
//   const [redTeamName, setRedTeamName] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchTeams() {
//       const { data, error } = await tournament.from('teams').select('*');
//       if (error) {
//         console.error('Failed to fetch teams:', error);
//       } else {
//         setTeams(data || []);
//       }
//     }
//     fetchTeams();
//   }, []);

//   const onTeamSelect = (teamName: string) => {
//     console.log('Selected team:', teamName);
//   }

//   console.log('puzzel@gland')

//   const handleSubmit = () => {
//     if (!blueTeamName || !redTeamName) {
//       setError('Both teams must be selected.');
//       return;
//     }
//     if (blueTeamName === redTeamName) {
//       setError('The selections for the two teams cannot be identical.');
//       return;
//     }
//     setError('');
//     onSelect(blueTeamName, redTeamName);
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <SelectWithTeams
//         label="Blue Team"
//         teams={teams}
//         selectedTeam={blueTeamName}
//         onTeamSelect={setBlueTeamName}
//       />
//       <SelectWithTeams
//         label="Red Team"
//         teams={teams}
//         selectedTeam={redTeamName}
//         onTeamSelect={setRedTeamName}
//       />
//       {error && <p className="text-red-500">{error}</p>}
//       <Button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//         Validate Teams
//       </Button>
//     </div>
//   );
// };

// interface SelectWithTeamsProps {
//   label: string;
//   teams: Team[];
//   selectedTeam: string;
//   onTeamSelect: (teamName: string) => void;
// }

// const SelectWithTeams: React.FC<SelectWithTeamsProps> = ({ label, teams, selectedTeam }) => (
//   <div>
//     <label>{label}:</label>
//     <Select>
//       <SelectTrigger className="w-full">
//         <SelectValue>{selectedTeam || `Select a team`}</SelectValue>
//       </SelectTrigger>
//       <SelectContent>
//         {teams.map(team => (
//           <SelectItem key={team.name} value={team.name} onSelect={eamSelect(team.name)}>
//             {team.name}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   </div>
// );
