import { motion } from "framer-motion";
import { Phone, User, Briefcase, Crown, Shield, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { TEAM_MEMBERS } from "@/lib/team-data";
import avatarPlaceholder from "@/assets/avatar-placeholder.jpg";

const roleIcon = (role: string) => {
  if (role === "President") return Crown;
  if (role === "Vice President") return Shield;
  if (role.includes("Secretary") || role.includes("Cashier") || role.includes("Co-ordinator")) return Star;
  return User;
};

const roleColor = (role: string) => {
  if (role === "President") return "from-secondary to-accent";
  if (role === "Vice President") return "from-primary to-secondary";
  return "from-muted-foreground/60 to-muted-foreground/40";
};

const Team = () => {
  const leaders = TEAM_MEMBERS.filter(m => ["President", "Vice President", "Secretary", "Cashier", "Co-ordinator"].includes(m.role));
  const members = TEAM_MEMBERS.filter(m => m.role === "Member");

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(45 93% 47% / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, hsl(36 100% 50% / 0.1) 0%, transparent 50%)`,
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Team
          </motion.h1>
          <motion.div className="section-divider mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p
            className="text-primary-foreground/70 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Dedicated leaders and members working towards educational excellence
          </motion.p>
        </div>
      </section>

      {/* Leaders */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-playfair text-3xl font-bold text-center text-foreground mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Leadership
          </motion.h2>
          <div className="section-divider mb-12" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {leaders.map((member, i) => {
              const Icon = roleIcon(member.role);
              return (
                <motion.div
                  key={member.name}
                  className="glass-card rounded-2xl overflow-hidden card-hover group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`h-2 bg-gradient-to-r ${roleColor(member.role)}`} />
                  <div className="p-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={avatarPlaceholder}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-4 border-card shadow-lg group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                        <Icon size={14} className="text-secondary-foreground" />
                      </div>
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-foreground mb-1">{member.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
                      {member.role}
                    </span>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center justify-center gap-2">
                        <User size={14} className="text-secondary" />
                        F/N: {member.fatherName}
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Briefcase size={14} className="text-secondary" />
                        {member.post}
                      </p>
                      <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 text-primary hover:text-secondary transition-colors">
                        <Phone size={14} />
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
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-playfair text-3xl font-bold text-center text-foreground mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Members
          </motion.h2>
          <div className="section-divider mb-12" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {members.map((member, i) => (
              <motion.div
                key={member.name}
                className="glass-card rounded-xl p-5 flex items-start gap-4 card-hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <img
                  src={avatarPlaceholder}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-accent/50 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-playfair text-lg font-bold text-foreground leading-tight">{member.name}</h3>
                  <p className="text-xs text-secondary font-semibold mb-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground">F/N: {member.fatherName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase size={10} /> {member.post}
                  </p>
                  <a href={`tel:${member.phone}`} className="text-xs text-primary flex items-center gap-1 mt-1 hover:text-secondary transition-colors">
                    <Phone size={10} /> {member.phone}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Team;
