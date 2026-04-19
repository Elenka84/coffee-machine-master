import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

type Form = { id?: string; title: string; description: string; price_from: string; price_to: string; sort: number };
const empty: Form = { title: "", description: "", price_from: "", price_to: "", sort: 0 };

const Services = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort");
      if (error) throw error;
      return data;
    },
  });

  const openEdit = (r?: typeof rows[number]) => {
    setForm(r
      ? { id: r.id, title: r.title, description: r.description ?? "", price_from: r.price_from?.toString() ?? "", price_to: r.price_to?.toString() ?? "", sort: r.sort }
      : empty);
    setOpen(true);
  };

  const save = async () => {
    if (!form.title) return toast.error("Введите название");
    const payload = {
      title: form.title,
      description: form.description || null,
      price_from: form.price_from ? Number(form.price_from) : null,
      price_to: form.price_to ? Number(form.price_to) : null,
      sort: form.sort,
    };
    const { error } = form.id
      ? await supabase.from("services").update(payload).eq("id", form.id)
      : await supabase.from("services").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Сохранено"); setOpen(false); qc.invalidateQueries({ queryKey: ["admin-services"] }); qc.invalidateQueries({ queryKey: ["public-services"] }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["admin-services"] }); qc.invalidateQueries({ queryKey: ["public-services"] }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-coffee-dark">Услуги и цены</h1>
        <Button onClick={() => openEdit()}><Plus className="h-4 w-4" />Добавить</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Изменить" : "Новая"} услуга</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Название</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Описание</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Цена от, ₽</Label><Input type="number" value={form.price_from} onChange={(e) => setForm({ ...form, price_from: e.target.value })} /></div>
              <div><Label>Цена до, ₽</Label><Input type="number" value={form.price_to} onChange={(e) => setForm({ ...form, price_to: e.target.value })} /></div>
              <div><Label>Сортировка</Label><Input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} /></div>
            </div>
            <Button onClick={save}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-background rounded-xl border border-border">
        <Table>
          <TableHeader><TableRow><TableHead>Название</TableHead><TableHead>Цена</TableHead><TableHead>Сорт.</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.title}{r.description && <div className="text-xs text-muted-foreground">{r.description}</div>}</TableCell>
                <TableCell>{r.price_from ? `от ${Number(r.price_from).toLocaleString("ru-RU")} ₽` : "—"}{r.price_to ? ` · до ${Number(r.price_to).toLocaleString("ru-RU")} ₽` : ""}</TableCell>
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

export default Services;
