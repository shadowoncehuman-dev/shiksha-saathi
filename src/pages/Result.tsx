import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ORG_NAME } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const ResultPage = () => {
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchFatherName, setSearchFatherName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("result_status, result_publish_date, result_expiry_date")
          .single();

        if (!data) { setResultStatus("Not Declared"); setLoading(false); return; }

        const now = new Date();
        if (data.result_status === "Available") {
          if (data.result_publish_date && new Date(data.result_publish_date) > now) {
            setResultStatus("Not Declared");
          } else if (data.result_expiry_date && new Date(data.result_expiry_date) < now) {
            setResultStatus("Viewing Period Ended");
          } else {
            setResultStatus("Available");
          }
        } else {
          setResultStatus(data.result_status);
        }
      } catch {
        setResultStatus("Not Declared");
      }
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
      const { data: regData } = await supabase
        .from("registrations")
        .select("name, father_name, class")
        .eq("roll_number", rollNumber.trim())
        .single();

      const { data: resData } = await supabase
        .from("results")
        .select("*")
        .eq("roll_number", rollNumber.trim())
        .single();

      if (resData) {
        navigateToResult(resData, regData);
      } else {
        toast({ title: "No result found", description: "Please check the roll number.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch result.", variant: "destructive" });
    }
    setSearching(false);
  };

  const searchByName = async () => {
    if (!searchName.trim() || !searchFatherName.trim()) return;
    setSearching(true);
    try {
      const { data: regData } = await supabase
        .from("registrations")
        .select("roll_number, name, father_name, class")
        .ilike("name", searchName.trim())
        .ilike("father_name", searchFatherName.trim())
        .single();

      if (!regData) {
        toast({ title: "Student not found", variant: "destructive" });
        setSearching(false);
        return;
      }

      const { data: resData } = await supabase
        .from("results")
        .select("*")
        .eq("roll_number", regData.roll_number)
        .single();

      if (resData) {
        navigateToResult(resData, { name: regData.name, father_name: regData.father_name, class: regData.class });
      } else {
        toast({ title: "No result found", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch result.", variant: "destructive" });
    }
    setSearching(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </Layout>
    );
  }

  if (resultStatus !== "Available") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div className="glass-card gold-border rounded-xl p-10 text-center max-w-md" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="text-secondary" size={28} />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
              {resultStatus === "Not Declared" ? "Result Not Declared" : "Viewing Period Ended"}
            </h2>
            <p className="text-muted-foreground">
              {resultStatus === "Not Declared"
                ? "Results will be declared soon. Please check back later."
                : "The result viewing period has ended. Contact the office for queries."}
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">Check Your Result</h2>
            <div className="section-divider mb-3" />
            <p className="text-muted-foreground text-sm">{ORG_NAME}</p>
          </motion.div>

          <motion.div className="glass-card gold-border rounded-xl p-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="roll">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="roll" className="flex-1">By Roll Number</TabsTrigger>
                <TabsTrigger value="name" className="flex-1">By Name</TabsTrigger>
              </TabsList>
              <TabsContent value="roll">
                <div className="flex gap-3">
                  <Input placeholder="Enter Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchByRoll()} />
                  <Button onClick={searchByRoll} disabled={searching} className="bg-primary shrink-0">
                    {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="name" className="space-y-3">
                <Input placeholder="Student Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                <Input placeholder="Father's Name" value={searchFatherName} onChange={(e) => setSearchFatherName(e.target.value)} />
                <Button onClick={searchByName} disabled={searching} className="w-full bg-primary">
                  {searching ? <><Loader2 className="animate-spin mr-2" size={18} /> Searching...</> : <><Search size={18} className="mr-2" /> Search</>}
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ResultPage;
