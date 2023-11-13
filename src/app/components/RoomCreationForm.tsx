import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { defaultTransition } from '@/app/lib/animationConfig';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface RoomCreationFormProps {
  onCreate: (blueTeamName: string, redTeamName: string) => void;
}

export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    blueTeamName: '',
    redTeamName: '',
  });

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (formData.blueTeamName && formData.redTeamName) {
      onCreate(formData.blueTeamName, formData.redTeamName);
    }
  };

  const teams = [
    {
      id: 'blueTeamName',
      label: 'Équipe bleue:',
      color: 'blue',
      value: formData.blueTeamName,
    },
    {
      id: 'redTeamName',
      label: 'Équipe rouge:',
      color: 'red',
      value: formData.redTeamName,
    },
  ];

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
        className="mx-auto mb-12 flex flex-col items-end justify-end text-center"
      >
        <Image src="home-logo.svg" width={460} height={0} alt={''} />
      </motion.div>
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            ease: [0.585, 0.535, 0.23, 0.85],
          }}
          className="flex flex-col gap-6 w-full"
        >
          {teams.map((team) => (
            <div key={team.id} className="flex flex-col gap-2">
              <label htmlFor={team.id}>{team.label}</label>
              <div
                className={clsx('h-2 w-full', {
                  'bg-blue': team.color === 'blue',
                  'bg-red': team.color === 'red',
                })}
              ></div>
              <Input
                type="text"
                name={team.id}
                onChange={handleInputChange}
                value={team.value}
              />
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.585, 0.535, 0.23, 0.85],
          }}
          className="flex flex-row gap-6  mt-4"
        >
          <Button
            size="lg"
            className={`mt-6 rounded-sm bg-yellow text-sm font-bold uppercase text-yellow-text hover:bg-yellow-hover ${
              !formData.blueTeamName || !formData.redTeamName
                ? 'opacity-10'
                : ''
            }`}
            onClick={handleSubmit}
          >
            {'Créer une salle'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
