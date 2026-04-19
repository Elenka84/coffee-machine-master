import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type RepairForm = {
  client_name: string;
  client_phone: string;
  machine_brand: string;
  machine_model: string;
  fault_reason: string;
  parts_cost: string;
  work_cost: string;
  notes: string;
  repaired_at: string;
};

const empty: RepairForm = {
  client_name: "", client_phone: "", machine_brand: "", machine_model: "",
  fault_reason: "", parts_cost: "0", work_cost: "0", notes: "",
  repaired_at: new Date().toISOString().slice(0, 10),
};

const Repairs = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<RepairForm>(empty);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-repairs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("repairs").select("*").order("repaired_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = async () => {
    if (!form.client_name || !form.client_phone || !form.machine_brand || !form.fault_reason) {
      toast.error("Заполните обязательные поля");
      return;
    }
    const { error } = await supabase.from("repairs").insert({
      client_name: form.client_name,
      client_phone: form.client_phone,
      machine_brand: form.machine_brand,
      machine_model: form.machine_model || null,
      fault_reason: form.fault_reason,
      parts_cost: Number(form.parts_cost) || 0,
      work_cost: Number(form.work_cost) || 0,
      notes: form.notes || null,
      repaired_at: form.repaired_at,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Ремонт добавлен");
      setForm(empty);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-repairs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return;
    const { error } = await supabase.from("repairs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["admin-repairs"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-coffee-dark">База ремонтов</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4" />Добавить</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Новый ремонт</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Клиент *</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
                <div><Label>Телефон *</Label><Input value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} /></div>
                <div><Label>Марка *</Label><Input value={form.machine_brand} onChange={(e) => setForm({ ...form, machine_brand: e.target.value })} /></div>
                <div><Label>Модель</Label><Input value={form.machine_model} onChange={(e) => setForm({ ...form, machine_model: e.target.value })} /></div>
              </div>
              <div><Label>Причина поломки *</Label><Input value={form.fault_reason} onChange={(e) => setForm({ ...form, fault_reason: e.target.value })} placeholder="напр. Замена помпы" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Запчасти, ₽</Label><Input type="number" value={form.parts_cost} onChange={(e) => setForm({ ...form, parts_cost: e.target.value })} /></div>
                <div><Label>Работа, ₽</Label><Input type="number" value={form.work_cost} onChange={(e) => setForm({ ...form, work_cost: e.target.value })} /></div>
                <div><Label>Дата</Label><Input type="date" value={form.repaired_at} onChange={(e) => setForm({ ...form, repaired_at: e.target.value })} /></div>
              </div>
              <div><Label>Заметки</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={save}>Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead><TableHead>Клиент</TableHead><TableHead>Машина</TableHead>
              <TableHead>Причина</TableHead><TableHead>Сумма</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Записей нет</TableCell></TableRow>}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{new Date(r.repaired_at).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell><div className="font-medium">{r.client_name}</div><div className="text-xs text-muted-foreground">{r.client_phone}</div></TableCell>
                <TableCell>{r.machine_brand}{r.machine_model ? ` · ${r.machine_model}` : ""}</TableCell>
                <TableCell>{r.fault_reason}</TableCell>
                <TableCell className="font-medium">{Number(r.total).toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Repairs;
