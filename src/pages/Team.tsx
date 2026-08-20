import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, User, Briefcase, Crown, Shield, Star, Loader2, Mail, ExternalLink, Linkedin, Twitter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { TEAM_MEMBERS } from "@/lib/team-data";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
          <Loader2 className="animate-spin text-[#6B4EFF]" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Our Team — BBDBASS" description="Meet the dedicated leadership and members of BBDBASS." path="/team" />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#1A2E1F]/[0.02]">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-[#6B4EFF]/20 text-[#6B4EFF] text-xs font-bold mb-6 tracking-widest uppercase"
          >
            <Users size={14} /> 
            <span>Executive Board</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Guardians of the <span className="premium-gradient-text italic font-normal">Academic Vision</span>
          </motion.h1>
          
          <motion.p 
            className="text-[#7A8C7C] max-w-2xl mx-auto font-sans text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Our leadership comprises dedicated intellectuals and social reformers committed to upholding the educational legacy of Bharat Ratan Baba Sahib Dr. B.R. Ambedkar.
          </motion.p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leaders.map((member, i) => {
              const Icon = roleIcon(member.role);
              return (
                <motion.div 
                  key={member.name} 
                  className="glass-strong rounded-[2.5rem] p-8 text-center relative group overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6B4EFF]/40 to-transparent" />
                  
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-[#6B4EFF]/20 p-1 group-hover:rotate-12 transition-transform duration-500">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-[#6B4EFF]/40" />
                    </div>
                    <Avatar className="w-full h-full relative z-10 p-1">
                      <AvatarImage src={member.photo} className="rounded-full object-cover" />
                      <AvatarFallback className="bg-[#6B4EFF]/10 text-[#6B4EFF] font-serif font-bold text-3xl">
                        {member.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#6B4EFF] text-white flex items-center justify-center shadow-lg z-20">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3] mb-1">{member.name}</h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#6B4EFF]/10 text-[#6B4EFF] text-[10px] font-bold uppercase tracking-widest mb-6">
                    {member.role}
                  </div>

                  <div className="space-y-4 text-sm text-[#7A8C7C] font-sans border-t border-white/40 pt-6">
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase size={14} className="text-[#6B4EFF]" />
                      <span>{member.post}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <User size={14} className="text-[#6B4EFF]" />
                      <span>S/o {member.fatherName}</span>
                    </div>
                    <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-[#1A2E1F] dark:text-[#E8EDE3] font-bold hover:text-[#6B4EFF] transition-colors mt-2">
                      <Phone size={14} />
                      {member.phone}
                    </a>
                  </div>

                  <div className="flex justify-center gap-3 mt-8">
                    <button className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-[#7A8C7C] hover:text-[#6B4EFF] transition-all"><Twitter size={14} /></button>
                    <button className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-[#7A8C7C] hover:text-[#6B4EFF] transition-all"><Linkedin size={14} /></button>
                    <button className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-[#7A8C7C] hover:text-[#6B4EFF] transition-all"><Mail size={14} /></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advisory Members */}
      {regularMembers.length > 0 && (
        <section className="py-24 bg-[#1A2E1F] text-[#E8EDE3]">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold italic">Advisory Council</h2>
              <div className="w-16 h-1 bg-[#6B4EFF] mx-auto mt-4 rounded-full" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {regularMembers.map((member, i) => (
                <motion.div 
                  key={member.name}
                  className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Avatar className="w-12 h-12 border border-white/20">
                    <AvatarImage src={member.photo} />
                    <AvatarFallback className="bg-white/10 text-white font-serif">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-white truncate">{member.name}</h4>
                    <p className="text-[10px] text-[#A7B9A7] uppercase tracking-widest font-bold">{member.post}</p>
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