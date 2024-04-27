import React from 'react';
import { motion } from 'framer-motion';
import { InputForm } from '@/app/components/forms/InputForm'; // Ensure the import path is correct

interface TeamsName {
  blueTeamName: string;
  redTeamName: string;
}

interface RoomCreationFormProps {
  submit: (data: TeamsName) => Promise<void>;
}

export const RoomCreationForm: React.FC<RoomCreationFormProps> = (
  { submit }: RoomCreationFormProps
) => {
  return (
    <motion.div className="p-6 border rounded-md flex flex-col gap-4 max-w-md">
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">Générer une chambre</h3>
        <p className="text-xs font-normal text-muted-foreground">{"Veuillez inscrire les noms des deux équipes qui vont s'affronter"}</p>
      </div>
      <InputForm submit={(data) => submit(data)} />
    </motion.div>
  );
};
