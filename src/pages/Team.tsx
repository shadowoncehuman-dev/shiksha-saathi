import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, User, Briefcase, Crown, Shield, Star, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { TEAM_MEMBERS } from "@/lib/team-data";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

type TeamMemberDB = {
  id: string;
  name: string;
  role: string;
  father_name: string;
  post: string;
  phone: string;
  photo_url: string | null;
  sort_order: number;
};

const roleIcon = (role: string) => {
  if (role === "President") return Crown;
  if (role === "Vice President") return Shield;
  if (role.includes("Secretary") || role.includes("Cashier") || role.includes("Co-ordinator") || role === "Auditor") return Star;
  return User;
};

const Team = () => {
  const { tr } = useLang();
  const [dbMembers, setDbMembers] = useState<TeamMemberDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase.from("team_members").select("*").order("sort_order");
      if (data && data.length > 0) setDbMembers(data as TeamMemberDB[]);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const members = dbMembers.length > 0
    ? dbMembers.map(m => ({
        name: m.name,
        role: m.role,
        fatherName: m.father_name,
        post: m.post,
        phone: m.phone,
        photo: m.photo_url || "",
      }))
    : TEAM_MEMBERS;

  const leaders = members.filter(m => ["President", "Vice President", "Secretary", "Cashier", "Co-ordinator", "Auditor"].includes(m.role));
  const regularMembers = members.filter(m => m.role === "Member");

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.03]" />
        <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full border border-secondary/[0.05]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tr.team.peopleBehind}
          </motion.span>
          <motion.h1 className="font-playfair text-4xl md:text-5xl font-bold mt-3 mb-4 text-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {tr.team.ourTeam}
          </motion.h1>
          <motion.div className="section-divider mb-5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p className="text-white/40 max-w-md mx-auto text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {tr.team.teamDesc}
          </motion.p>
        </div>
      </section>

      {/* Leaders */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.team.coreCommittee}</span>
            <h2 className="font-playfair text-3xl font-bold text-foreground mt-3 mb-4">{tr.team.leadership}</h2>
            <div className="section-divider" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {leaders.map((member, i) => {
              const Icon = roleIcon(member.role);
              return (
                <motion.div key={member.name} className="bg-card rounded-2xl overflow-hidden premium-shadow border border-border card-hover group card-inner-glow relative" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}>
                  <div className="h-1 bg-gradient-to-r from-secondary to-accent" />
                  <div className="p-6 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover border-2 border-border group-hover:border-secondary transition-colors duration-500 gold-frame" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center border-2 border-border gold-frame">
                          <User size={28} className="text-primary" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-md">
                        <Icon size={12} className="text-white" />
                      </div>
                    </div>
                    <h3 className="font-playfair text-lg font-bold text-foreground mb-0.5">{member.name}</h3>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 text-primary text-xs font-semibold mb-3">{member.role}</span>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <User size={13} className="text-secondary/60" />
                        {tr.team.fatherName}: {member.fatherName}
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Briefcase size={13} className="text-secondary/60" />
                        {member.post}
                      </p>
                      <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 text-primary hover:text-secondary transition-colors">
                        <Phone size={13} />
                        {member.phone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Members */}
      {regularMembers.length > 0 && (
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">{tr.team.extendedTeam}</span>
              <h2 className="font-playfair text-3xl font-bold text-foreground mt-3 mb-4">{tr.team.members}</h2>
              <div className="section-divider" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {regularMembers.map((member, i) => (
                <motion.div key={member.name} className="bg-card rounded-xl p-5 flex items-start gap-4 premium-shadow border border-border card-hover group card-inner-glow relative overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}>
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-border shrink-0 group-hover:border-secondary/50 transition-colors gold-frame" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center border border-border shrink-0">
                      <User size={20} className="text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-playfair text-base font-bold text-foreground leading-tight">{member.name}</h3>
                    <p className="text-xs text-secondary font-semibold mb-1.5">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{tr.team.fatherName}: {member.fatherName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Briefcase size={10} /> {member.post}</p>
                    <a href={`tel:${member.phone}`} className="text-xs text-primary flex items-center gap-1 mt-1 hover:text-secondary transition-colors">
                      <Phone size={10} /> {member.phone}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Team;
