import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { student_class } = await req.json();

    if (!student_class || student_class < 6 || student_class > 12) {
      return new Response(JSON.stringify({ error: "Invalid class" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Atomically increment the counter
    const { data, error } = await supabase
      .from("roll_counters")
      .select("last_number")
      .eq("class", student_class)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Counter not found" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newNumber = data.last_number + 1;
    const { error: updateError } = await supabase
      .from("roll_counters")
      .update({ last_number: newNumber })
      .eq("class", student_class)
      .eq("last_number", data.last_number); // Optimistic lock

    if (updateError) {
      return new Response(JSON.stringify({ error: "Failed to update counter" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roll_number = `${student_class}${String(newNumber).padStart(3, "0")}`;

    return new Response(JSON.stringify({ roll_number }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
