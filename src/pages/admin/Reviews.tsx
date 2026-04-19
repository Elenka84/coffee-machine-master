import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

type Form = { id?: string; author: string; text: string; rating: number; published: boolean; sort: number };
const empty: Form = { author: "", text: "", rating: 5, published: true, sort: 0 };

const Reviews = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("sort", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const openEdit = (r?: typeof rows[number]) => {
    setForm(r ? { id: r.id, author: r.author, text: r.text, rating: r.rating, published: r.published, sort: r.sort } : empty);
    setOpen(true);
  };

  const save = async () => {
    if (!form.author || !form.text) return toast.error("Заполните поля");
    const payload = { author: form.author, text: form.text, rating: form.rating, published: form.published, sort: form.sort };
    const { error } = form.id
      ? await supabase.from("reviews").update(payload).eq("id", form.id)
      : await supabase.from("reviews").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Сохранено"); setOpen(false); qc.invalidateQueries({ queryKey: ["admin-reviews"] }); qc.invalidateQueries({ queryKey: ["public-reviews"] }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { qc.invalidateQueries({ queryKey: ["admin-reviews"] }); qc.invalidateQueries({ queryKey: ["public-reviews"] }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-coffee-dark">Отзывы</h1>
        <Button onClick={() => openEdit()}><Plus className="h-4 w-4" />Добавить</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form.id ? "Изменить" : "Новый"} отзыв</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Автор</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            <div><Label>Текст</Label><Textarea rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Рейтинг (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
              <div><Label>Сортировка</Label><Input type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} /></div>
            </div>
            <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><Label>Опубликован</Label></div>
            <Button onClick={save}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-background rounded-xl border border-border">
        <Table>
          <TableHeader><TableRow><TableHead>Автор</TableHead><TableHead>Текст</TableHead><TableHead>★</TableHead><TableHead>Опубл.</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.author}</TableCell>
                <TableCell className="max-w-md truncate" title={r.text}>{r.text}</TableCell>
                <TableCell>{r.rating}</TableCell>
                <TableCell>{r.published ? "Да" : "Нет"}</TableCell>
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

export default Reviews;
