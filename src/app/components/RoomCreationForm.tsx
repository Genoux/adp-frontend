import { InputForm } from '@/app/components/forms/InputForm';
import { InputSelect } from '@/app/components/forms/InputSelect';
import defaultTransition from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import React from 'react';

type TeamsName = {
  blueTeamName: string;
  redTeamName: string;
};
type RoomCreationFormProps = {
  submit: (data: TeamsName) => Promise<void>;
};

export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({
  submit,
}: RoomCreationFormProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ defaultTransition, delay: 0.5 }}
        className="flex flex-col gap-2 border p-6"
      >
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">
            Générer une chambre
          </h3>
          <p className="pb-4 text-xs font-normal text-muted-foreground">
            {
              "Veuillez selectionner les noms des deux équipes qui vont s'affronter"
            }
          </p>
        </div>
        {process.env.NEXT_PUBLIC_APP_MODE === 'tournament' ? (
          <InputSelect submit={(data) => submit(data)} />
        ) : (
          <InputForm submit={(data) => submit(data)} />
        )}
      </motion.div>
    </>
  );
};
