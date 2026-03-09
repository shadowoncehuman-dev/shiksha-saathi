import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

import eventMeeting from "@/assets/gallery/event-meeting.jpg";
import eventAwards from "@/assets/gallery/event-awards.jpg";
import eventGroup from "@/assets/gallery/event-group.jpg";
import eventExam from "@/assets/gallery/event-exam.jpg";

type GalleryImageDB = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
};

const staticGalleries = [
  { title: "Annual Meeting 2025", images: [eventMeeting, eventGroup] },
  { title: "Awards & Examination", images: [eventAwards, eventExam] },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { tr } = useLang();
  const [dbImages, setDbImages] = useState<GalleryImageDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
      if (data && data.length > 0) setDbImages(data as GalleryImageDB[]);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const dbGalleries = useMemo(() => {
    const map = new Map<string, GalleryImageDB[]>();
    dbImages.forEach(img => {
      const list = map.get(img.category) || [];
      list.push(img);
      map.set(img.category, list);
    });
    return Array.from(map.entries()).map(([title, images]) => ({
      title,
      images: images.map(i => i.image_url),
    }));
  }, [dbImages]);

  const galleries = dbGalleries.length > 0 ? dbGalleries : staticGalleries;

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
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <ZoomIn className="text-white drop-shadow-lg" size={22} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.img src={lightbox} alt="Gallery" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl ring-1 ring-white/10" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} />
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={() => setLightbox(null)}>
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
