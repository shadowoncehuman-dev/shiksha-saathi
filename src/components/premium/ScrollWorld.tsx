import { useEffect, useRef } from "react";
import { mountScrollWorld } from "@/lib/scroll-world";
import { EXAM_DATE, EXAM_YEAR } from "@/lib/constants";
import stillCampus from "@/assets/world/campus.jpg";
import stillRegister from "@/assets/world/register.jpg";
import stillExam from "@/assets/world/exam.jpg";
import stillResults from "@/assets/world/results.jpg";
import stillWinners from "@/assets/world/winners.jpg";

/**
 * Scroll-driven "fly through the world" hero (scroll-world skill).
 * Currently stills-only; when the dive video clips are generated, add
 * `clip: vidX` (and `clipMobile`) to each section and the engine will
 * scrub them automatically.
 */
const ScrollWorld = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    mountScrollWorld(hostRef.current, {
      nav: false,
      hint: "scroll to fly in",
      diveScroll: 1.35,
      crossfade: 0.14,
      sections: [
        {
          id: "campus",
          label: "The School",
          still: stillCampus,
          accent: "#6B4EFF",
          scroll: 1.6,
          linger: 0.4,
          eyebrow: `BBDBASS · ${EXAM_YEAR} Session`,
          title: "Where every journey begins.",
          body: "A small village campus in Nayagaon, Hapur — and a big promise: education for all, in Dr. B.R. Ambedkar's vision.",
          tags: ["Nayagaon, Hapur", "Empowering Education"],
        },
        {
          id: "register",
          label: "Register",
          still: stillRegister,
          accent: "#6B4EFF",
          eyebrow: "Step 01 · Registration",
          title: "Secure your seat.",
          body: "Register online in minutes and receive your unique roll number instantly — no queues, no paperwork.",
          tags: ["Free registration", "Instant roll number"],
        },
        {
          id: "exam",
          label: "Exam Day",
          still: stillExam,
          accent: "#6B4EFF",
          linger: 0.35,
          eyebrow: `Step 02 · ${EXAM_DATE}`,
          title: "One morning. One paper.",
          body: "A fair, tightly invigilated examination for Classes 6–12, held in two groups at your centre.",
          tags: ["Group 1 & 2", "Out of 100 marks"],
        },
        {
          id: "results",
          label: "Evaluation",
          still: stillResults,
          accent: "#6B4EFF",
          eyebrow: "Step 03 · Checked with care",
          title: "Every mark earned.",
          body: "Answer sheets are evaluated with rigour and integrity, and results are published right here on the portal.",
          tags: ["Fair evaluation", "Online results"],
        },
        {
          id: "winners",
          label: "The Pantheon",
          still: stillWinners,
          accent: "#6B4EFF",
          scroll: 1.6,
          linger: 0.45,
          eyebrow: "The Finale",
          title: "Your name, in lights.",
          body: "Toppers are honoured on the podium and remembered forever in the Hall of Fame. This year, it could be you.",
          tags: ["Trophies & medals", "Hall of Fame"],
          cta: {
            primary: { label: "Register for Exam", href: "/register" },
            secondary: { label: "Exam Details", href: "/exam-details" },
          },
        },
      ],
      connectors: [],
    });
  }, []);

  return (
    <div
      ref={hostRef}
      className="scroll-world"
      style={{
        // Theme the engine with the site's institutional palette + fonts
        ["--sw-bg" as string]: "#F5EFE0",
        ["--sw-ink" as string]: "#1A2E1F",
        ["--sw-ink-soft" as string]: "#5E6F60",
        ["--sw-accent" as string]: "#6B4EFF",
        ["--sw-font-display" as string]: "'DM Serif Display', Georgia, serif",
        ["--sw-font-body" as string]: "'DM Sans', system-ui, sans-serif",
      }}
    />
  );
};

export default ScrollWorld;
