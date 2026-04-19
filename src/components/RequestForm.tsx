import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const schema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(80),
  phone: z.string().trim().min(6, "Введите телефон").max(30).regex(/^[\d\s+()\-]+$/, "Только цифры и + ( ) -"),
  brand: z.string().trim().max(60).optional().or(z.literal("")),
  problem: z.string().trim().max(600).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export const RequestForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", brand: "", problem: "" },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Заявка:", values);
    toast.success("Заявка отправлена", {
      description: "Свяжусь с вами в ближайшее время.",
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Ваше имя" className="h-12 bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+7 (___) ___-__-__" className="h-12 bg-background" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Марка кофемашины</FormLabel>
              <FormControl>
                <Input placeholder="Например, De'Longhi Magnifica" className="h-12 bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание проблемы</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Что случилось с кофемашиной?" className="bg-background" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full h-12 text-base">
          Оставить заявку
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </form>
    </Form>
  );
};
