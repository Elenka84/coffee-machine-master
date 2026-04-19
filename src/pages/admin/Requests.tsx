import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Status = "new" | "in_progress" | "done" | "cancelled";

const STATUS_LABEL: Record<Status, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Выполнена",
  cancelled: "Отменена",
};

const Requests = () => {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Статус обновлён");
      qc.invalidateQueries({ queryKey: ["admin-requests"] });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    const { error } = await supabase.from("requests").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Удалено");
      qc.invalidateQueries({ queryKey: ["admin-requests"] });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-coffee-dark">Заявки</h1>
      <div className="bg-background rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Марка</TableHead>
              <TableHead>Проблема</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Заявок пока нет</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm whitespace-nowrap">{new Date(r.created_at).toLocaleString("ru-RU")}</TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell><a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></TableCell>
                <TableCell>{r.brand || <Badge variant="outline">—</Badge>}</TableCell>
                <TableCell className="max-w-xs truncate" title={r.problem ?? ""}>{r.problem || "—"}</TableCell>
                <TableCell>
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as Status)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
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

export default Requests;
