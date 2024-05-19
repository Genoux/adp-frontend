import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";

const FormSchema = z.object({
  blueTeamName: z.string().min(2, "Chaque équipe doit avoir un nom d'au moins 2 caractères"),
  redTeamName: z.string().min(2, "Chaque équipe doit avoir un nom d'au moins 2 caractères")
}).refine(data => data.blueTeamName !== data.redTeamName, {
  message: "Les deux équipes ne peuvent pas avoir le même nom",
  path: ["redTeamName"]
});
export interface InputFormProps {
  submit: (data: z.infer<typeof FormSchema>) => void;
}

export function InputForm({ submit }: InputFormProps) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',  // This line ensures validation on change
    defaultValues: {
      blueTeamName: "",
      redTeamName: "",
    },
  });

  const { handleSubmit, control, formState: { errors }, watch } = form;
  const blueTeamName = watch("blueTeamName");
  const redTeamName = watch("redTeamName");
  const errorMessage = errors.blueTeamName?.message || errors.redTeamName?.message;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col w-full">
        {errorMessage && <FormMessage className="mb-4">{errorMessage}</FormMessage>}
        <div className="flex flex-col gap-6">
          <FormField
            control={control}
            name="blueTeamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 items-center text-blue">
                  <span className="w-2 h-2 bg-blue"></span>
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
                <FormLabel className="flex gap-2 items-center text-red">
                  <span className="w-2 h-2 bg-red"></span>
                  Équipe Rouge
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button size={'lg'} className="mt-6 disabled:font-normal disabled:bg-white disabled:bg-opacity-10 disabled:text-opacity-30 disabled:border disabled:text-white"
          type="submit"
          disabled={!blueTeamName || !redTeamName}>Créer une chambre</Button>
      </form>
    </Form>
  );
}
