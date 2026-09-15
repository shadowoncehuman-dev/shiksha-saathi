import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EXAM_YEAR, EXAM_DATE, EXAM_CENTER, EXAM_GROUPS } from "@/lib/constants";

export type ExamConfig = {
  exam_year: number;
  exam_date: string;
  exam_center: string;
  group1_classes: string;
  group1_time: string;
  group2_classes: string;
  group2_time: string;
};

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  exam_year: EXAM_YEAR,
  exam_date: EXAM_DATE,
  exam_center: EXAM_CENTER,
  group1_classes: EXAM_GROUPS[0].classes.join(","),
  group1_time: EXAM_GROUPS[0].duration,
  group2_classes: EXAM_GROUPS[1].classes.join(","),
  group2_time: EXAM_GROUPS[1].duration,
};

export function parseClasses(value: string): number[] {
  return value
    .split(",")
    .map((c) => parseInt(c.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

export function useExamConfig() {
  const [config, setConfig] = useState<ExamConfig>(DEFAULT_EXAM_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from("exam_config").select("*").eq("id", 1).maybeSingle();
      if (active && data) setConfig({ ...DEFAULT_EXAM_CONFIG, ...data });
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
}
