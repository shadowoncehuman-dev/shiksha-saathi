import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, AlertTriangle, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { VILLAGES, getGroup, ORG_NAME } from "@/lib/constants";
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
  const { toast } = useToast();
  const { tr } = useLang();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", father_name: "", student_class: "", phone: "", village: "" },
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await supabase.from("site_settings").select("registration_status, exam_notice, exam_notice_type").single();
        setStatus(data?.registration_status || "Not Started");
        setExamNotice((data as any)?.exam_notice || null);
        setExamNoticeType((data as any)?.exam_notice_type || "info");
      } catch { setStatus("Not Started"); }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  const checkDuplicate = async (name: string, fatherName: string, studentClass: string) => {
    if (!name || !fatherName || !studentClass) return;
    const { data } = await supabase
      .from("registrations")
      .select("id")
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
      const studentClass = parseInt(values.student_class);
      const group = getGroup(studentClass);
      const { data: rollData, error: rollError } = await supabase.functions.invoke("generate-roll-number", { body: { student_class: studentClass } });
      if (rollError || !rollData?.roll_number) throw new Error("Failed to generate roll number");

      const { error: insertError } = await supabase.from("registrations").insert({
        roll_number: rollData.roll_number, name: values.name.trim(), father_name: values.father_name.trim(),
        class: studentClass, group: group.name, phone: values.phone, village: values.village,
      });
      if (insertError) throw insertError;

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
          <Loader2 className="animate-spin text-primary" size={36} />
        </div>
      </Layout>
    );
  }

  // Show success screen
  if (successData) {
    return (
      <Layout>
        <RegistrationSuccess {...successData} />
      </Layout>
    );
  }

  // Show failed screen
  if (failedError) {
    return (
      <Layout>
        <RegistrationFailed error={failedError} onRetry={() => setFailedError(null)} />
      </Layout>
    );
  }

  // Exam cancelled or rescheduled - block registration
  const isBlocked = examNotice && (examNoticeType === "cancelled" || examNoticeType === "rescheduled");

  if (isBlocked) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="bg-card rounded-2xl p-10 text-center max-w-md premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
              {examNoticeType === "cancelled" ? (
                <AlertTriangle className="text-destructive" size={24} />
              ) : (
                <Calendar className="text-[hsl(30,80%,45%)]" size={24} />
              )}
            </div>
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
              {tr.examNotice?.[examNoticeType as "cancelled" | "rescheduled"] || (examNoticeType === "cancelled" ? "Exam Cancelled" : "Exam Rescheduled")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{examNotice}</p>
            <Button variant="outline" onClick={() => navigate("/")} className="rounded-xl h-11">
              {tr.errors.goHome}
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (status !== "Open") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="bg-card rounded-2xl p-10 text-center max-w-md premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
              <UserPlus className="text-secondary" size={24} />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
              {status === "Not Started" ? tr.register.notStarted : tr.register.closed}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {status === "Not Started" ? tr.register.notStartedMsg : tr.register.closedMsg}
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Register for Exam — BBDBASS" description="Register for the Dr. B.R. Ambedkar annual examination. Fill the form with student details to get your roll number." path="/register" />
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.register.joinUs}</span>
            <h2 className="font-playfair text-3xl font-bold text-foreground mt-3 mb-3">{tr.register.title}</h2>
            <div className="section-divider mb-4" />
            <p className="text-muted-foreground text-sm">{ORG_NAME}</p>
          </motion.div>

          {/* Exam notice banner (info/warning only - not blocking) */}
          {examNotice && (examNoticeType === "info" || examNoticeType === "warning") && (
            <div className="mb-6">
              <ExamNoticeBanner />
            </div>
          )}

          <motion.div
            className="bg-card rounded-2xl p-8 premium-shadow border border-border"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            {duplicateWarning && (
              <motion.div
                className="flex items-start gap-3 p-4 mb-5 bg-destructive/5 rounded-xl border border-destructive/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-destructive">{tr.register.duplicateWarning}</p>
              </motion.div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{tr.register.studentName}</FormLabel>
                    <FormControl><Input placeholder={tr.register.studentName} className="h-11 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="father_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{tr.register.fatherName}</FormLabel>
                    <FormControl><Input placeholder={tr.register.fatherName} className="h-11 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="student_class" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{tr.register.class}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={tr.register.selectClass} /></SelectTrigger></FormControl>
                      <SelectContent>
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
                    <FormLabel className="text-sm font-medium">{tr.register.phone}</FormLabel>
                    <FormControl><Input placeholder={tr.register.phone} maxLength={10} className="h-11 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="village" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{tr.register.village}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder={tr.register.selectVillage} /></SelectTrigger></FormControl>
                      <SelectContent>
                        {VILLAGES.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-sm font-semibold rounded-xl" disabled={submitting}>
                  {submitting ? <><Loader2 className="animate-spin mr-2" size={16} /> {tr.register.registering}</> : tr.register.registerBtn}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
