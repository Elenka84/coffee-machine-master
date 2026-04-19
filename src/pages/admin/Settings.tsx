import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: "phone", label: "Телефон (отображаемый)", placeholder: "+7 (925) 035-23-22" },
  { key: "phone_href", label: "Телефон (ссылка tel:)", placeholder: "tel:+79250352322" },
  { key: "whatsapp", label: "Ссылка WhatsApp", placeholder: "https://wa.me/79250352322" },
  { key: "telegram", label: "Ссылка Telegram", placeholder: "https://t.me/..." },
  { key: "work_hours", label: "Часы работы / подпись", placeholder: "Отвечаю в течение 15 минут" },
];

const Settings = () => {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["site_settings_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const r of data ?? []) map[r.key] = String(r.value ?? "").replace(/^"|"$/g, "");
      return map;
    },
  });

  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => { if (data) setValues(data); }, [data]);

  const save = async () => {
    const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) toast.error(error.message);
    else { toast.success("Настройки сохранены"); qc.invalidateQueries({ queryKey: ["site_settings"] }); qc.invalidateQueries({ queryKey: ["site_settings_admin"] }); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-coffee-dark">Настройки</h1>
      <Card className="p-6 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label>{f.label}</Label>
            <Input
              placeholder={f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          </div>
        ))}
        <Button onClick={save}>Сохранить</Button>
      </Card>
    </div>
  );
};

export default Settings;
