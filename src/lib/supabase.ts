import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Registration = {
  id?: string;
  roll_number: string;
  name: string;
  father_name: string;
  class: number;
  group: string;
  phone: string;
  village: string;
  created_at?: string;
};

export type Result = {
  id?: string;
  roll_number: string;
  subject1: number;
  subject2: number;
  subject3: number;
  subject4: number;
  total: number;
  percentage: number;
  grade: string;
  status: "PASS" | "FAIL";
};

export type SiteSettings = {
  registration_status: "Not Started" | "Open" | "Closed";
  result_status: "Not Declared" | "Available" | "Viewing Period Ended";
  result_publish_date: string | null;
  result_expiry_date: string | null;
  exam_notice: string | null;
  exam_notice_type: "info" | "warning" | "cancelled" | "rescheduled";
};
