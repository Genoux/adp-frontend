import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from "@/app/services/supabase";
// Assuming you have a function or API endpoint to fetch team status
// import { fetchTeamsStatus } from '../api';

interface ReadyRoomProps {
  teamid: string; // Replace with your specific type
}

const ReadyRoom: React.FC<ReadyRoomProps> = ({
  teamid
}) => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const setData = async () => {
      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamid)
        .single();
      console.log("setData - team:", team);
  
      setTeam(team);
    };
    
    setData();
  }, [teamid]);

  const handleReadyClick = () => {
    console.log("handleReadyClick");
  };

  return (
    <div>
      <button onClick={handleReadyClick}>READY</button>
    </div>
  );
};

export default ReadyRoom;
