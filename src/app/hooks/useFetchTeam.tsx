'use client'

import { useEffect, useState } from 'react';
import supabase from '@/app/services/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface Team {
  // Include the fields for your Team type here
  [key: string]: any;
}

const useFetchTeam = (teamid: string) => {
  const [data, setData] = useState<Team | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data: team, error: fetchError } = await supabase
          .from('teams')
          .select('*')
          .eq('id', teamid)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const subscription = supabase
        .channel(teamid)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "teams",
            filter: `id=eq.${teamid}`,
          },
          async (payload) => {
            try {
              const { new: updatedTeam } = payload;
              console.log("updatedTeam:", updatedTeam);
              setData(updatedTeam);
            } catch (error) {
              console.error("Error updating team:", error);
            }
          }).subscribe(() => console.log("Subscription to team updated"));
        setData(team);
      } catch (error) {
        console.log("fetchTeam - error:", error);
        setError(error as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamid]);

  return { data, error, isLoading };
};

export default useFetchTeam;
