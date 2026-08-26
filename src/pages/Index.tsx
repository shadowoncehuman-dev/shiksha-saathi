import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, Award, Users, Shield, ArrowRight, ChevronDown, GraduationCap, Sparkles, Trophy, Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { ORG_NAME, EXAM_DATE, EXAM_GROUPS } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";
import galleryMeeting from "@/assets/gallery-meeting.jpg";
import galleryShields from "@/assets/gallery-shields.jpg";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CountdownTimer from "@/components/CountdownTimer";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ExamNoticeBanner from "@/components/ExamNoticeBanner";
import QuestionPaperBanner from "@/components/QuestionPaperBanner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FlowingMenu from "@/components/premium/FlowingMenu";
import { useNavigate } from "react-router-dom";
import AnimatedDataRing from "@/components/premium/AnimatedDataRing";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" as const },
  }),
};

type Winner = {
  id: string; rank: number; name: string; father_name: string;
  class: number; percentage: number; photo_url: string | null; year: number;
};

const Index = () => {
  const { tr } = useLang();
  const [galleryImages, setGalleryImages] = useState<{ img: string; title: string }[]>([]);
  const [topWinners, setTopWinners] = useState<Winner[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("title, image_url")
        .order("sort_order")
        .limit(4);
      if (data && data.length > 0) {
        setGalleryImages(data.map(d => ({ img: d.image_url, title: d.title })));
      } else {
        setGalleryImages([
          { img: galleryMeeting, title: "Meeting 2025" },
          { img: galleryShields, title: "Shields 2024" },
        ]);
      }
    };
    const fetchWinners = async () => {
      const { data } = await supabase
        .from("winners")
        .select("*")
        .order("year", { ascending: false })
        .order("rank", { ascending: true })
        .limit(3);
      if (data) setTopWinners(data as Winner[]);
    };
    fetchGallery();
    fetchWinners();
  }, []);

  return (
    <Layout>
      <SEOHead
        title="BBDBASS — Empowering Education Through Excellence"
        description="Official examination portal of BBDBASS — Register for exams, download admit cards, check results. Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti."
        path="/"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <img
          src={heroBackdrop}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1088}
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-25 pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-[#6B4EFF]/20 text-[#6B4EFF] text-xs font-bold mb-6 tracking-wider uppercase">
                  <Sparkles size={14} />
                  <span>2027 Academic Session</span>
                </div>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] text-[#1A2E1F] dark:text-[#E8EDE3] mb-6"
                initial="hidden" animate="visible" variants={fadeUp} custom={1}
              >
                Pioneering the <br />
                <span className="premium-gradient-text italic font-normal">Future of Excellence</span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-[#3D4F3F] dark:text-[#A7B9A7] font-sans max-w-xl mb-10 leading-relaxed"
                initial="hidden" animate="visible" variants={fadeUp} custom={2}
              >
                {ORG_NAME} is dedicated to fostering academic brilliance and moral integrity among students through rigorous evaluation.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial="hidden" animate="visible" variants={fadeUp} custom={3}
              >
                <Button asChild size="lg" className="btn-primary">
                  <Link to="/register">Register for Exam</Link>
                </Button>
                <Button asChild size="lg" className="btn-ghost">
                  <Link to="/exam-details">View Curriculum</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right Signature Element */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="glass-strong p-10 rounded-[2.5rem] relative"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6B4EFF]/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1A2E1F]/10 blur-3xl rounded-full" />
                
                <div className="flex flex-col items-center">
                  <AnimatedDataRing 
                    percentage={85} 
                    label="2027" 
                    sublabel="Examination" 
                    size={280}
                  />
                  
                  <div className="mt-8 grid grid-cols-2 gap-6 w-full">
                    <div className="text-center p-4 glass-light rounded-2xl border border-white/40">
                      <p className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">{EXAM_DATE.split(' ')[0]}</p>
                      <p className="text-[10px] text-[#7A8C7C] uppercase font-bold tracking-widest mt-1">April</p>
                    </div>
                    <div className="text-center p-4 glass-light rounded-2xl border border-white/40">
                      <p className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">09:00</p>
                      <p className="text-[10px] text-[#7A8C7C] uppercase font-bold tracking-widest mt-1">AM IST</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">Comprehensive Framework</h2>
            <p className="text-[#7A8C7C] mt-4 font-sans max-w-2xl mx-auto italic">Designed for depth, clarity, and institutional excellence.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {/* Featured Card - Anchor */}
            <motion.div 
              className="md:col-span-2 lg:col-span-3 bg-[#1A2E1F] text-[#E8EDE3] rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="text-[#6B4EFF]" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4 italic">Institutional Heritage</h3>
                <p className="text-[#A7B9A7] font-sans leading-relaxed">BBDBASS stands as a beacon of educational reform, honoring the legacy of Dr. B.R. Ambedkar through rigorous intellectual discipline.</p>
              </div>
              <Button asChild variant="link" className="text-white p-0 justify-start hover:text-[#6B4EFF]">
                <Link to="/team" className="flex items-center gap-2 group">
                  Meet the Board <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Glass Card 1 */}
            <motion.div 
              className="md:col-span-2 lg:col-span-3 glass-strong rounded-[2rem] p-8 min-h-[320px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-[#6B4EFF]/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-[#6B4EFF]" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-4">Secured Evaluation</h3>
              <p className="text-[#7A8C7C] font-sans leading-relaxed">State-of-the-art verification systems including QR-enabled admit cards and biometric-ready invigilation protocols ensure absolute integrity.</p>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div 
              className="md:col-span-2 lg:col-span-2 glass-light rounded-[2rem] p-8 flex flex-col justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Users className="text-[#6B4EFF] mx-auto mb-4" size={32} />
              <h4 className="text-xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">Elite Network</h4>
              <p className="text-xs text-[#7A8C7C] mt-2 uppercase tracking-widest font-bold">500+ Active Students</p>
            </motion.div>

            {/* Medium Card */}
            <motion.div 
              className="md:col-span-2 lg:col-span-4 glass-mid rounded-[2rem] p-8 flex items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="hidden sm:block">
                 <div className="w-20 h-20 rounded-2xl bg-[#6B4EFF]/10 flex items-center justify-center border border-[#6B4EFF]/20">
                   <Calendar className="text-[#6B4EFF]" size={32} />
                 </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-2 italic">Standardized Schedule</h3>
                <p className="text-[#7A8C7C] font-sans">A unified examination calendar synchronized across all districts for operational precision.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Notice & Countdown */}
      <div className="container mx-auto px-4 mb-12">
        <ExamNoticeBanner />
      </div>

      <CountdownTimer mode="result" />

      {/* Winners Section */}
      {topWinners.length > 0 && (
        <section className="py-24 bg-[#1A2E1F]/[0.02]">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex justify-between items-end mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">The Pantheon</h2>
                <p className="text-[#7A8C7C] font-sans mt-2 italic">Celebrating the intellectual elite of the previous session.</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex text-[#6B4EFF] hover:bg-[#6B4EFF]/10">
                <Link to="/winners">Full Hall of Fame <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topWinners.map((winner, i) => (
                <motion.div 
                  key={winner.id}
                  className="glass-strong rounded-[2.5rem] p-8 text-center relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute top-6 right-6">
                    {winner.rank === 1 && <Crown className="text-[#6B4EFF]" size={24} />}
                    {winner.rank === 2 && <Medal className="text-[#7A8C7C]" size={24} />}
                    {winner.rank === 3 && <Award className="text-[#A7B9A7]" size={24} />}
                  </div>
                  
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-[#6B4EFF]/20 overflow-hidden p-1">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={winner.photo_url || ""} />
                      <AvatarFallback className="bg-[#6B4EFF]/10 text-[#6B4EFF] font-serif font-bold text-2xl">
                        {winner.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-1">{winner.name}</h3>
                  <p className="text-[#7A8C7C] font-sans text-sm mb-4">Class {winner.class} • Rank {winner.rank}</p>
                  
                  <div className="inline-block px-4 py-1.5 rounded-full bg-[#1A2E1F] text-white text-xs font-bold font-sans">
                    {winner.percentage}% Excellence
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
              <Button asChild variant="outline" className="w-full rounded-2xl">
                <Link to="/winners">Full Hall of Fame</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection />
      <FAQSection />
    </Layout>
  );
};

export default Index;