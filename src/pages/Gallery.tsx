import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useLang } from "@/lib/i18n";
import eventMeeting from "@/assets/gallery/event-meeting.jpg";
import eventAwards from "@/assets/gallery/event-awards.jpg";
import eventGroup from "@/assets/gallery/event-group.jpg";
import eventExam from "@/assets/gallery/event-exam.jpg";

const Gallery = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { tr } = useLang();

  const galleries = [
    { title: "Annual Meeting 2025", images: [eventMeeting, eventGroup] },
    { title: "Awards & Examination", images: [eventAwards, eventExam] },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-white pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.03]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tr.gallery.capturedMoments}
          </motion.span>
          <motion.h1 className="font-playfair text-4xl md:text-5xl font-bold mt-3 mb-4 text-shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {tr.gallery.ourGallery}
          </motion.h1>
          <motion.div className="section-divider mb-5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p className="text-white/40 max-w-md mx-auto text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {tr.gallery.galleryDesc}
          </motion.p>
        </div>
      </section>

      {/* Gallery Sections */}
      {galleries.map((gallery, gi) => (
        <section key={gallery.title} className={`py-16 md:py-24 ${gi % 2 === 1 ? 'bg-muted/30' : ''}`}>
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-3">{gallery.title}</h2>
              <div className="section-divider" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {gallery.images.map((img, i) => (
                <motion.div key={i} className="relative group rounded-2xl overflow-hidden premium-shadow cursor-pointer card-hover aspect-[4/3]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} onClick={() => setLightbox(img)}>
                  <img src={img} alt={`${gallery.title} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" size={28} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.img src={lightbox} alt="Gallery" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} />
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={() => setLightbox(null)}>
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
