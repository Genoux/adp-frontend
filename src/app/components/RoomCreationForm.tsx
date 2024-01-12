import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import clsx from "clsx";
import { motion } from "framer-motion";
import { z } from "zod";

// Define a Zod schema for your form
const formSchema = z.object({
  blueTeamName: z.string().min(1, "Les noms des équipes ne peuvent pas être vides"),
  redTeamName: z.string().min(1, "Les noms des équipes ne peuvent pas être vides"),
}).refine(data => data.blueTeamName !== data.redTeamName, {
  message: "Les noms des deux équipes ne peuvent pas être identiques",
  path: ["blueTeamName", "redTeamName"]
});

const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.3 }
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

export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState<FormData>({
    blueTeamName: "",
    redTeamName: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [shouldShake, setShouldShake] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as { name: keyof FormData, value: string };
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    if (isSubmitted) {
      // Update only the error for the changed field, if it exists
      setFormErrors(prevErrors => ({
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
        blueTeamName: updatedErrors.blueTeamName?.[0] || "",
        redTeamName: updatedErrors.redTeamName?.[0] || "",
      });
      setShouldShake(!shouldShake);
    }
  };

  const handleKeyPress = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };


  const teams = [
    { id: 'blueTeamName', label: 'Équipe bleue', color: 'blue', value: formData.blueTeamName },
    { id: 'redTeamName', label: 'Équipe rouge', color: 'red', value: formData.redTeamName },
  ];

  return (
    <div className="flex flex-col gap-6 items-center border p-8 rounded-md bg-black bg-opacity-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.2,
          ease: [0.585, 0.535, 0.230, 0.850]
        }}
        className="flex flex-col gap-6 w-full"
      >
        <div className="text-left">
          <h1 className="text-2xl font-bold">Générer une chambre</h1>
          <p className="text-sm font-normal opacity-50">{"Veuillez inscrire les noms des deux équipes qui vont s'affronter"}</p>
        </div>
        <div>
          <p className="text-red-600 text-xs">  {formErrors.blueTeamName || formErrors.redTeamName}</p>
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
                onKeyDown={handleKeyPress}
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
