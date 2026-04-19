import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RequestForm } from "@/components/RequestForm";
import {
  Phone,
  MessageCircle,
  Send,
  Wrench,
  Coffee,
  Droplets,
  Thermometer,
  Settings,
  AlertCircle,
  Cog,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Clock,
  HandCoins,
  Star,
  ArrowRight,
} from "lucide-react";

const PHONE = "+7 (999) 123-45-67";
const PHONE_HREF = "tel:+79991234567";
const WHATSAPP = "https://wa.me/79991234567";
const TELEGRAM = "https://t.me/coffee_master";

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
  "Не включается",
  "Не подает воду",
  "Не греет",
  "Течет",
  "Не мелет кофе",
  "Не варит кофе",
  "Выдает ошибку",
  "Плохо работает",
];

const advantages = [
  { icon: HandCoins, title: "Частный мастер без переплат", text: "Работаю напрямую, без посредников и наценок сервиса." },
  { icon: BadgeCheck, title: "Популярные бренды", text: "Опыт работы со всеми основными производителями." },
  { icon: Cog, title: "Ремонт любой сложности", text: "От замены уплотнителей до восстановления плат." },
  { icon: ShieldCheck, title: "Честные условия", text: "Никаких скрытых платежей и навязанных услуг." },
  { icon: CheckCircle2, title: "Гарантия на запчасти", text: "На замененные комплектующие предоставляется гарантия." },
  { icon: Clock, title: "Быстрая связь", text: "Отвечаю в мессенджерах и беру в работу день в день." },
];

const brands = ["Saeco", "De'Longhi", "Philips", "Bosch", "Jura", "Miele", "Siemens", "Melitta", "Electrolux", "Bork", "Breville"];

const steps = [
  { n: "01", title: "Заявка или звонок", text: "Опишите проблему — подскажу предварительно." },
  { n: "02", title: "Диагностика", text: "На дому или в мастерской — определяю причину." },
  { n: "03", title: "Согласование стоимости", text: "Озвучиваю цену и сроки до начала работ." },
  { n: "04", title: "Ремонт", text: "Выполняю ремонт с гарантией на запчасти." },
];

const reviews = [
  { name: "Алексей", machine: "Philips 3200", text: "Быстро отремонтировали кофемашину. Перестала подавать воду — поменяли помпу за день. Работает как новая." },
  { name: "Марина", machine: "De'Longhi Magnifica", text: "Устранили протечку, заменили уплотнители. Цена была названа сразу после диагностики, никаких сюрпризов." },
  { name: "Игорь", machine: "Saeco Xelsis", text: "Понравились честные условия и прозрачная цена. Мастер всё показал и объяснил, дал гарантию на запчасти." },
  { name: "Ольга", machine: "Jura E8", text: "Машина выдавала ошибку — починили в мастерской за два дня. Спасибо за оперативность и аккуратность." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-coffee-dark" strokeWidth={1.5} />
            <span className="font-semibold tracking-tight text-coffee-dark">Мастер кофе</span>
          </a>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-coffee-medium transition-colors">
              {PHONE}
            </a>
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
            <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium text-coffee-medium mb-6 border border-border/60">
              <span className="h-1.5 w-1.5 rounded-full bg-coffee-medium" /> Частный мастер · опыт работы
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-coffee-dark leading-[1.05]">
              Ремонт кофемашин на дому и в мастерской
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Saeco, De'Longhi, Philips, Bosch, Jura, Miele, Siemens, Melitta, Electrolux, Bork, Breville.
              Стоимость ремонта обсуждается после диагностики.
              <span className="block mt-2 text-coffee-dark font-medium">При согласии на ремонт — диагностика бесплатно.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <a href={PHONE_HREF}><Phone className="h-4 w-4" />Позвонить</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-background">
                <a href="#request">Оставить заявку</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-background">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" />WhatsApp</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 bg-background">
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"><Send className="h-4 w-4" />Telegram</a>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
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
      <section id="services" className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Услуги" title="Что я делаю" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.title} className="p-6 border-border/60 shadow-card hover:shadow-soft transition-shadow">
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
      </section>

      {/* Faults */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Неисправности" title="С чем обращаются чаще всего" />
          <div className="mt-12 grid gap-3 grid-cols-2 md:grid-cols-4">
            {faults.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-lg bg-background px-4 py-4 border border-border/60">
                <span className="h-2 w-2 rounded-full bg-coffee-medium shrink-0" />
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-4xl rounded-2xl bg-coffee-dark text-primary-foreground p-8 md:p-14 shadow-soft">
            <div className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-4">Условия работы</div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
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
      </section>

      {/* Advantages */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Преимущества" title="Почему обращаются ко мне" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a) => (
              <div key={a.title} className="rounded-xl bg-background p-6 border border-border/60">
                <a.icon className="h-6 w-6 text-coffee-medium" strokeWidth={1.5} />
                <h3 className="mt-4 font-semibold text-coffee-dark">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Бренды" title="С какими производителями работаю" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {brands.map((b) => (
              <div key={b} className="px-5 py-3 rounded-full border border-border bg-background text-coffee-dark font-medium hover:border-coffee-medium transition-colors">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container">
          <SectionHeader eyebrow="Как проходит работа" title="4 простых шага" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="rounded-xl bg-background p-6 border border-border/60 h-full">
                  <div className="text-xs font-mono text-coffee-medium tracking-widest">{s.n}</div>
                  <h3 className="mt-3 font-semibold text-coffee-dark">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-5 -translate-y-1/2 h-4 w-4 text-coffee-medium/40" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-coffee-dark font-medium">
            При согласии на ремонт диагностика бесплатна.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeader eyebrow="Отзывы" title="Что говорят клиенты" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <Card key={r.name} className="p-6 border-border/60 shadow-card">
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
      </section>

      {/* Form */}
      <section id="request" className="py-20 md:py-28 bg-cream">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <SectionHeader eyebrow="Заявка" title="Оставьте заявку — свяжусь с вами" centered />
            <div className="mt-10 rounded-2xl bg-background p-6 md:p-10 border border-border/60 shadow-soft">
              <RequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeader eyebrow="Контакты" title="Свяжитесь удобным способом" centered />
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              Работаю по городу и ближайшему району. Формат ремонта уточняется при обращении.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <ContactCard href={PHONE_HREF} icon={Phone} label="Телефон" value={PHONE} />
              <ContactCard href={WHATSAPP} icon={MessageCircle} label="WhatsApp" value="Написать в чат" external />
              <ContactCard href={TELEGRAM} icon={Send} label="Telegram" value="Написать в чат" external />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 pb-24 md:pb-10">
        <div className="container flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-coffee-dark" strokeWidth={1.5} />
            <span className="font-semibold text-coffee-dark">Мастер кофе</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} · Частный мастер по ремонту кофемашин</p>
          <a href={PHONE_HREF} className="text-sm font-medium text-coffee-dark hover:text-coffee-medium">{PHONE}</a>
        </div>
      </footer>

      {/* Mobile sticky call bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur p-3">
        <Button asChild size="lg" className="w-full h-12">
          <a href={PHONE_HREF}><Phone className="h-4 w-4" />Позвонить мастеру</a>
        </Button>
      </div>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed right-4 bottom-20 md:bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-coffee-dark text-primary-foreground shadow-soft hover:bg-coffee-medium transition-colors"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
      </a>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, centered }: { eyebrow: string; title: string; centered?: boolean }) => (
  <div className={centered ? "text-center" : ""}>
    <div className="text-xs uppercase tracking-widest text-coffee-medium font-medium">{eyebrow}</div>
    <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-coffee-dark leading-tight max-w-2xl">
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
    className="group rounded-xl border border-border/60 bg-background p-6 hover:border-coffee-medium hover:shadow-card transition-all"
  >
    <Icon className="h-6 w-6 text-coffee-medium mx-auto" strokeWidth={1.5} />
    <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className="mt-1 font-medium text-coffee-dark">{value}</div>
  </a>
);

export default Index;
