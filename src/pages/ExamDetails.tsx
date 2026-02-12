import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, Download, FileText, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { EXAM_DATE } from "@/lib/constants";

const groups = [
  {
    name: "Group 1",
    classes: "Class 6 – 8",
    duration: "2 Hours",
    date: `Between ${EXAM_DATE}`,
    topics: [
      "Early Life of Dr. Ambedkar",
      "Educational Journey",
      "Social Reforms",
      "Basic Constitutional Concepts",
    ],
    color: "from-primary to-primary/80",
  },
  {
    name: "Group 2",
    classes: "Class 9 – 12",
    duration: "3 Hours",
    date: `Between ${EXAM_DATE}`,
    topics: [
      "Constitutional Contributions",
      "Social Justice Movement",
      "Political Philosophy",
      "Economic Thoughts",
    ],
    color: "from-secondary to-accent",
  },
];

const ExamDetails = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, hsl(45 93% 47% / 0.2) 0%, transparent 50%)`,
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GraduationCap size={16} /> Dr. B.R. Ambedkar Examination
          </motion.div>
          <motion.h1
            className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Examination Groups
          </motion.h1>
          <motion.div className="section-divider mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p
            className="text-primary-foreground/70 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Detailed information about examination groups, syllabus, and templates
          </motion.p>
        </div>
      </section>

      {/* Groups */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {groups.map((group, i) => (
              <motion.div
                key={group.name}
                className="glass-card rounded-2xl overflow-hidden card-hover gold-glow"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Group Header */}
                <div className={`bg-gradient-to-r ${group.color} p-6 text-primary-foreground`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-bold">{group.name}</h3>
                      <p className="text-sm opacity-80">{group.classes}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-secondary shrink-0" />
                      <span className="text-muted-foreground">{group.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-secondary shrink-0" />
                      <span className="text-muted-foreground">Duration: {group.duration}</span>
                    </div>
                  </div>

                  {/* Downloads */}
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Download size={16} className="text-secondary" /> Downloads
                    </h4>
                    <div className="flex gap-3">
                      <a
                        href={`/downloads/${group.name.toLowerCase().replace(' ', '-')}-syllabus.pdf`}
                        download
                        className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                      >
                        <FileText size={16} />
                        Syllabus
                      </a>
                      <a
                        href={`/downloads/${group.name.toLowerCase().replace(' ', '-')}-template.pdf`}
                        download
                        className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/5 border border-secondary/10 text-sm font-medium text-secondary hover:bg-secondary/10 transition-colors"
                      >
                        <FileText size={16} />
                        Template
                      </a>
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="font-playfair font-semibold text-foreground mb-3">Topics</h4>
                    <ul className="space-y-2">
                      {group.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 group">
                    <Link to="/register">
                      Register Now
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
