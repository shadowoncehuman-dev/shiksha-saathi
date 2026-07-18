import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

interface Props {
  images: { src: string; alt?: string }[];
  onSelect?: (src: string) => void;
}

const MasonryGallery = ({ images, onSelect }: Props) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance] max-w-6xl mx-auto">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 md:mb-6 break-inside-avoid group relative rounded-2xl overflow-hidden premium-shadow luxury-border cursor-pointer"
          onClick={() => onSelect?.(img.src)}
        >
          <img
            src={img.src}
            alt={img.alt ?? `Gallery ${i + 1}`}
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
              <ZoomIn className="text-white" size={20} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MasonryGallery;
