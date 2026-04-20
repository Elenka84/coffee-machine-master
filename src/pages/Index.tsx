import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RequestForm } from "@/components/RequestForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useReveal } from "@/hooks/use-reveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Phone,
  Wrench,
  Coffee,
  Droplets,
  Thermometer,
  Settings,
  AlertCircle,
  AlertTriangle,
  Cog,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Clock,
  HandCoins,
  Star,
  ArrowRight,
  Gift,
  MapPin,
  Power,
  Flame,
  Waves,
  XCircle,
  Gauge,
  FileText,
  Calculator as CalcIcon,
} from "lucide-react";

// Defaults — overridden by site_settings from DB
const DEFAULT_PHONE = "+7 (925) 035-23-22";
const DEFAULT_PHONE_HREF = "tel:+79250352322";
const DEFAULT_WHATSAPP = "https://wa.me/79250352322";
const DEFAULT_TELEGRAM = "https://t.me/coffee_master";

const services = [
  { icon: Wrench, title: "Диагностика кофемашин" },
  { icon: Cog, title: "Ремонт любой сложности" },
  { icon: Droplets, title: "Замена помпы" },
  { icon: Thermometer, title: "Замена термоблока" },
  { icon: Coffee, title: "Ремонт кофемолки" },
  { icon: Droplets, title: "Устранение протечек" },
  { icon: Sparkles, title: "Чистка и обслуживание" },
  { icon: Settings, title: "Ремонт заварочного блока" },
  { icon: AlertCircle, title: "Устранение ошибок" },
];

const faults = [
  { icon: Power, label: "Не включается" },
  { icon: Droplets, label: "Не подает воду" },
  { icon: Flame, label: "Не греет" },
  { icon: Waves, label: "Течет" },
  { icon: Coffee, label: "Не мелет кофе" },
  { icon: XCircle, label: "Не варит кофе" },
  { icon: AlertTriangle, label: "Выдает ошибку" },
  { icon: Gauge, label: "Плохо работает" },
];

const advantages = [
  { icon: HandCoins, title: "Частный мастер без переплат", text: "Работаю напрямую, без посредников и наценок сервиса." },
  { icon: BadgeCheck, title: "Популярные бренды", text: "Опыт работы со всеми основными производителями." },
  { icon: Cog, title: "Ремонт любой сложности", text: "От замены уплотнителей до восстановления плат." },
  { icon: ShieldCheck, title: "Честные условия", text: "Никаких скрытых платежей и навязанных услуг." },
  { icon: CheckCircle2, title: "Гарантия на запчасти", text: "На замененные комплектующие предоставляется гарантия." },
  { icon: Clock, title: "Быстрая связь", text: "Отвечаю в мессенджерах и беру в работу день в день." },
];

const FALLBACK_BRANDS = ["Saeco", "De'Longhi", "Philips", "Bosch", "Jura", "Miele", "Siemens", "Melitta", "Electrolux", "Bork", "Breville"];

const steps = [
  { n: "01", title: "Заявка или звонок", text: "Опишите проблему — подскажу предварительно." },
  { n: "02", title: "Диагностика", text: "На дому или в мастерской — определяю причину." },
  { n: "03", title: "Согласование стоимости", text: "Озвучиваю цену и сроки до начала работ." },
  { n: "04", title: "Ремонт", text: "Выполняю ремонт с гарантией на запчасти." },
];

const FALLBACK_REVIEWS = [
  { name: "Алексей", machine: "Philips 3200", text: "Быстро отремонтировали кофемашину. Перестала подавать воду — поменяли помпу за день. Работает как новая." },
  { name: "Марина", machine: "De'Longhi Magnifica", text: "Устранили протечку, заменили уплотнители. Цена была названа сразу после диагностики, никаких сюрпризов." },
  { name: "Игорь", machine: "Saeco Xelsis", text: "Понравились честные условия и прозрачная цена. Мастер всё показал и объяснил, дал гарантию на запчасти." },
  { name: "Ольга", machine: "Jura E8", text: "Машина выдавала ошибку — починили в мастерской за два дня. Спасибо за оперативность и аккуратность." },
];

const Index = () => {
  const { data: settings } = useSiteSettings();
  const PHONE = settings?.phone ?? DEFAULT_PHONE;
  const PHONE_HREF = settings?.phone_href ?? DEFAULT_PHONE_HREF;

  const { data: brandsData } = useQuery({
    queryKey: ["public-machines"],
    queryFn: async () => {
      const { data } = await supabase.from("coffee_machines").select("brand, model, sort").order("sort");
      return data ?? [];
    },
  });
  const brands = brandsData && brandsData.length > 0
    ? brandsData.map((b) => b.model ? `${b.brand} ${b.model}` : b.brand)
    : FALLBACK_BRANDS;

  const { data: reviewsData } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("author, text, sort").eq("published", true).order("sort");
      return data ?? [];
    },
  });
  const reviews = reviewsData && reviewsData.length > 0
    ? reviewsData.map((r) => ({ name: r.author, machine: "", text: r.text }))
    : FALLBACK_REVIEWS;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-coffee-dark" strokeWidth={1.5} />
            <span className="font-display font-semibold tracking-tight text-coffee-dark">Мастер кофе</span>
          </a>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-coffee-medium transition-colors">
              <Phone className="h-4 w-4" />{PHONE}
            </a>
            <ThemeToggle />
            <Button asChild size="sm" variant="outline" className="inline-flex">
              <Link to="/calculator"><CalcIcon className="h-4 w-4" /><span className="hidden sm:inline">Калькулятор</span></Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="#request">Оставить заявку</a>
            </Button>
            <Button asChild size="icon" variant="outline" className="sm:hidden">
              <a href={PHONE_HREF} aria-label="Позвонить"><Phone className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="container py-16 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium text-coffee-medium mb-6 border border-border/60 animate-fade-up">
              <Wrench className="h-3.5 w-3.5" /> Частный мастер · опыт работы
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-coffee-dark leading-[1.05] animate-fade-up">
              Ремонт кофемашин на дому и в мастерской
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>
              Saeco, De'Longhi, Philips, Bosch, Jura, Miele, Siemens, Melitta, Electrolux, Bork, Breville.
              Стоимость ремонта обсуждается после диагностики.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-cream border border-coffee-medium/30 px-5 py-3 shadow-card animate-fade-up" style={{ animationDelay: "150ms", animationFillMode: "backwards" }}>
              <Gift className="h-5 w-5 text-coffee-medium shrink-0" strokeWidth={1.75} />
              <span className="text-sm md:text-base font-semibold text-coffee-dark">
                При согласии на ремонт — диагностика бесплатна
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "220ms", animationFillMode: "backwards" }}>
              <Button asChild size="lg" className="h-12 px-6 hover:scale-[1.02] transition-transform">
                <a href={PHONE_HREF}><Phone className="h-4 w-4" />Позвонить</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-background hover:scale-[1.02] transition-transform">
                <a href="#request">Оставить заявку</a>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
              {[
                { icon: Cog, t: "Ремонт любой сложности" },
                { icon: ShieldCheck, t: "Честные условия" },
                { icon: BadgeCheck, t: "Гарантия на запчасти" },
                { icon: Coffee, t: "Популярные бренды" },
              ].map((it) => (
                <div key={it.t} className="flex items-start gap-3">
                  <it.icon className="h-5 w-5 text-coffee-medium shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-foreground">{it.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <RevealSection id="services" className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Услуги" title="Что я делаю" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.title} className="p-6 border-border/60 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cream">
                    <s.icon className="h-5 w-5 text-coffee-dark" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-foreground">{s.title}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Faults */}
      <RevealSection className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Неисправности" title="С чем обращаются чаще всего" />
          <div className="mt-12 grid gap-3 grid-cols-2 md:grid-cols-4">
            {faults.map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-lg bg-background px-4 py-4 border border-border/60 hover:border-coffee-medium transition-colors">
                <f.icon className="h-5 w-5 text-coffee-medium shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Terms */}
      <RevealSection className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-2xl bg-coffee-dark text-primary-foreground p-8 md:p-14 shadow-soft">
            <div className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-4">Условия работы</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-primary-foreground">
              Прозрачно, честно и без скрытых платежей
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "Сумма ремонта обсуждается после диагностики.",
                "Если клиент отказывается от ремонта — оплачивается диагностика.",
                "Если клиент соглашается с ремонтом — диагностика бесплатна.",
                "На замену комплектующих и запчастей предоставляется гарантия.",
                "На техническое обслуживание гарантия не распространяется.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground/80 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-primary-foreground/90 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      {/* Advantages */}
      <RevealSection className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Преимущества" title="Почему обращаются ко мне" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a) => (
              <div key={a.title} className="rounded-xl bg-background p-6 border border-border/60 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300">
                <a.icon className="h-6 w-6 text-coffee-medium" strokeWidth={1.5} />
                <h3 className="mt-4 font-display font-semibold text-coffee-dark">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Brands */}
      <RevealSection className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Бренды" title="С какими производителями работаю" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {brands.map((b) => (
              <div key={b} className="px-5 py-3 rounded-full border border-border bg-background text-coffee-dark font-medium hover:border-coffee-medium hover:scale-105 transition-all duration-200">
                {b}
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Process */}
      <RevealSection className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Как проходит работа" title="4 простых шага" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="rounded-xl bg-background p-6 border border-border/60 h-full hover:-translate-y-0.5 hover:shadow-card transition-all duration-300">
                  <div className="text-xs font-mono text-coffee-medium tracking-widest">{s.n}</div>
                  <h3 className="mt-3 font-display font-semibold text-coffee-dark">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-5 -translate-y-1/2 h-4 w-4 text-coffee-medium/40" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-coffee-dark text-primary-foreground px-6 py-3 shadow-soft">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
              <span className="font-semibold text-sm md:text-base">При согласии на ремонт диагностика бесплатна</span>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Reviews */}
      <RevealSection className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Отзывы" title="Что говорят клиенты" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <Card key={r.name} className="p-6 border-border/60 shadow-card hover:shadow-soft transition-shadow">
                <div className="flex gap-0.5 text-coffee-medium">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-foreground leading-relaxed">«{r.text}»</p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-baseline justify-between">
                  <span className="font-medium text-coffee-dark">{r.name}</span>
                  <span className="text-sm text-muted-foreground">{r.machine}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Form */}
      <RevealSection id="request" className="py-20 md:py-28 bg-cream">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <SectionHeader eyebrow="Заявка" title="Оставьте заявку — свяжусь с вами" centered />
            <div className="mt-10 rounded-2xl bg-background p-6 md:p-10 border border-border/60 shadow-soft">
              <RequestForm />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Contacts */}
      <RevealSection id="contacts" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader eyebrow="Контакты" title="Свяжитесь удобным способом" centered />
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              Работаю по городу и ближайшему району. Формат ремонта уточняется при обращении.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-coffee-medium">
              <Clock className="h-4 w-4" /> Отвечаю в течение 15 минут
            </div>
            <div className="mt-10 flex justify-center">
              <ContactCard href={PHONE_HREF} icon={Phone} label="Телефон" value={PHONE} />
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Privacy */}
      <RevealSection id="privacy" className="py-20 md:py-24 bg-cream">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-coffee-medium" strokeWidth={1.5} />
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-coffee-dark">Политика конфиденциальности</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Оставляя заявку на сайте, вы даёте согласие на обработку персональных данных
                в соответствии с настоящей политикой.
              </p>
              <p>
                <strong className="text-coffee-dark">Какие данные собираются:</strong> имя, номер телефона, а также добровольно
                указанные данные (марка кофемашины и описание проблемы).
              </p>
              <p>
                <strong className="text-coffee-dark">Цель обработки:</strong> связь с клиентом по заявке, согласование
                диагностики и ремонта кофемашины.
              </p>
              <p>
                <strong className="text-coffee-dark">Передача третьим лицам:</strong> данные не передаются третьим лицам и
                используются исключительно частным мастером для оказания услуг.
              </p>
              <p>
                <strong className="text-coffee-dark">Срок хранения:</strong> данные хранятся не дольше, чем необходимо для
                выполнения работ и связи с клиентом.
              </p>
              <p>
                <strong className="text-coffee-dark">Отзыв согласия:</strong> вы можете отозвать согласие на обработку
                персональных данных, связавшись по телефону{" "}
                <a href={PHONE_HREF} className="text-coffee-dark underline underline-offset-4 hover:text-coffee-medium">{PHONE}</a>.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 pb-24 md:pb-10">
        <div className="container flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-coffee-dark" strokeWidth={1.5} />
            <span className="font-display font-semibold text-coffee-dark">Мастер кофе</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> Работаю по городу и ближайшему району
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} · Частный мастер</p>
          <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-sm font-medium text-coffee-dark hover:text-coffee-medium">
            <Phone className="h-4 w-4" />{PHONE}
          </a>
        </div>
      </footer>

      {/* Mobile sticky call bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur p-3">
        <Button asChild size="lg" className="w-full h-12">
          <a href={PHONE_HREF}><Phone className="h-4 w-4" />Позвонить мастеру</a>
        </Button>
      </div>

    </div>
  );
};

const RevealSection = ({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useReveal<HTMLElement>();
  return (
    <section id={id} ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </section>
  );
};

const SectionHeader = ({ eyebrow, title, centered }: { eyebrow: string; title: string; centered?: boolean }) => (
  <div className={centered ? "text-center" : ""}>
    <div className="text-xs uppercase tracking-widest text-coffee-medium font-semibold">{eyebrow}</div>
    <h2 className="font-display mt-3 text-3xl md:text-4xl font-semibold text-coffee-dark leading-tight max-w-2xl">
      {title}
    </h2>
  </div>
);

const ContactCard = ({
  href, icon: Icon, label, value, external,
}: { href: string; icon: typeof Phone; label: string; value: string; external?: boolean }) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className="group rounded-xl border border-border/60 bg-background p-6 hover:border-coffee-medium hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
  >
    <Icon className="h-6 w-6 text-coffee-medium mx-auto" strokeWidth={1.5} />
    <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className="mt-1 font-medium text-coffee-dark">{value}</div>
  </a>
);

export default Index;
