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

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      start = start || timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

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
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(ellipse at 20% 50%, hsl(30 100% 52% / 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsl(43 96% 56% / 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, hsl(222 67% 40% / 0.1) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/[0.03]" />
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-white/[0.05]" />
          <div className="absolute bottom-20 -left-20 w-64 h-64 rounded-full border border-secondary/[0.08]" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-secondary/30" style={{ animation: "float 4s ease-in-out infinite" }} />
          <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full bg-accent/20" style={{ animation: "float 5s ease-in-out infinite 1s" }} />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-white/20" style={{ animation: "float 3s ease-in-out infinite 0.5s" }} />
        </div>
        <div className="absolute inset-0 grain-overlay" />

        <div className="container mx-auto px-4 relative z-10 text-center pt-28 pb-20 md:pt-36 md:pb-32">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <motion.img src={logo} alt="Logo" className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 rounded-full bg-white/95 p-1.5 shadow-2xl ring-4 ring-accent/10" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-sm text-secondary text-xs font-semibold mb-8 border border-white/[0.08] luxury-border">
              <Sparkles size={14} />
              <span>{tr.hero.examBadge}: {EXAM_DATE}</span>
            </div>
          </motion.div>

          <motion.h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 text-white text-shadow max-w-4xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            {ORG_NAME}
          </motion.h1>

          <motion.p className="text-xl md:text-2xl text-secondary font-playfair font-medium mb-4 tracking-wide" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            {tr.hero.tagline}
          </motion.p>

          <motion.p className="text-white/40 max-w-xl mx-auto mb-12 text-sm md:text-base leading-relaxed" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            {tr.hero.subheading}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Button asChild size="lg" className="bg-secondary text-white hover:bg-secondary/90 font-semibold text-sm px-8 h-12 shadow-lg shadow-secondary/20 group rounded-xl hover:shadow-secondary/30 hover:shadow-xl transition-all">
              <Link to="/exam-details">
                {tr.hero.viewExam}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-sm px-8 h-12 rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:shadow-xl transition-all">
              <Link to="/result">{tr.hero.checkResultNow}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <ChevronDown size={20} className="text-white/20" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative -mt-1 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: tr.stats.examGroups, value: 2, suffix: "" },
              { label: tr.stats.classes, value: 7, suffix: "+" },
              { label: tr.stats.villages, value: 7, suffix: "+" },
              { label: tr.stats.students, value: 500, suffix: "+" },
            ].map((stat, i) => (
              <motion.div key={stat.label} className={`py-8 md:py-10 text-center relative ${i < 3 ? "border-r border-border" : ""}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <p className="font-playfair text-3xl md:text-4xl font-bold text-gradient">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Notice Banner */}
      <div className="container mx-auto px-4 -mt-1 mb-4">
        <ExamNoticeBanner />
      </div>

      {/* Result Date Announcement */}
      <div className="container mx-auto px-4 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-secondary/10 via-accent/5 to-secondary/10 border border-secondary/15 text-center"
        >
          <Award size={18} className="text-secondary shrink-0" />
          <p className="text-sm sm:text-base font-semibold text-foreground">
            📢 Result will be available on <span className="text-secondary">1 May 2027</span>
          </p>
        </motion.div>
      </div>

      {/* Exam Countdown - hidden since exam date passed */}

      {/* Result Countdown */}
      <CountdownTimer mode="result" />

      {/* Question Paper Banner */}
      <div className="my-4">
        <QuestionPaperBanner />
      </div>

      {/* Exam Groups */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.index.examinationStructure}</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">{tr.index.examinationGroups}</h2>
            <div className="section-divider mb-5" />
            <p className="text-muted-foreground max-w-md mx-auto text-sm">{tr.index.examinationGroupsDesc}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {EXAM_GROUPS.map((group, i) => (
              <motion.div key={group.name} className="rounded-2xl overflow-hidden premium-card shimmer-border card-inner-glow" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}>
                <div className={`p-6 ${i === 0 ? 'hero-gradient' : 'bg-gradient-to-br from-secondary to-accent'} text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-bold">{group.name}</h3>
                      <p className="text-sm text-white/60">{tr.examDetails.classes} {group.classes.join(", ")}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                      <Clock size={15} className="text-secondary" />
                    </div>
                    <span>{tr.index.duration}: <span className="font-semibold text-foreground">{group.duration}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                      <Calendar size={15} className="text-secondary" />
                    </div>
                    <span>{tr.index.date}: <span className="font-semibold text-foreground">{EXAM_DATE}</span></span>
                  </div>
                  <Button asChild variant="outline" className="w-full group rounded-xl h-11 mt-2 hover:border-secondary/30 hover:bg-secondary/5 transition-all">
                    <Link to="/exam-details">
                      {tr.index.viewDetails}
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.index.whoWeAre}</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">{tr.index.aboutSamiti}</h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Award, title: tr.index.excellence, desc: tr.index.excellenceDesc },
              { icon: Users, title: tr.index.inclusivity, desc: tr.index.inclusivityDesc },
              { icon: Shield, title: tr.index.integrity, desc: tr.index.integrityDesc },
            ].map((item, i) => (
              <motion.div key={item.title} className="bg-card rounded-2xl p-8 text-center premium-shadow border border-border card-hover group card-inner-glow" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:from-secondary/20 group-hover:to-accent/20 transition-all duration-500 relative border border-secondary/10">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-accent/5 blur-xl group-hover:blur-2xl transition-all" />
                  <item.icon className="text-secondary relative z-10" size={24} />
                </div>
                <h3 className="font-playfair text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Winners Showcase */}
      {topWinners.length > 0 && (
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">Hall of Fame</span>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">Our Top Achievers</h2>
              <div className="section-divider" />
            </motion.div>

            <div className="flex items-end justify-center gap-4 md:gap-8 max-w-3xl mx-auto mb-12">
              {[
                { rank: 2, icon: Medal, color: "from-zinc-300 to-zinc-400", border: "border-zinc-300", size: "w-24 h-24 md:w-28 md:h-28", mt: "mt-6" },
                { rank: 1, icon: Crown, color: "from-yellow-400 to-amber-500", border: "border-yellow-400", size: "w-32 h-32 md:w-36 md:h-36", mt: "mt-0" },
                { rank: 3, icon: Award, color: "from-amber-600 to-amber-700", border: "border-amber-600", size: "w-24 h-24 md:w-28 md:h-28", mt: "mt-6" },
              ].map((config, ci) => {
                const winner = topWinners.find(w => w.rank === config.rank);
                if (!winner) return <div key={ci} className="flex-1" />;
                const Icon = config.icon;
                return (
                  <motion.div key={winner.id} className={`flex-1 flex flex-col items-center ${config.mt}`}
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + ci * 0.15 }}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-2 shadow-lg`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div className={`relative ${config.size} rounded-full border-4 ${config.border} overflow-hidden shadow-xl mb-3`}>
                      <Avatar className="w-full h-full">
                        <AvatarImage src={winner.photo_url || ""} alt={winner.name} className="object-cover" />
                        <AvatarFallback className="text-xl font-bold bg-muted">
                          {winner.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm text-center truncate max-w-full">{winner.name}</h3>
                    <p className="text-xs text-muted-foreground">Class {winner.class}</p>
                    <p className="text-xl font-bold text-secondary mt-1">{winner.percentage}%</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg" className="group rounded-xl h-12 hover:border-secondary/30">
                <Link to="/winners">
                  View All Winners
                  <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.index.moments}</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">{tr.index.fromGallery}</h2>
            <div className="section-divider" />
          </motion.div>

          <div className={`grid ${galleryImages.length > 2 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'} gap-6 max-w-5xl mx-auto mb-12`}>
            {galleryImages.map((item, i) => (
              <motion.div key={item.title + i} className="relative rounded-2xl overflow-hidden group cursor-pointer card-hover aspect-[4/3] premium-shadow" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-secondary to-accent mb-2 rounded-full" />
                  <p className="text-white font-playfair text-lg font-bold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="group rounded-xl h-12 hover:border-secondary/30">
              <Link to="/gallery">
                {tr.index.viewFullGallery}
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Explore — FlowingMenu */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 mb-8 text-center">
          <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">Explore</span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mt-3">Discover BBDBASS</h2>
          <div className="section-divider mt-4" />
        </div>
        <FlowingMenuSection />
      </section>

      {/* FAQ */}
      <FAQSection />


      {/* CTA */}
      <section className="py-20 md:py-32 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.03]" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full border border-secondary/[0.05]" />
        {/* Decorative ornaments */}
        <div className="absolute top-1/2 left-10 w-20 h-[1px] bg-gradient-to-r from-secondary/20 to-transparent hidden md:block" />
        <div className="absolute top-1/2 right-10 w-20 h-[1px] bg-gradient-to-l from-secondary/20 to-transparent hidden md:block" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-8 luxury-border">
              <GraduationCap size={32} className="text-secondary" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-shadow">{tr.index.readyToCheckResult}</h2>
            <p className="text-white/40 max-w-lg mx-auto mb-10 text-sm leading-relaxed">{tr.index.readyCheckDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-10 h-12 shadow-lg shadow-accent/20 rounded-xl hover:shadow-accent/30 hover:shadow-xl transition-all">
                <Link to="/result">{tr.hero.checkResultNow}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-accent/40 text-accent hover:bg-accent/10 backdrop-blur-sm h-12 rounded-xl font-semibold">
                <Link to="/team">{tr.index.meetTeam}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

const FlowingMenuSection = () => {
  const navigate = useNavigate();
  const items = [
    { link: "/exam-details", text: "Exam Details", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop" },
    { link: "/register", text: "Register", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop" },
    { link: "/winners", text: "Winners", image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=600&auto=format&fit=crop" },
    { link: "/gallery", text: "Gallery", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&auto=format&fit=crop" },
    { link: "/downloads", text: "Documents", image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=600&auto=format&fit=crop" },
  ];
  return <FlowingMenu items={items} onItemClick={(link) => navigate(link)} />;
};

export default Index;
