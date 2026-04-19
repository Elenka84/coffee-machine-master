import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { Inbox, Wrench, TrendingUp, Wallet } from "lucide-react";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const since30 = new Date(Date.now() - 30 * 86400_000).toISOString();
      const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();

      const [r30, r7, repairs, requestsByDay] = await Promise.all([
        supabase.from("requests").select("id", { count: "exact", head: true }).gte("created_at", since30),
        supabase.from("requests").select("id", { count: "exact", head: true }).gte("created_at", since7),
        supabase.from("repairs").select("machine_brand, fault_reason, total, repaired_at"),
        supabase.from("requests").select("created_at").gte("created_at", since30),
      ]);

      const repairsData = repairs.data ?? [];
      const totalRepairs = repairsData.length;
      const totalRevenue = repairsData.reduce((s, r) => s + Number(r.total ?? 0), 0);
      const avgCheck = totalRepairs ? Math.round(totalRevenue / totalRepairs) : 0;

      const brandCount: Record<string, number> = {};
      const faultCount: Record<string, number> = {};
      repairsData.forEach((r) => {
        brandCount[r.machine_brand] = (brandCount[r.machine_brand] ?? 0) + 1;
        faultCount[r.fault_reason] = (faultCount[r.fault_reason] ?? 0) + 1;
      });

      const topBrands = Object.entries(brandCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
      const topFaults = Object.entries(faultCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

      const byDay: Record<string, number> = {};
      (requestsByDay.data ?? []).forEach((r) => {
        const d = new Date(r.created_at).toISOString().slice(5, 10);
        byDay[d] = (byDay[d] ?? 0) + 1;
      });
      const dayChart = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));

      return {
        requests30: r30.count ?? 0,
        requests7: r7.count ?? 0,
        totalRepairs,
        totalRevenue,
        avgCheck,
        topBrands,
        topFaults,
        dayChart,
      };
    },
  });

  const KPI = ({ icon: Icon, label, value }: { icon: typeof Inbox; label: string; value: string | number }) => (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-cream flex items-center justify-center">
          <Icon className="h-5 w-5 text-coffee-dark" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="font-display text-2xl font-semibold text-coffee-dark">{value}</div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-coffee-dark">Дашборд</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={Inbox} label="Заявок · 7 дней" value={stats?.requests7 ?? 0} />
        <KPI icon={TrendingUp} label="Заявок · 30 дней" value={stats?.requests30 ?? 0} />
        <KPI icon={Wrench} label="Выполнено ремонтов" value={stats?.totalRepairs ?? 0} />
        <KPI icon={Wallet} label="Средний чек, ₽" value={stats?.avgCheck ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display font-semibold text-coffee-dark mb-4">Топ-5 марок по поломкам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topBrands ?? []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-semibold text-coffee-dark mb-4">Топ причин поломок</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topFaults ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={140} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-display font-semibold text-coffee-dark mb-4">Заявки по дням (30 дней)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.dayChart ?? []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
