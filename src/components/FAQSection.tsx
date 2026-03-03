import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/lib/i18n";

const FAQSection = () => {
  const { tr } = useLang();

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">
            {tr.faq.badge}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            {tr.faq.title}
          </h2>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl premium-shadow border border-border p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-1">
            {tr.faq.items.map((item: { q: string; a: string }, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/50">
                <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-secondary shrink-0" />
                    <span>{item.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pl-9">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
