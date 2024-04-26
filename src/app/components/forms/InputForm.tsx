import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";

const FormSchema = z.object({
  blueTeam: z.string().min(2, {
    message: "Le nom de l'équipe bleue doit comporter au moins 2 caractères",
  }),
  redTeam: z.string().min(2, {
    message: "Le nom de l'équipe rouge doit comporter au moins 2 caractères",
  }),
});

export interface InputFormProps {
  submit: (data: z.infer<typeof FormSchema>) => void;
}

export function InputForm({ submit }: InputFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      blueTeam: "",
      redTeam: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="blueTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>blueTeam</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="redTeam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>redTeam</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
