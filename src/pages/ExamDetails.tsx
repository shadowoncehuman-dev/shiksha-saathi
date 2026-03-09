import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { EXAM_DATE } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

const ExamDetails = () => {
  const { tr } = useLang();

  const groups = [
    {
      name: "Group 1",
      classes: "Class 6 – 8",
      duration: "11:00–12:30",
      date: EXAM_DATE,
      topics: [
        "Early Life of Dr. Ambedkar",
        "Educational Journey",
        "Social Reforms",
        "Basic Constitutional Concepts",
      ],
      gradient: "hero-gradient",
      slug: "group-1",
    },
    {
      name: "Group 2",
      classes: "Class 9 – 12",
      duration: "14:00–16:00",
      date: EXAM_DATE,
      topics: [
        "Constitutional Contributions",
        "Social Justice Movement",
        "Political Philosophy",
        "Economic Thoughts",
      ],
      gradient: "bg-gradient-to-br from-secondary to-accent",
      slug: "group-2",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.03]" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full border border-secondary/[0.05]" />
        {/* Decorative accent lines */}
        <div className="absolute top-1/2 left-0 w-32 h-[1px] bg-gradient-to-r from-secondary/10 to-transparent hidden md:block" />
        <div className="absolute top-1/2 right-0 w-32 h-[1px] bg-gradient-to-l from-secondary/10 to-transparent hidden md:block" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] text-secondary text-xs font-semibold mb-6 border border-white/[0.08] luxury-border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <GraduationCap size={14} /> {tr.examDetails.badge}
          </motion.div>
          <motion.h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {tr.examDetails.title}
          </motion.h1>
          <motion.div className="section-divider mb-5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p className="text-white/40 max-w-md mx-auto text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {tr.examDetails.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Groups */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {groups.map((group, i) => (
              <motion.div key={group.name} className="bg-card rounded-2xl overflow-hidden premium-card shimmer-border card-inner-glow" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}>
                {/* Header */}
                <div className={`${group.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-bold">{group.name}</h3>
                      <p className="text-sm text-white/80">{group.classes}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                        <Calendar size={14} className="text-secondary" />
                      </div>
                      <span className="text-muted-foreground text-xs">{group.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-secondary/5 flex items-center justify-center">
                        <Clock size={14} className="text-secondary" />
                      </div>
                      <span className="text-muted-foreground text-xs">{group.duration}</span>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 text-sm">{tr.examDetails.topics}</h4>
                    <ul className="space-y-2">
                      {group.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-secondary to-accent shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group rounded-xl h-11 mt-2 hover:shadow-lg hover:shadow-accent/20 transition-all">
                    <Link to="/register">
                      <span className="font-semibold">{tr.examDetails.registerNow}</span>
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ExamDetails;
