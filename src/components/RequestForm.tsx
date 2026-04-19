import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(80),
  phone: z.string().trim().min(6, "Введите телефон").max(30).regex(/^[\d\s+()\-]+$/, "Только цифры и + ( ) -"),
  brand: z.string().trim().max(60).optional().or(z.literal("")),
  problem: z.string().trim().max(600).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, "Необходимо согласие на обработку персональных данных"),
});

type FormValues = z.infer<typeof schema>;

export const RequestForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", brand: "", problem: "", consent: false },
  });

  const consent = form.watch("consent");

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("requests").insert({
      name: values.name,
      phone: values.phone,
      brand: values.brand || null,
      problem: values.problem || null,
    });
    if (error) {
      toast.error("Не удалось отправить заявку", { description: error.message });
      return;
    }
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

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                </FormControl>
                <FormLabel className="!mt-0 text-sm font-normal leading-relaxed text-foreground cursor-pointer">
                  Я согласен(на) с{" "}
                  <a href="#privacy" className="underline underline-offset-4 text-coffee-dark hover:text-coffee-medium">
                    политикой конфиденциальности
                  </a>{" "}
                  и обработкой моих персональных данных (имя и телефон) для связи по заявке.
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={!consent} className="w-full h-12 text-base">
          Оставить заявку
        </Button>
      </form>
    </Form>
  );
};
