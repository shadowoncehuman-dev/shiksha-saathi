import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, FolderOpen, Eye, BookOpen, FileDown, ArrowDownToLine } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

type PdfFile = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  category: string;
  created_at: string;
};

const Downloads = () => {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPdf, setPreviewPdf] = useState<PdfFile | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    const fetchPdfs = async () => {
      const { data } = await supabase
        .from("pdfs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setPdfs(data as PdfFile[]);
      setLoading(false);
    };
    fetchPdfs();
  }, []);

  const grouped = pdfs.reduce<Record<string, PdfFile[]>>((acc, pdf) => {
    const cat = pdf.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pdf);
    return acc;
  }, {});

  // Sort categories: "Question Paper" first, rest alphabetical
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase().includes("question paper")) return -1;
    if (b.toLowerCase().includes("question paper")) return 1;
    return a.localeCompare(b);
  });

  return (
    <Layout>
      <SEOHead title="Documents — BBDBASS" description="Download syllabi, templates, and important documents for the BBDBASS examination." path="/downloads" />
      {/* Hero */}
      <section className="hero-gradient text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.03]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] text-secondary text-xs font-semibold mb-6 border border-white/[0.08] luxury-border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <BookOpen size={14} />
            {lang === "hi" ? "दस्तावेज़" : "Documents"}
          </motion.div>
          <motion.h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {lang === "hi" ? "दस्तावेज़ और फ़ाइलें" : "Documents & Files"}
          </motion.h1>
          <motion.div className="section-divider mb-5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p className="text-white/40 max-w-md mx-auto text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {lang === "hi"
              ? "पाठ्यक्रम, टेम्पलेट और अन्य महत्वपूर्ण दस्तावेज़ यहाँ देखें"
              : "Browse syllabi, templates, and other important documents"}
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : !pdfs.length ? (
            <div className="text-center py-16">
              <FolderOpen size={48} className="mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">
                {lang === "hi" ? "अभी कोई दस्तावेज़ उपलब्ध नहीं है।" : "No documents available yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedCategories.map((category, ci) => {
                const files = grouped[category];
                return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.1 }}
                >
                  <h2 className="font-playfair text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FolderOpen size={18} className="text-secondary" />
                    {category}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((pdf, i) => (
                      <motion.div
                        key={pdf.id}
                        className="group bg-card rounded-2xl p-5 border border-border hover:border-secondary/20 premium-shadow card-hover card-inner-glow relative overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ci * 0.1 + i * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.3 } }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 flex items-center justify-center shrink-0 group-hover:from-primary/15 group-hover:to-secondary/10 transition-colors">
                            <FileDown size={20} className="text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                              {pdf.title || pdf.file_name}
                            </h3>
                            {pdf.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{pdf.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => setPreviewPdf(pdf)}
                                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                              >
                                <Eye size={12} />
                                <span>{lang === "hi" ? "देखें" : "Preview"}</span>
                              </button>
                              <a
                                href={pdf.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-1.5 text-xs text-secondary font-medium hover:underline"
                              >
                                <ArrowDownToLine size={12} />
                                <span>{lang === "hi" ? "डाउनलोड" : "Download"}</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PDF Preview Modal */}
      <Dialog open={!!previewPdf} onOpenChange={(open) => !open && setPreviewPdf(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-5 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-semibold truncate pr-8">
                {previewPdf?.title || previewPdf?.file_name}
              </DialogTitle>
              <a
                href={previewPdf?.file_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline shrink-0"
              >
                <Download size={14} />
                {lang === "hi" ? "डाउनलोड" : "Download"}
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {previewPdf && (
              <iframe
                src={`${previewPdf.file_url}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0 rounded-b-lg"
                title={previewPdf.title || previewPdf.file_name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Downloads;
