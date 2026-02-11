import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, Award, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ORG_NAME, TAGLINE, SUBHEADING, EXAM_DATE, EXAM_GROUPS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 md:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px)`,
          }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-playfair font-bold opacity-[0.03] select-none pointer-events-none">
          अ
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
              <Calendar size={16} /> Exam Date: {EXAM_DATE}
            </div>
          </motion.div>
          <motion.h1
            className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            {ORG_NAME}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-secondary font-playfair font-medium mb-2"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {TAGLINE}
          </motion.p>
          <motion.p
            className="text-primary-foreground/70 max-w-2xl mx-auto mb-10"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            {SUBHEADING}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
          >
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base px-8">
              <a href="#exam-groups">View Exam Details</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8">
              <Link to="/register">Register Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Exam Groups */}
      <section id="exam-groups" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
              Examination Groups
            </h2>
            <div className="section-divider mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto">
              Students are divided into two groups based on their class for systematic examination.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {EXAM_GROUPS.map((group, i) => (
              <motion.div
                key={group.name}
                className="glass-card gold-border rounded-xl p-8 text-center hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-primary" size={28} />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                  {group.name}
                </h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Classes: <span className="font-semibold text-foreground">{group.classes.join(", ")}</span>
                </p>
                <div className="flex items-center justify-center gap-2 text-secondary font-medium">
                  <Clock size={18} />
                  Duration: {group.duration}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Calendar size={14} />
                  {EXAM_DATE}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
              About the Samiti
            </h2>
            <div className="section-divider mb-4" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Award, title: "Excellence", desc: "Committed to maintaining the highest standards of educational assessment and student evaluation." },
              { icon: Users, title: "Inclusivity", desc: "Providing equal opportunities for students across all classes from 6 to 12 to demonstrate their knowledge." },
              { icon: Shield, title: "Integrity", desc: "Ensuring transparent, fair, and secure examination processes that uphold trust and credibility." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card rounded-xl p-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-secondary" size={24} />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
