import React from 'react';
import { motion } from 'framer-motion';
import { InputForm } from '@/app/components/forms/InputForm'; // Ensure the import path is correct

interface RoomCreationFormProps {
  submit: (data: { blueTeam: string; redTeam: string }) => Promise<void>;
}

export const RoomCreationForm: React.FC<RoomCreationFormProps> = (
  { submit }: RoomCreationFormProps
) => {
  return (
    <motion.div className="p-6 border rounded-md flex flex-col items-center gap-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">Générer une chambre</h3>
        <p className="text-xs font-normal text-muted-foreground">{"Veuillez inscrire les noms des deux équipes qui vont s'affronter"}</p>
      </div>
      <InputForm submit={(data: { blueTeam: string, redTeam: string }) => submit(data)} />
    </motion.div>
  );
};
