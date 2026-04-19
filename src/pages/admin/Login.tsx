import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Coffee } from "lucide-react";

const Login = () => {
  const { signIn, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/x-admin/dashboard", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // accept "admin@0802" alias
    const finalEmail = email.includes("@") && !email.endsWith(".local") && email === "admin@0802" ? "admin@0802.local" : email;
    const { error } = await signIn(finalEmail, password);
    setSubmitting(false);
    if (error) toast.error("Неверный логин или пароль");
    else toast.success("Вход выполнен");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <Coffee className="h-6 w-6 text-coffee-dark" />
          <span className="font-display font-semibold text-coffee-dark">Админка</span>
        </div>
        <h1 className="font-display text-2xl font-semibold text-coffee-dark mb-6">Вход</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Логин</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@0802" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Вход…" : "Войти"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
