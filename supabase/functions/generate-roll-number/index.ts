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

    // Find the smallest available roll number for this class
    const { data: existingRolls, error: rollError } = await supabase
      .from("registrations")
      .select("roll_number")
      .ilike("roll_number", `${student_class}%`)
      .order("roll_number");

    if (rollError) {
      return new Response(JSON.stringify({ error: "Failed to check existing roll numbers" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract numbers from existing roll numbers
    const usedNumbers = new Set<number>();
    existingRolls?.forEach((row: any) => {
      const num = parseInt(row.roll_number.substring(1));
      if (!isNaN(num)) usedNumbers.add(num);
    });

    // Find the smallest available number
    let rollNumber = 1;
    while (usedNumbers.has(rollNumber)) {
      rollNumber++;
    }

    const roll_number = `${student_class}${String(rollNumber).padStart(3, "0")}`;

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
