import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  phone: string;
  phone_href: string;
  whatsapp: string;
  telegram: string;
  work_hours: string;
};

const DEFAULTS: SiteSettings = {
  phone: "+7 (925) 035-23-22",
  phone_href: "tel:+79250352322",
  whatsapp: "https://wa.me/79250352322",
  telegram: "https://t.me/coffee_master",
  work_hours: "Отвечаю в течение 15 минут",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map: Record<string, unknown> = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return {
        phone: (map.phone as string) ?? DEFAULTS.phone,
        phone_href: (map.phone_href as string) ?? DEFAULTS.phone_href,
        whatsapp: (map.whatsapp as string) ?? DEFAULTS.whatsapp,
        telegram: (map.telegram as string) ?? DEFAULTS.telegram,
        work_hours: (map.work_hours as string) ?? DEFAULTS.work_hours,
      };
    },
    staleTime: 60_000,
  });
}
