import { useState, useEffect } from "react";
import supabase from '@/app/services/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from "@/app/types/supabase";

type HeroPoolItem = {
  name: string;
  selected: boolean;
};

type Room = Database["public"]["Tables"]["rooms"]["Row"] & {
  blue: Database["public"]["Tables"]["teams"]["Row"];
  red: Database["public"]["Tables"]["teams"]["Row"];
  heroes_pool: HeroPoolItem[];
};

type TableType = "rooms" | "teams";
type DataType<T extends TableType> = T extends "rooms"
  ? Room
  : Database["public"]["Tables"]["teams"]["Row"];

const useFetchData = <T extends TableType>(tableName: T, id: string) => {
  const [data, setData] = useState<DataType<T> | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const subscription = supabase
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: tableName,
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const { new: updatedData } = payload;
          setData(updatedData as DataType<T>);
        }
      )
      .subscribe(() => {
        console.log("Subscription to SQL updates");
      });

    return () => {
      // unsubscribe when the component unmounts
      subscription.unsubscribe();
      console.log("return - subscription:", subscription);
    };
  }, [id, tableName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error: fetchError } = await supabase
          .from<T>(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }
          setData(fetchedData as DataType<T>);
      } catch (error) {
        console.log("fetchData - error:", error);
        setError(error as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, tableName]);

  return { data, error, isLoading };
};

export default useFetchData;