import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Medal, Crown, Star } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Winner = {
  id: string;
  year: number;
  rank: number;
  name: string;
  father_name: string;
  class: number;
  group_name: string;
  roll_number: string;
  percentage: number;
  photo_url: string | null;
};

const rankConfig = [
  {
    rank: 2,
    icon: Medal,
    color: "from-zinc-300 to-zinc-400",
    border: "border-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    badge: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
    label: "2nd",
    size: "w-28 h-28 md:w-32 md:h-32",
    mt: "mt-8",
  },
  {
    rank: 1,
    icon: Crown,
    color: "from-yellow-400 to-amber-500",
    border: "border-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200",
    label: "1st",
    size: "w-36 h-36 md:w-44 md:h-44",
    mt: "mt-0",
  },
  {
    rank: 3,
    icon: Award,
    color: "from-amber-600 to-amber-700",
    border: "border-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200",
    label: "3rd",
    size: "w-28 h-28 md:w-32 md:h-32",
    mt: "mt-8",
  },
  {
    rank: 5,
    icon: Star,
    color: "from-blue-400 to-blue-500",
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
    label: "5th",
    size: "w-24 h-24 md:w-28 md:h-28",
    mt: "mt-12",
  },
  {
    rank: 4,
    icon: Trophy,
    color: "from-green-400 to-green-500",
    border: "border-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    badge: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
    label: "4th",
    size: "w-28 h-28 md:w-32 md:h-32",
    mt: "mt-4",
  },
  {
    rank: 6,
    icon: Award,
    color: "from-purple-400 to-purple-500",
    border: "border-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200",
    label: "6th",
    size: "w-24 h-24 md:w-28 md:h-28",
    mt: "mt-12",
  },
];

const Winners = () => {
  const [winnersByYear, setWinnersByYear] = useState<Record<number, Winner[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      const { data } = await supabase
        .from("winners")
        .select("*")
        .order("year", { ascending: false })
        .order("rank", { ascending: true });

      if (data && data.length > 0) {
        const grouped: Record<number, Winner[]> = {};
        data.forEach((w: Winner) => {
          if (!grouped[w.year]) grouped[w.year] = [];
          grouped[w.year].push(w);
        });
        setWinnersByYear(grouped);
      }
      setLoading(false);
    };
    fetchWinners();
  }, []);

  const years = Object.keys(winnersByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Layout>
      <SEOHead
        title="Previous Year Winners — BBDBASS"
        description="View the top 6 winners from previous year examinations conducted by BBDBASS."
        path="/winners"
      />

      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <Star
              key={i}
              size={20 + i * 8}
              className="absolute text-secondary animate-pulse"
              style={{
                top: `${15 + i * 14}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
              <Trophy size={14} />
              Hall of Fame
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Previous Year <span className="text-secondary">Winners</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Celebrating the outstanding achievers who topped our examinations
            </p>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Winners */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            </div>
          ) : years.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy size={64} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">
                No winners data available yet. Check back after results are declared!
              </p>
            </motion.div>
          ) : (
            <div className="space-y-20">
              {years.map((year, yi) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: yi * 0.1 }}
                >
                  {/* Year badge */}
                  <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full text-lg font-bold">
                      <Trophy size={20} />
                      {year} Toppers
                    </span>
                  </div>

                  {/* Podium - order: 2nd, 1st, 3rd */}
                  <div className="flex items-end justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
                    {rankConfig.map((config, ci) => {
                      const winner = winnersByYear[year]?.find(
                        (w) => w.rank === config.rank
                      );
                      if (!winner) return <div key={ci} className="flex-1" />;

                      const Icon = config.icon;

                      return (
                        <motion.div
                          key={winner.id}
                          className={`flex-1 flex flex-col items-center ${config.mt}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 + ci * 0.15 }}
                        >
                          {/* Medal icon */}
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-3 shadow-lg`}
                          >
                            <Icon size={20} className="text-white" />
                          </div>

                          {/* Photo */}
                          <div
                            className={`relative ${config.size} rounded-full border-4 ${config.border} overflow-hidden shadow-xl mb-4`}
                          >
                            <Avatar className="w-full h-full">
                              <AvatarImage
                                src={winner.photo_url || ""}
                                alt={winner.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-2xl font-bold bg-muted">
                                {winner.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Rank badge */}
                            <div
                              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${config.badge} text-xs font-bold px-3 py-0.5 rounded-full shadow`}
                            >
                              {config.label}
                            </div>
                          </div>

                          {/* Info card */}
                          <div
                            className={`${config.bg} rounded-xl p-4 text-center w-full border border-border premium-shadow`}
                          >
                            <h3 className="font-semibold text-foreground text-sm md:text-base truncate">
                              {winner.name}
                            </h3>
                            {winner.father_name && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                S/o {winner.father_name}
                              </p>
                            )}
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Class {winner.class}
                              </span>
                              {winner.group_name && (
                                <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                                  {winner.group_name}
                                </span>
                              )}
                            </div>
                            <div className="mt-3 text-2xl md:text-3xl font-bold text-secondary">
                              {winner.percentage}%
                            </div>
                            {winner.roll_number && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Roll: {winner.roll_number}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Winners;
