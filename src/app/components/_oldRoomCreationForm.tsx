import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { defaultTransition } from '@/app/lib/animationConfig';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { z } from 'zod';

// Define a Zod schema for your form
const formSchema = z
  .object({
    blueTeamName: z
      .string()
      .min(1, 'Les noms des équipes ne peuvent pas être vides'),
    redTeamName: z
      .string()
      .min(1, 'Les noms des équipes ne peuvent pas être vides'),
  })
  .refine((data) => data.blueTeamName !== data.redTeamName, {
    message: 'Les noms des deux équipes ne peuvent pas être identiques',
    path: ['blueTeamName', 'redTeamName'],
  });

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.3 },
};

interface RoomCreationFormProps {
  onCreate: (blueTeamName: string, redTeamName: string) => void;
}
interface FormErrors {
  blueTeamName?: string;
  redTeamName?: string;
}

interface FormData {
  blueTeamName: string;
  redTeamName: string;
}


export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({
  onCreate,
}) => {
  const [formData, setFormData] = useState<FormData>({
    blueTeamName: '',
    redTeamName: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [shouldShake, setShouldShake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof FormData;
      value: string;
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (isSubmitted) {
      // Update only the error for the changed field, if it exists
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    const result = formSchema.safeParse(formData);

    if (result.success) {
      onCreate(formData.blueTeamName, formData.redTeamName);
    } else {
      // Set all errors, including duplicate name error
      const updatedErrors = result.error.formErrors.fieldErrors;
      setFormErrors({
        blueTeamName: updatedErrors.blueTeamName?.[0] || '',
        redTeamName: updatedErrors.redTeamName?.[0] || '',
      });
      setShouldShake(!shouldShake);
    }
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const teams_input = [
    {
      id: 'blueTeamName',
      label: 'Équipe bleue',
      color: 'blue',
      value: formData.blueTeamName,
    },
    {
      id: 'redTeamName',
      label: 'Équipe rouge',
      color: 'red',
      value: formData.redTeamName,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        defaultTransition,
      }}
      className="flex flex-col items-center gap-6 rounded-md border p-6">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">Générer une chambre</h3>
          <p className="text-sm text-muted-foreground">{"Veuillez inscrire les noms des deux équipes qui vont s'affronter"}</p>
        </div>

        {(formErrors.blueTeamName || formErrors.redTeamName) && (
          <p className="text-xs text-red-600">
            {formErrors.blueTeamName || formErrors.redTeamName}
          </p>
        )}

        {teams_input.map((team) => (
          <div key={team.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <div
                className={clsx('h-2 w-2 rounded-full', {
                  'bg-blue': team.color === 'blue',
                  'bg-red': team.color === 'red',
                })}
              ></div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor={team.id}>
                {team.label}
              </label>
            </div>
            <motion.div
              key={shouldShake as any} // Using key to restart the animation
              animate={
                formErrors[team.id as keyof FormData] ? shakeAnimation : {}
              }
            >
              <Input
                type="text"
                name={team.id}
                onChange={handleInputChange}
                value={team.value}
                onKeyDown={handleKeyPress}
                className={`${formErrors[team.id as keyof FormData]
                  ? 'border border-red-700 border-opacity-50'
                  : ''
                  }`}
              />
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.585, 0.535, 0.23, 0.85],
        }}
        className="w-full"
      >
        <Button

          className={`w-full ${!formData.blueTeamName || !formData.redTeamName ? 'opacity-10' : ''
            }`}
          onClick={handleSubmit}
        >
          {'Créer une salle'}
        </Button>
      </motion.div>
    </motion.div>
  );
};
