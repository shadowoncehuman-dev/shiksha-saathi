import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, AlertTriangle, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { VILLAGES, getGroup, ORG_NAME, EXAM_YEAR } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import ExamNoticeBanner from "@/components/ExamNoticeBanner";
import RegistrationSuccess from "@/components/RegistrationSuccess";
import RegistrationFailed from "@/components/RegistrationFailed";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  father_name: z.string().trim().min(2, "Father's name must be at least 2 characters").max(100),
  student_class: z.string().min(1, "Please select a class"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  village: z.string().min(1, "Please select a village"),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [examNoticeType, setExamNoticeType] = useState<string>("info");
  const [examNotice, setExamNotice] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ rollNumber: string; name: string; studentClass: number; group: string } | null>(null);
  const [failedError, setFailedError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { tr } = useLang();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", father_name: "", student_class: "", phone: "", village: "" },
  });

  useEffect(() => {
    let cancelled = false;
    const applySettings = (data: any) => {
      if (cancelled) return;
      setStatus(data?.registration_status || "Not Started");
      setExamNotice(data?.exam_notice || null);
      setExamNoticeType(data?.exam_notice_type || "info");
    };
    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("registration_status, exam_notice, exam_notice_type")
          .eq("id", 1)
          .maybeSingle();
        // Fail closed: if we cannot read the flag, do not show the form
        if (error || !data) { if (!cancelled) setStatus("Not Started"); }
        else applySettings(data);
      } catch { if (!cancelled) setStatus("Not Started"); }
      if (!cancelled) setLoading(false);
    };
    fetchStatus();

    // Live sync: admin toggles propagate instantly without a page refresh
    const channel = supabase
      .channel("register-site-settings")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "site_settings", filter: "id=eq.1" }, (payload) => applySettings(payload.new))
      .subscribe();

    // Also re-check whenever the tab regains focus (covers missed realtime events)
    const onVisible = () => { if (document.visibilityState === "visible") fetchStatus(); };
    document.addEventListener("visibilitychange", onVisible);
    const interval = setInterval(fetchStatus, 60_000);

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, []);

  const checkDuplicate = async (name: string, fatherName: string, studentClass: string) => {
    if (!name || !fatherName || !studentClass) return;
    const { data } = await supabase
      .from("registrations")
      .select("id").eq("exam_year", EXAM_YEAR)
      .ilike("name", name.trim())
      .ilike("father_name", fatherName.trim())
      .eq("class", parseInt(studentClass))
      .limit(1);
    setDuplicateWarning(!!(data && data.length > 0));
  };

  const watchName = form.watch("name");
  const watchFather = form.watch("father_name");
  const watchClass = form.watch("student_class");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchName.length >= 2 && watchFather.length >= 2 && watchClass) {
        checkDuplicate(watchName, watchFather, watchClass);
      } else {
        setDuplicateWarning(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [watchName, watchFather, watchClass]);

  const onSubmit = async (values: FormData) => {
    setSubmitting(true);
    setFailedError(null);
    try {
      const { data: fresh } = await supabase.from("site_settings").select("registration_status").single();
      if ((fresh?.registration_status || "Not Started") !== "Open") {
        setStatus(fresh?.registration_status || "Not Started");
        throw new Error("Registration is currently closed. Please contact the examination centre.");
      }

      const studentClass = parseInt(values.student_class);
      const group = getGroup(studentClass);

      const { data: dupCheck } = await supabase
        .from("registrations")
        .select("id").eq("exam_year", EXAM_YEAR)
        .ilike("name", values.name.trim())
        .ilike("father_name", values.father_name.trim())
        .eq("class", studentClass)
        .limit(1);
      if (dupCheck && dupCheck.length > 0) {
        throw new Error(tr.invigilator?.duplicateBlocked || "This student is already registered. Duplicate registration is not allowed.");
      }

      const { data: phoneCheck } = await supabase
        .from("registrations")
        .select("id").eq("exam_year", EXAM_YEAR)
        .eq("phone", values.phone)
        .limit(3);
      if (phoneCheck && phoneCheck.length >= 3) {
        throw new Error(tr.invigilator?.phoneSpamWarning || "This phone number has been used for too many registrations.");
      }

      const { data: rollData, error: rollError } = await supabase.functions.invoke("generate-roll-number", { body: { student_class: studentClass } });
      if (rollError || !rollData?.roll_number) throw new Error(rollData?.error || "Registration is currently closed or the roll number could not be generated.");

      const { error: insertError } = await supabase.from("registrations").insert({
        roll_number: rollData.roll_number, name: values.name.trim(), father_name: values.father_name.trim(),
        class: studentClass, group: group.name, exam_year: EXAM_YEAR, phone: values.phone, village: values.village,
      });
      if (insertError) {
        if ((insertError as any).code === "42501" || /row-level security/i.test(insertError.message)) {
          throw new Error("Registration is currently closed by the administration.");
        }
        throw insertError;
      }


      sessionStorage.setItem("admit_card_data", JSON.stringify({
        roll_number: rollData.roll_number, name: values.name.trim(), father_name: values.father_name.trim(),
        class: studentClass, group: group.name, phone: values.phone, village: values.village, duration: group.duration,
      }));

      setSuccessData({
        rollNumber: rollData.roll_number,
        name: values.name.trim(),
        studentClass,
        group: group.name,
      });
    } catch (error: any) {
      setFailedError(error.message || "Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-[#6B4EFF]" size={36} />
        </div>
      </Layout>
    );
  }

  if (successData) return <Layout><RegistrationSuccess {...successData} /></Layout>;
  if (failedError) return <Layout><RegistrationFailed error={failedError} onRetry={() => setFailedError(null)} /></Layout>;

  const noticeBlocked = !!examNotice && (examNoticeType === "cancelled" || examNoticeType === "rescheduled");
  const statusBlocked = status !== "Open";

  if (noticeBlocked || statusBlocked) {
    const heading = noticeBlocked
      ? "Portal Restricted"
      : status === "Closed"
      ? "Registration Closed"
      : "Registration Not Started";
    const message = noticeBlocked
      ? examNotice
      : status === "Closed"
      ? "Registration for this examination cycle has been closed by the administration. Please contact your centre for assistance."
      : "Registration has not opened yet. Please check back soon for the announcement.";

    return (
      <Layout>
        <SEOHead title="Registration — BBDBASS" description="Registration status for the Dr. B.R. Ambedkar annual examination." path="/register" />
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="glass-strong rounded-[2.5rem] p-10 text-center max-w-md relative overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-destructive" size={32} />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-4">{heading}</h2>
            <p className="text-[#7A8C7C] font-sans leading-relaxed mb-8">{message}</p>
            <Button onClick={() => navigate("/")} className="btn-primary w-full">Return Home</Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Enrollment — BBDBASS" description="Register for the Dr. B.R. Ambedkar annual examination." path="/register" />
      
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Info */}
            <div className="lg:col-span-5 pt-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-[#6B4EFF]/20 text-[#6B4EFF] text-xs font-bold mb-6 tracking-widest uppercase">
                  <UserPlus size={14} /> 
                  <span>Candidate Enrollment</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-6">
                  Join the <span className="premium-gradient-text italic font-normal">Academic Vanguard</span>
                </h1>
                <p className="text-[#7A8C7C] font-sans text-lg mb-8 leading-relaxed">
                  Please provide accurate student information. Your admit card will be generated automatically upon successful enrollment.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Instant Admit Card Generation",
                    "Official Roll Number Assignment",
                    "Secured Data Privacy",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[#1A2E1F] dark:text-[#E8EDE3] font-sans font-medium">
                      <ShieldCheck className="text-[#6B4EFF]" size={20} />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <motion.div
                className="glass-strong rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              >
                {duplicateWarning && (
                  <motion.div
                    className="flex items-start gap-3 p-4 mb-6 bg-destructive/5 rounded-2xl border border-destructive/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-destructive font-medium">Potential duplicate record detected. Please verify details.</p>
                  </motion.div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#7A8C7C]">Full Name</FormLabel>
                          <FormControl><Input placeholder="Student Name" className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-white/40" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="father_name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#7A8C7C]">Father's Name</FormLabel>
                          <FormControl><Input placeholder="Guardian Name" className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-white/40" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="student_class" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#7A8C7C]">Academic Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-white/40"><SelectValue placeholder="Select Class" /></SelectTrigger></FormControl>
                            <SelectContent className="rounded-2xl border-white/20">
                              {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                                <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#7A8C7C]">Contact Number</FormLabel>
                          <FormControl><Input placeholder="10-digit Mobile" maxLength={10} className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-white/40" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="village" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#7A8C7C]">Location / Village</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-white/40"><SelectValue placeholder="Select Village" /></SelectTrigger></FormControl>
                          <SelectContent className="rounded-2xl border-white/20">
                            {VILLAGES.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type="submit" className="btn-primary w-full h-14 text-lg font-serif" disabled={submitting}>
                      {submitting ? <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</> : "Complete Enrollment"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;