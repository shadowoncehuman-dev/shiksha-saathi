import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/91${CONTACT.phone}?text=Hello, I need help regarding the examination.`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
};

export default WhatsAppButton;
