import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Calendar, Award, Users, Shield, ArrowRight, ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ORG_NAME, TAGLINE, SUBHEADING, EXAM_DATE, EXAM_GROUPS } from "@/lib/constants";
import logo from "@/assets/logo.png";
import galleryMeeting from "@/assets/gallery-meeting.jpg";
import galleryShields from "@/assets/gallery-shields.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(45 93% 47% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(36 100% 50% / 0.2) 0%, transparent 50%)`,
        }} />
        <div className="container mx-auto px-4 relative z-10 text-center py-20 md:py-32">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <img src={logo} alt="Logo" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-white/95 p-2 shadow-2xl shadow-secondary/20" />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/20 backdrop-blur-sm text-secondary text-sm font-semibold mb-6 border border-secondary/20">
              <Calendar size={16} /> Exam: {EXAM_DATE}
            </div>
          </motion.div>
          <motion.h1
            className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 text-primary-foreground text-shadow"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            {ORG_NAME}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-secondary font-playfair font-medium mb-3"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            {TAGLINE}
          </motion.p>
          <motion.p
            className="text-primary-foreground/60 max-w-2xl mx-auto mb-12 text-sm md:text-base"
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
          >
            {SUBHEADING}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={5}
          >
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base px-8 shadow-lg shadow-secondary/25 group">
              <Link to="/exam-details">
                View Exam Details
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8 backdrop-blur-sm">
              <Link to="/register">Register Now</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronRight size={24} className="text-primary-foreground/40 rotate-90" />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: "Exam Groups", value: "2" },
              { label: "Classes", value: "6–12" },
              { label: "Villages", value: "7+" },
              { label: "Exam Date", value: "Apr 2026" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="py-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-playfair text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Groups */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Examination Structure</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">Examination Groups</h2>
            <div className="section-divider mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto">Students are divided into two groups based on their class for systematic examination.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {EXAM_GROUPS.map((group, i) => (
              <motion.div
                key={group.name}
                className="glass-card rounded-2xl overflow-hidden card-hover gold-glow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className={`p-6 ${i === 0 ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gradient-to-r from-secondary to-accent'} text-primary-foreground`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-playfair text-2xl font-bold">{group.name}</h3>
                      <p className="text-sm opacity-80">Classes {group.classes.join(", ")}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock size={16} className="text-secondary" />
                    Duration: <span className="font-semibold text-foreground">{group.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={16} className="text-secondary" />
                    Date: <span className="font-semibold text-foreground">{EXAM_DATE}</span>
                  </div>
                  <Button asChild variant="outline" className="w-full group">
                    <Link to="/exam-details">
                      View Details
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Who We Are</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">About the Samiti</h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Award, title: "Excellence", desc: "Committed to maintaining the highest standards of educational assessment and student evaluation." },
              { icon: Users, title: "Inclusivity", desc: "Providing equal opportunities for students across all classes from 6 to 12 to demonstrate their knowledge." },
              { icon: Shield, title: "Integrity", desc: "Ensuring transparent, fair, and secure examination processes that uphold trust and credibility." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card rounded-2xl p-8 text-center card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="text-secondary" size={28} />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-sm font-semibold tracking-wider uppercase">Moments</span>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">From Our Gallery</h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            {[
              { img: galleryMeeting, title: "Meeting 2025" },
              { img: galleryShields, title: "Shields 2024" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="relative rounded-2xl overflow-hidden group cursor-pointer card-hover"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <img src={item.img} alt={item.title} className="w-full h-64 md:h-72 object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-primary-foreground font-playfair text-lg font-semibold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/gallery">
                View Full Gallery
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 hero-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, hsl(45 93% 47% / 0.2) 0%, transparent 60%)`,
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GraduationCap size={48} className="text-secondary mx-auto mb-6" />
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-shadow">Ready to Register?</h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto mb-8">
              Join thousands of students in the Dr. B.R. Ambedkar examination. Registration is quick and easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-10 shadow-lg shadow-secondary/25">
                <Link to="/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm">
                <Link to="/team">Meet Our Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
