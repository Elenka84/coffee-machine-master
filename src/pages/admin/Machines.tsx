import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

type Form = { id?: string; brand: string; model: string; sort: number };
const empty: Form = { brand: "", model: "", sort: 0 };

const Machines = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-machines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coffee_machines").select("*").order("sort");
      if (error) throw error;
      return data;
    },
  });

  const openEdit = (r?: typeof rows[number]) => {
    setForm(r ? { id: r.id, brand: r.brand, model: r.model ?? "", sort: r.sort } : empty);
    setOpen(true);
  };

  const save = async () => {
    if (!form.brand) return toast.error("Укажите бренд");
    const payload = { brand: form.brand, model: form.model || null, sort: form.sort };
    const { error } = form.id
      ? await supabase.from("coffee_machines").update(payload).eq("id", form.id)
      : await supabase.from("coffee_machines").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Сохранено"); setOpen(false); qc.invalidateQueries({ queryKey: ["admin-machines"] }); qc.invalidateQueries({ queryKey: ["public-machines"] }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить?")) return;
    const { error } = await supabase.from("coffee_machines").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["admin-machines"] }); qc.invalidateQueries({ queryKey: ["public-machines"] }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-coffee-dark">Кофемашины</h1>
        <Button onClick={() => openEdit()}><Plus className="h-4 w-4" />Добавить</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Изменить" : "Новая"} модель</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Бренд</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            <div><Label>Модель (необязательно)</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
            <div><Label>Сортировка</Label><Input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} /></div>
            <Button onClick={save}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-background rounded-xl border border-border">
        <Table>
          <TableHeader><TableRow><TableHead>Бренд</TableHead><TableHead>Модель</TableHead><TableHead>Сорт.</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.brand}</TableCell>
                <TableCell>{r.model || "—"}</TableCell>
                <TableCell>{r.sort}</TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Machines;
