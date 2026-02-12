import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Layout from "@/components/layout/Layout";
import galleryMeeting from "@/assets/gallery-meeting.jpg";
import galleryShields from "@/assets/gallery-shields.jpg";

const galleries = [
  {
    title: "Meeting 2025",
    images: [galleryMeeting],
  },
  {
    title: "Shields 2024",
    images: [galleryShields],
  },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, hsl(45 93% 47% / 0.15) 0%, transparent 50%)`,
          }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Gallery
          </motion.h1>
          <motion.div className="section-divider mb-4" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} />
          <motion.p
            className="text-primary-foreground/70 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Moments from our events, meetings, and award ceremonies
          </motion.p>
        </div>
      </section>

      {/* Gallery Sections */}
      {galleries.map((gallery, gi) => (
        <section key={gallery.title} className={`py-16 ${gi % 2 === 1 ? 'bg-muted/40' : ''}`}>
          <div className="container mx-auto px-4">
            <motion.h2
              className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {gallery.title}
            </motion.h2>
            <div className="section-divider mb-10" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {gallery.images.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer card-hover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={img}
                    alt={`${gallery.title} ${i + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
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
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />
            <button
              className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground"
              onClick={() => setLightbox(null)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
