import React from 'react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InputForm } from '@/app/components/forms/InputForm'; // Ensure the import path is correct
import { InputSelect } from '@/app/components/forms/InputSelect'; // Ensure the import path is correct
import NoticeBanner from '@/app/components/common/NoticeBanner';
import { defaultTransition } from '@/app/lib/animationConfig';

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 10}}
        animate={{ opacity: 1, y: 0}}
        exit={{ opacity: 0 }}
        transition={{ defaultTransition, delay: 0.5}}
        
        className="p-6 border rounded-md flex flex-col gap-4 max-w-md">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">Générer une chambre</h3>
          <p className="text-xs font-normal text-muted-foreground">{"Veuillez inscrire les noms des deux équipes qui vont s'affronter"}</p>
        </div>
        <InputSelect submit={(data) => submit(data)} />
        {/* <InputForm submit={(data) => submit(data)} /> */}
      </motion.div>
      <NoticeBanner message="Si votre équipe n'apparet pas dans la list, veuillez contacter un admin" />
    </>
  );
};
