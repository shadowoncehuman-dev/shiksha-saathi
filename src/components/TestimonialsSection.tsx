import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLang } from "@/lib/i18n";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useCallback } from "react";

const TestimonialsSection = () => {
  const { tr } = useLang();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const cleanup = autoplay();
    return cleanup;
  }, [autoplay]);

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">
            {tr.testimonials.badge}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            {tr.testimonials.title}
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="overflow-hidden max-w-5xl mx-auto" ref={emblaRef}>
          <div className="flex gap-6">
            {tr.testimonials.items.map((item: { name: string; role: string; text: string }, i: number) => (
              <div key={i} className="flex-none w-[300px] md:w-[380px]">
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border h-full">
                  <Quote size={24} className="text-secondary/30 mb-4" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
