import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { tournament } from '@/app/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  blueTeamName: z.string({
    required_error: 'Please select an email to display.',
  }),
  redTeamName: z.string({
    required_error: 'Please select an email to display.',
  }),
});
interface Team {
  name: string;
}

interface FormSelectProps {
  submit: (data: z.infer<typeof FormSchema>) => void;
}

export function InputSelect({ submit }: FormSelectProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      blueTeamName: '',
      redTeamName: '',
    },
  });

  const { watch } = form;
  const blueTeamName = watch('blueTeamName');
  const redTeamName = watch('redTeamName');

  useEffect(() => {
    async function fetchTeams() {
      const { data, error } = await tournament.from('teams').select('*');
      console.log('fetchTeams - data:', data);
      if (error) {
        console.error('Failed to fetch teams:', error);
      } else {
        setTeams(data || []);
      }
    }
    fetchTeams();
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { blueTeamName, redTeamName } = data;

    if (blueTeamName === redTeamName) {
      setErrorMessage('Vous ne pouvez pas selectionner la même équipe');
      return;
    }

    submit(data);
    console.log('onSubmit - data:', data);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col"
        >
          {errorMessage && (
            <FormMessage className="mb-4">{errorMessage}</FormMessage>
          )}
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="blueTeamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-blue">
                    <span className="h-2 w-2 bg-blue"></span>
                    Équipe Bleue
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionnez l'équipe bleue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.name} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redTeamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-red">
                    <span className="h-2 w-2 bg-red"></span>
                    Équipe Rouge
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionnez l'équipe rouge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.name} value={team.name}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            size={'lg'}
            className="mt-6 disabled:border disabled:bg-white disabled:bg-opacity-10 disabled:font-normal disabled:text-white disabled:text-opacity-30"
            type="submit"
            disabled={
              !blueTeamName || !redTeamName || blueTeamName === redTeamName
            }
          >
            Créer une chambre
          </Button>
        </form>
      </Form>
    </>
  );
}
