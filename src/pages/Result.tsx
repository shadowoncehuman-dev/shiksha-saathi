import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ORG_NAME, EXAM_YEAR } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import ExamNoticeBanner from "@/components/ExamNoticeBanner";
import CountdownTimer from "@/components/CountdownTimer";
import QuestionPaperBanner from "@/components/QuestionPaperBanner";

const ResultPage = () => {
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchFatherName, setSearchFatherName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tr } = useLang();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await supabase.from("site_settings").select("result_status, result_publish_date, result_expiry_date").single();
        if (!data) { setResultStatus("Not Declared"); setLoading(false); return; }
        const now = new Date();
        if (data.result_status === "Available") {
          if (data.result_publish_date && new Date(data.result_publish_date) > now) setResultStatus("Not Declared");
          else if (data.result_expiry_date && new Date(data.result_expiry_date) < now) setResultStatus("Viewing Period Ended");
          else setResultStatus("Available");
        } else setResultStatus(data.result_status);
      } catch { setResultStatus("Not Declared"); }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  const navigateToResult = (resultData: any, regData: any) => {
    sessionStorage.setItem("result_data", JSON.stringify({ ...resultData, ...regData }));
    navigate("/result-detail");
  };

  const searchByRoll = async () => {
    if (!rollNumber.trim()) return;
    setSearching(true);
    try {
      const { data: regData } = await supabase.from("registrations").select("name, father_name, class").eq("roll_number", rollNumber.trim()).single();
      if (!regData) { toast({ title: "Roll Number not found", description: "Please search using your name and father's name or contact the admins.", variant: "destructive" }); setSearching(false); return; }
      const { data: resData } = await supabase.from("results").select("*").eq("roll_number", rollNumber.trim()).single();
      if (resData) navigateToResult(resData, regData);
      else navigateToResult({ roll_number: rollNumber.trim(), total: 0, percentage: 0 }, regData);
    } catch { toast({ title: "Roll Number not found", description: "Please search using your name and father's name or contact the admins.", variant: "destructive" }); }
    setSearching(false);
  };

  const searchByName = async () => {
    if (!searchName.trim() || !searchFatherName.trim()) return;
    setSearching(true);
    try {
      const { data: regData } = await supabase.from("registrations").select("roll_number, name, father_name, class").eq("exam_year", EXAM_YEAR).ilike("name", searchName.trim()).ilike("father_name", searchFatherName.trim()).single();
      if (!regData) { toast({ title: "Student not found", description: "Please check your name and father's name or contact the admins.", variant: "destructive" }); setSearching(false); return; }
      const { data: resData } = await supabase.from("results").select("*").eq("roll_number", regData.roll_number).single();
      if (resData) navigateToResult(resData, { name: regData.name, father_name: regData.father_name, class: regData.class });
      else navigateToResult({ roll_number: regData.roll_number, total: 0, percentage: 0 }, { name: regData.name, father_name: regData.father_name, class: regData.class });
    } catch { toast({ title: "Student not found", description: "Please check your name and father's name or contact the admins.", variant: "destructive" }); }
    setSearching(false);
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" size={36} /></div></Layout>;
  }

  if (resultStatus !== "Available") {
    return (
      <Layout>
        <div className="pt-20">
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <motion.div className="bg-card rounded-2xl p-10 text-center max-w-md premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <Award className="text-secondary" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
                {resultStatus === "Not Declared" ? tr.result.notDeclared : tr.result.viewingEnded}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {resultStatus === "Not Declared" ? tr.result.notDeclaredMsg : tr.result.viewingEndedMsg}
              </p>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full md:w-auto mx-auto h-11 rounded-xl">
                  <Link to="/winners">{tr.result.topRankers}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
          {resultStatus === "Not Declared" && <CountdownTimer mode="result" />}
          <div className="my-4">
            <QuestionPaperBanner />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Check Results — BBDBASS" description="Search and view your examination results by roll number or name." path="/result" />
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-xl">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.result.examination}</span>
            <h2 className="font-playfair text-3xl font-bold text-foreground mt-3 mb-3">{tr.result.checkResult}</h2>
            <div className="section-divider mb-4" />
            <p className="text-muted-foreground text-sm">{ORG_NAME}</p>
          </motion.div>

          {/* Exam Notice Banner */}
          <div className="mb-6">
            <ExamNoticeBanner />
          </div>

          <motion.div className="bg-card rounded-2xl p-6 md:p-8 premium-shadow border border-border" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="roll">
              <TabsList className="w-full mb-5 h-11 rounded-xl p-1 bg-muted">
                <TabsTrigger value="roll" className="flex-1 rounded-lg text-sm">{tr.result.byRollNumber}</TabsTrigger>
                <TabsTrigger value="name" className="flex-1 rounded-lg text-sm">{tr.result.byName}</TabsTrigger>
              </TabsList>
              <TabsContent value="roll">
                <div className="flex gap-3">
                  <Input placeholder={tr.result.enterRoll} className="h-11 rounded-xl" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchByRoll()} />
                  <Button onClick={searchByRoll} disabled={searching} className="bg-primary shrink-0 h-11 w-11 rounded-xl p-0">
                    {searching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="name" className="space-y-3">
                <Input placeholder={tr.result.studentName} className="h-11 rounded-xl" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                <Input placeholder={tr.result.fatherName} className="h-11 rounded-xl" value={searchFatherName} onChange={(e) => setSearchFatherName(e.target.value)} />
                <Button onClick={searchByName} disabled={searching} className="w-full bg-primary h-11 rounded-xl">
                  {searching ? <><Loader2 className="animate-spin mr-2" size={16} /> {tr.result.searching}</> : <><Search size={16} className="mr-2" /> {tr.result.search}</>}
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="w-full max-w-sm h-11 rounded-xl">
              <Link to="/winners">{tr.result.topRankers}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResultPage;
