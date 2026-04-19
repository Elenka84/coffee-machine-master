// One-shot bootstrap: create admin user and assign 'admin' role.
// Safe to call multiple times (idempotent).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "admin@0802.local";
const ADMIN_PASSWORD = "19842022";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Find existing user
  const { data: list, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) return new Response(JSON.stringify({ error: listErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  let user = list.users.find((u) => u.email === ADMIN_EMAIL);

  if (!user) {
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (createErr) return new Response(JSON.stringify({ error: createErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    user = created.user!;
  }

  // Ensure admin role
  const { error: roleErr } = await admin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
  if (roleErr) return new Response(JSON.stringify({ error: roleErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  return new Response(
    JSON.stringify({ ok: true, user_id: user.id, email: ADMIN_EMAIL }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
