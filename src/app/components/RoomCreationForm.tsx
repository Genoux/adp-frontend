import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge"
import Image from "next/image";
import clsx from "clsx";

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
    { id: 'blueTeamName', label: 'Équipe bleue:', color: 'blue', value: formData.blueTeamName },
    { id: 'redTeamName', label: 'Équipe rouge:', color: 'red', value: formData.redTeamName },
  ];

  return (
    <div className="flex flex-col">
      <div className="text-center justify-end items-end mx-auto flex flex-col  mb-24">
        <Image
          src={`/home-logo.svg`}
          width={460}
          height={0} alt={""}/>
      </div>
  
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-row gap-6">
          {teams.map(team => (
            <div key={team.id} className="flex flex-col gap-2">
              <label htmlFor={team.id}>{team.label}</label>
              <div className={clsx("w-full h-2", {
                "bg-blue": team.color === 'blue',
                "bg-red": team.color === 'red'
              })
              }></div>
              <Input
                type="text"
                name={team.id}
                className="my-input"
                onChange={handleInputChange}
                value={team.value}
              />
            </div>
          ))}
        </div>
        <Button
          size="lg"
          className={`bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold mt-6 ${!formData.blueTeamName || !formData.redTeamName ? "opacity-10" : ""}`}
          onClick={handleSubmit}
        >
          {"Créer une salle"}
        </Button>
      </div>


    </div>
  );
}
