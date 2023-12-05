import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import clsx from "clsx";
import { motion } from "framer-motion";
import { z } from "zod";

// Define a Zod schema for your form
const formSchema = z.object({
  blueTeamName: z.string().min(1, "Le nom de l'équipe est requis"),
  redTeamName: z.string().min(1, "Le nom de l'équipe est requis"),
});

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.3 }
};

interface RoomCreationFormProps {
  onCreate: (blueTeamName: string, redTeamName: string) => void;
}

interface FormData {
  blueTeamName: string;
  redTeamName: string;
}

export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<FormData>({
    blueTeamName: "",
    redTeamName: "",
  });

  const [formErrors, setFormErrors] = useState<FormData>({
    blueTeamName: "",
    redTeamName: "",
  });

  const [shouldShake, setShouldShake] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as keyof FormData]: value,
    }));

    // Clear the error message for the input field if it's not empty
    if (value.trim() !== '') {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name as keyof FormData]: '',
      }));
    }
  };

  const handleSubmit = () => {
    const result = formSchema.safeParse(formData);

    if (result.success) {
      onCreate(formData.blueTeamName, formData.redTeamName);
    } else {
      // Set errors and trigger shake animation
      const updatedErrors = result.error.formErrors.fieldErrors;
      setFormErrors({
        blueTeamName: updatedErrors.blueTeamName?.[0] || "",
        redTeamName: updatedErrors.redTeamName?.[0] || "",
      });
      setShouldShake(!shouldShake); // Toggle to trigger animation
    }
  };


  const teams = [
    { id: 'blueTeamName', label: 'Équipe bleue', color: 'blue', value: formData.blueTeamName },
    { id: 'redTeamName', label: 'Équipe rouge', color: 'red', value: formData.redTeamName },
  ];

  return (
    <div className="flex flex-col gap-6 items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: [0.585, 0.535, 0.230, 0.850]
        }}
        className="flex flex-col gap-6 w-full"
      >
        <div className="text-center border-b border-opacity-25 pb-4 mb-4">
          <h1 className="text-2xl font-bold">Generer une chambre</h1>
          <p className="text-sm font-normal opacity-50">{"Inscrivez le nom des deux équipes qui vont s'affronter."}</p>
        </div>
        {teams.map(team => (
          <div key={team.id} className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <div className={clsx("w-2 h-2 rounded-full", {
                "bg-blue": team.color === 'blue',
                "bg-red": team.color === 'red'
              })
              }></div>
              <label className="text-sm font-normal" htmlFor={team.id}>{team.label}</label>
            </div>
            <motion.div
              key={shouldShake as any} // Using key to restart the animation
              animate={formErrors[team.id as keyof FormData] ? shakeAnimation : {}}
            >
              <Input
                type="text"
                name={team.id}
                onChange={handleInputChange}
                value={team.value}
                className={`${formErrors[team.id as keyof FormData] ? "border border-red-700 border-opacity-50" : ""}`}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.585, 0.535, 0.230, 0.850]
        }}
        className="flex flex-row gap-6  mt-4"
      >
        <Button
          size="lg"
          className={`w-full ${!formData.blueTeamName || !formData.redTeamName ? "opacity-10" : ""}`}
          onClick={handleSubmit}
        >
          {"Créer une salle"}
        </Button>
      </motion.div>
    </div>
  );
}
