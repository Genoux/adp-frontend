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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z
  .object({
    blueTeamName: z
      .string()
      .min(2, "Chaque équipe doit avoir un nom d'au moins 2 caractères"),
    redTeamName: z
      .string()
      .min(2, "Chaque équipe doit avoir un nom d'au moins 2 caractères"),
  })
  .superRefine(({ blueTeamName, redTeamName }, ctx) => {
    if (blueTeamName === redTeamName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les deux équipes ne peuvent pas avoir le même nom',
        path: ['redTeamName'],
      });
    }
  });

export type InputFormProps = {
  submit: (data: z.infer<typeof FormSchema>) => void;
}

export function InputForm({ submit }: InputFormProps) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit', // Validate only on submit
    defaultValues: {
      blueTeamName: '',
      redTeamName: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
  } = form;

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    submit(data);
    reset(); // Reset form fields after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
        {isSubmitted && (errors.blueTeamName?.message || errors.redTeamName?.message) ? (
          <FormMessage className="mb-4">
            {errors.blueTeamName?.message || errors.redTeamName?.message}
          </FormMessage>
        ) : null}
        <div className="flex flex-col gap-6">
          <FormField
            control={control}
            name="blueTeamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-blue">
                  <span className="h-2 w-2 bg-blue"></span>
                  Équipe Bleue
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="redTeamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-red">
                  <span className="h-2 w-2 bg-red"></span>
                  Équipe Rouge
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          size={'lg'}
          className="mt-6 disabled:border disabled:bg-white disabled:bg-opacity-10 disabled:font-normal disabled:text-white disabled:text-opacity-30"
          type="submit"
        >
          Créer une chambre
        </Button>
      </form>
    </Form>
  );
}
