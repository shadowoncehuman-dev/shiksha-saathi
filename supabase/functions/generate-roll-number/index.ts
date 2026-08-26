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

    // Server-side gate: registration must be open and not cancelled/rescheduled
    const { data: settings } = await supabase
      .from("site_settings")
      .select("registration_status, exam_notice_type")
      .eq("id", 1)
      .maybeSingle();

    const blockedNotice = ["cancelled", "rescheduled"].includes(
      (settings?.exam_notice_type || "info").toLowerCase(),
    );
    if (settings?.registration_status !== "Open" || blockedNotice) {
      return new Response(
        JSON.stringify({ error: "Registration is currently closed." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }



    // Get all existing roll numbers for this class to find gaps
    const prefix = student_class.toString();
    const { data: existingRegs } = await supabase
      .from("registrations")
      .select("roll_number")
      .like("roll_number", `${prefix}%`);

    const usedNumbers = new Set<number>();
    if (existingRegs) {
      for (const reg of existingRegs) {
        const num = parseInt(reg.roll_number.slice(prefix.length));
        if (!isNaN(num)) usedNumbers.add(num);
      }
    }

    // Find the first available number (fill gaps)
    let newNumber = 1;
    while (usedNumbers.has(newNumber)) {
      newNumber++;
    }

    // Update the counter to track the highest used number
    const maxUsed = Math.max(newNumber, ...Array.from(usedNumbers));
    await supabase
      .from("roll_counters")
      .update({ last_number: maxUsed })
      .eq("class", student_class);

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
