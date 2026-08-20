import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
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
      description: "Foundational assessment for primary-middle students focusing on basic historical awareness.",
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
      description: "Advanced evaluative framework for senior students covering complex sociological and political themes.",
    },
  ];

  return (
    <Layout>
      <SEOHead 
        title="Exam Details — BBDBASS" 
        description="View examination groups, schedules, topics and timings for the Dr. B.R. Ambedkar annual examination." 
        path="/exam-details" 
      />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-[#1A2E1F]/[0.02]">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-[#6B4EFF]/20 text-[#6B4EFF] text-xs font-bold mb-6 tracking-widest uppercase"
          >
            <GraduationCap size={14} /> 
            <span>Evaluation Framework</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Curriculum & <span className="premium-gradient-text italic font-normal">Syllabus</span>
          </motion.h1>
          
          <motion.p 
            className="text-[#7A8C7C] max-w-2xl mx-auto font-sans text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A standardized evaluation system designed to measure student proficiency across multiple dimensions of social and political history.
          </motion.p>
        </div>
      </section>

      {/* Group Cards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {groups.map((group, i) => (
              <motion.div 
                key={group.name} 
                className="glass-strong rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B4EFF]/5 rounded-bl-[5rem] transition-all group-hover:bg-[#6B4EFF]/10" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#6B4EFF] text-white flex items-center justify-center shadow-lg shadow-[#6B4EFF]/30">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]">{group.name}</h3>
                    <p className="text-[#6B4EFF] font-bold text-sm uppercase tracking-tighter">{group.classes}</p>
                  </div>
                </div>

                <p className="text-[#7A8C7C] font-sans mb-8 leading-relaxed">
                  {group.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-4 glass-light rounded-2xl border border-white/40">
                    <div className="flex items-center gap-2 text-[#6B4EFF] mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                    </div>
                    <p className="text-[#1A2E1F] dark:text-[#E8EDE3] font-serif font-bold">{group.date}</p>
                  </div>
                  <div className="p-4 glass-light rounded-2xl border border-white/40">
                    <div className="flex items-center gap-2 text-[#6B4EFF] mb-1">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                    </div>
                    <p className="text-[#1A2E1F] dark:text-[#E8EDE3] font-serif font-bold">{group.duration}</p>
                  </div>
                </div>

                <div className="flex-grow">
                  <h4 className="text-[#1A2E1F] dark:text-[#E8EDE3] font-serif font-bold mb-4 italic">Core Syllabus Topics</h4>
                  <ul className="space-y-3">
                    {group.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-[#7A8C7C] text-sm">
                        <CheckCircle2 size={16} className="text-[#6B4EFF] shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="btn-primary w-full mt-10">
                  <Link to="/register" className="flex items-center justify-center gap-2">
                    Begin Enrollment <ArrowRight size={16} />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-24 bg-[#1A2E1F] text-[#E8EDE3] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 grain-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 italic">Evaluation Standard</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div>
              <p className="text-4xl font-serif font-bold text-[#6B4EFF] mb-2">100</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#A7B9A7]">Total Marks</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-[#6B4EFF] mb-2">90</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#A7B9A7]">Minutes Allowed</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-[#6B4EFF] mb-2">MCQ</p>
              <p className="text-sm font-bold uppercase tracking-widest text-[#A7B9A7]">Question Format</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ExamDetails;