import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, Wrench, MessageSquare, Coffee, Tag, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const items = [
  { to: "/x-admin/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { to: "/x-admin/requests", label: "Заявки", icon: Inbox },
  { to: "/x-admin/repairs", label: "Ремонты", icon: Wrench },
  { to: "/x-admin/reviews", label: "Отзывы", icon: MessageSquare },
  { to: "/x-admin/machines", label: "Кофемашины", icon: Coffee },
  { to: "/x-admin/services", label: "Услуги", icon: Tag },
  { to: "/x-admin/settings", label: "Настройки", icon: Settings },
];

export const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut();
    navigate("/x-admin", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
          <Coffee className="h-5 w-5 text-coffee-dark" strokeWidth={1.5} />
          <span className="font-display font-semibold text-coffee-dark">Админка</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-coffee-dark text-primary-foreground" : "text-foreground hover:bg-muted",
                )
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="outline" className="w-full" onClick={onLogout}>
            <LogOut className="h-4 w-4" />Выйти
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
