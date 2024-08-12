import { Button } from '@/app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z
  .object({
    blueTeamName: z
      .string()
      .min(2, "Le nom de l'équipe doit contenir au moins 2 caractères"),
    redTeamName: z
      .string()
      .min(2, "Le nom de l'équipe doit contenir au moins 2 caractères"),
  })
  .refine((data) => data.blueTeamName !== data.redTeamName, {
    message: 'Les deux équipes ne peuvent pas avoir le même nom',
    path: ['redTeamName'],
  });

type FormData = z.infer<typeof FormSchema>;

interface InputFormProps {
  submit: (data: FormData) => void;
}

export function InputForm({ submit }: InputFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      blueTeamName: '',
      redTeamName: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setFormError(null);
    submit(data);
    form.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await form.trigger();
    if (!result) {
      const errors = form.formState.errors;
      if (errors.blueTeamName) {
        setFormError(errors.blueTeamName.message || null);
      } else if (errors.redTeamName) {
        setFormError(errors.redTeamName.message || null);
      }
    } else {
      form.handleSubmit(onSubmit)(e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        {formError && <FormMessage className="mb-4">{formError}</FormMessage>}
        <div className="flex flex-col gap-6">
          {['blue', 'red'].map((color) => (
            <FormField
              key={color}
              control={form.control}
              name={`${color}TeamName` as 'blueTeamName' | 'redTeamName'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`flex items-center gap-2 text-${color}`}
                  >
                    <span className={`h-2 w-2 bg-${color}`}></span>
                    Équipe {color === 'blue' ? 'Bleue' : 'Rouge'}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          size="lg"
          className="mt-6 disabled:border disabled:bg-white disabled:bg-opacity-10 disabled:font-normal disabled:text-white disabled:text-opacity-30"
          type="submit"
        >
          Créer une chambre
        </Button>
      </form>
    </Form>
  );
}
