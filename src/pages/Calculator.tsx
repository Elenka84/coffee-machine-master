import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  Coffee,
  Phone,
  ArrowLeft,
  Calculator as CalcIcon,
  Clock,
  Gift,
  CheckCircle2,
  Wrench,
  Power,
  Droplets,
  Flame,
  Waves,
  XCircle,
  AlertTriangle,
  Gauge,
  Sparkles,
  Cog,
  Settings as SettingsIcon,
} from "lucide-react";

type Option = { id: string; label: string; min: number; max: number; icon: React.ComponentType<any> };

const FAULTS: Option[] = [
  { id: "no_power", label: "Не включается", min: 1500, max: 4500, icon: Power },
  { id: "no_water", label: "Не подает воду", min: 2000, max: 5000, icon: Droplets },
  { id: "no_heat", label: "Не греет", min: 2500, max: 6000, icon: Flame },
  { id: "leak", label: "Течет", min: 1500, max: 4500, icon: Waves },
  { id: "grinder", label: "Не мелет кофе", min: 2000, max: 5500, icon: Coffee },
  { id: "no_brew", label: "Не варит кофе", min: 2500, max: 6000, icon: XCircle },
  { id: "error", label: "Выдает ошибку", min: 1500, max: 4000, icon: AlertTriangle },
  { id: "weak", label: "Плохо работает", min: 1500, max: 4500, icon: Gauge },
];

const EXTRAS: Option[] = [
  { id: "descale", label: "Декальцинация", min: 1500, max: 2500, icon: Sparkles },
  { id: "deep_clean", label: "Полная чистка от кофейных масел", min: 2500, max: 4500, icon: Sparkles },
  { id: "brew_unit", label: "Обслуживание заварочного блока", min: 1500, max: 3500, icon: Cog },
  { id: "seals", label: "Замена уплотнителей", min: 1000, max: 2500, icon: SettingsIcon },
  { id: "firmware", label: "Сброс/обновление прошивки", min: 1000, max: 2000, icon: SettingsIcon },
];

const DIAGNOSTIC = { min: 1000, max: 1500 };

const fmt = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

const Calculator = () => {
  const { data: settings } = useSiteSettings();
  const PHONE = settings?.phone ?? "+7 (925) 035-23-22";
  const PHONE_HREF = settings?.phone_href ?? "tel:+79250352322";

  const [type, setType] = useState<"auto" | "builtin">("auto");
  const [diagFree, setDiagFree] = useState(true);
  const [faults, setFaults] = useState<Set<string>>(new Set());
  const [extras, setExtras] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  const typeMult = type === "builtin" ? 1.15 : 1;

  const calc = useMemo(() => {
    const sum = (ids: Set<string>, list: Option[]) =>
      list
        .filter((o) => ids.has(o.id))
        .reduce(
          (acc, o) => ({ min: acc.min + o.min, max: acc.max + o.max }),
          { min: 0, max: 0 },
        );

    const repair = sum(faults, FAULTS);
    const extra = sum(extras, EXTRAS);
    const hasRepair = faults.size > 0;
    const diag = hasRepair && diagFree ? { min: 0, max: 0 } : { min: DIAGNOSTIC.min, max: DIAGNOSTIC.max };

    const min = Math.round((repair.min + extra.min + diag.min) * typeMult);
    const max = Math.round((repair.max + extra.max + diag.max) * typeMult);

    return {
      diag,
      repair: { min: Math.round(repair.min * typeMult), max: Math.round(repair.max * typeMult) },
      extra: { min: Math.round(extra.min * typeMult), max: Math.round(extra.max * typeMult) },
      total: { min, max },
    };
  }, [faults, extras, diagFree, typeMult]);

  const reset = () => {
    setFaults(new Set());
    setExtras(new Set());
    setDiagFree(true);
    setType("auto");
  };

  const example = () => {
    setFaults(new Set(["no_water", "leak"]));
    setExtras(new Set(["descale"]));
    setDiagFree(true);
    setType("auto");
  };

  const renderItem = (o: Option, set: Set<string>, setter: (s: Set<string>) => void) => {
    const checked = set.has(o.id);
    const Icon = o.icon;
    return (
      <label
        key={o.id}
        className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-all hover:-translate-y-0.5 ${
          checked
            ? "border-coffee-medium bg-cream shadow-card"
            : "border-border bg-card hover:border-coffee-medium/40"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={() => toggle(set, o.id, setter)}
          />
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              checked ? "border-coffee-medium bg-coffee-medium" : "border-border bg-background"
            }`}
          >
            {checked && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
          </span>
          <Icon className="h-4 w-4 text-coffee-medium shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-medium text-foreground truncate">{o.label}</span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
          {fmt(Math.round(o.min * typeMult))}–{fmt(Math.round(o.max * typeMult))}
        </span>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-coffee-dark" strokeWidth={1.5} />
            <span className="font-display font-semibold tracking-tight text-coffee-dark">Мастер кофе</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-coffee-medium transition-colors">
              <Phone className="h-4 w-4" />{PHONE}
            </a>
            <ThemeToggle />
            <Button asChild size="sm" className="inline-flex shadow-card">
              <Link to="/"><ArrowLeft className="h-4 w-4" />На главную</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-hero">
        <div className="container py-10 md:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium text-coffee-medium mb-4 border border-border/60">
              <CalcIcon className="h-3.5 w-3.5" /> Калькулятор
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-coffee-dark leading-[1.05]">
              Предварительная оценка ремонта
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Без «шок-сумм»: показываем диапазон цены и логичную разбивку. Точная стоимость подтверждается после диагностики.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> 3–5 мин на расчет
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                от–до вместо одной цифры
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <Gift className="h-3.5 w-3.5" /> диагностика бесплатно при ремонте
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-coffee-dark mb-4">1) Параметры заказа</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Тип кофемашины</label>
                  <div className="grid grid-cols-2 rounded-xl border border-border bg-background p-1">
                    {([["auto", "Автоматическая"], ["builtin", "Встраиваемая"]] as const).map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setType(v)}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                          type === v ? "bg-cream text-coffee-dark shadow-card" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Диагностика</label>
                  <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-coffee-medium"
                      checked={diagFree}
                      onChange={(e) => setDiagFree(e.target.checked)}
                    />
                    <div>
                      <div className="text-sm font-semibold text-coffee-dark">Бесплатно при согласии на ремонт</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Если выбраны работы по ремонту — диагностика не добавляется к итогу.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-coffee-dark mb-1">2) Частые поломки</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Примерный диапазон стоимости работ без учета запчастей.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {FAULTS.map((o) => renderItem(o, faults, setFaults))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-xl font-semibold text-coffee-dark mb-4">3) Дополнительные работы</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {EXTRAS.map((o) => renderItem(o, extras, setExtras))}
              </div>
            </Card>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <Card className="p-4 sm:p-6 bg-gradient-hero border-coffee-medium/30">
              <h2 className="font-display text-xl font-semibold text-coffee-dark mb-1">Итог</h2>
              <p className="text-xs text-muted-foreground mb-4">Предварительная оценка</p>
              <div className="text-2xl sm:text-3xl font-display font-bold text-coffee-dark tabular-nums break-words">
                {calc.total.min === 0 && calc.total.max === 0
                  ? "0 ₽"
                  : `${fmt(calc.total.min)} – ${fmt(calc.total.max)}`}
              </div>
              {calc.total.min === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Выберите поломки и работы — появится диапазон стоимости.
                </p>
              )}

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Диагностика</span>
                  <span className="tabular-nums">{fmt(calc.diag.min)}–{fmt(calc.diag.max)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ремонт по поломкам</span>
                  <span className="tabular-nums">{fmt(calc.repair.min)}–{fmt(calc.repair.max)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дополнительные работы</span>
                  <span className="tabular-nums">{fmt(calc.extra.min)}–{fmt(calc.extra.max)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <span>Итого</span>
                  <span className="tabular-nums text-coffee-dark">{fmt(calc.total.min)}–{fmt(calc.total.max)}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild className="flex-1">
                  <Link to="/#request"><Wrench className="h-4 w-4" />Оставить заявку</Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <a href={PHONE_HREF} aria-label="Позвонить"><Phone className="h-4 w-4" /></a>
                </Button>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={reset} className="flex-1">Сбросить</Button>
                <Button variant="outline" size="sm" onClick={example} className="flex-1">Пример</Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Цены ориентировочные, точная стоимость зависит от бренда, модели и наличия запчастей.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
