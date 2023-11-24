import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import clsx from "clsx";
import { motion } from "framer-motion";

interface RoomCreationFormProps {
  onCreate: (blueTeamName: string, redTeamName: string) => void;
}

export const RoomCreationForm: React.FC<RoomCreationFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    blueTeamName: "",
    redTeamName: "",
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
    { id: 'blueTeamName', label: 'Équipe bleue', color: 'blue', value: formData.blueTeamName },
    { id: 'redTeamName', label: 'Équipe rouge', color: 'red', value: formData.redTeamName },
  ];

  return (
    <div className="flex flex-col gap-6 items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
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
              <div className={clsx("w-2.5 h-2.5 rounded-full", {
                "bg-blue": team.color === 'blue',
                "bg-red": team.color === 'red'
              })
              }></div>
              <label htmlFor={team.id}>{team.label}</label>
            </div>
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
