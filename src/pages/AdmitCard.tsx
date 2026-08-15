import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, AlertTriangle, Image as ImageIcon, MessageCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ORG_NAME, EXAM_DATE, EXAM_CENTER, CONTACT } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

type AdmitData = {
  roll_number: string;
  name: string;
  father_name: string;
  class: number;
  group: string;
  phone: string;
  village: string;
  duration: string;
};

const AdmitCard = () => {
  const [data, setData] = useState<AdmitData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { tr } = useLang();

  useEffect(() => {
    const stored = sessionStorage.getItem("admit_card_data");
    if (stored) setData(JSON.parse(stored));
    else navigate("/register");
  }, [navigate]);

  if (!data) return null;

  const qrData = JSON.stringify({
    name: data.name, father_name: data.father_name, roll_number: data.roll_number,
    class: data.class, group: data.group, exam_date: EXAM_DATE,
  });

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, w, h);
    pdf.save(`AdmitCard_${data.roll_number}.pdf`);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `AdmitCard_${data.roll_number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleWhatsAppShare = () => {
    const text = `📋 *ADMIT CARD*\n\n🏫 ${ORG_NAME}\n\n👤 Name: ${data.name}\n👨 Father: ${data.father_name}\n📝 Roll No: ${data.roll_number}\n📚 Class: ${data.class} (${data.group})\n📅 Exam Date: ${EXAM_DATE}\n🏫 Center: ${EXAM_CENTER}\n⏱ Duration: ${data.duration}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Layout>
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl relative" style={{ border: "4px solid hsl(43, 96%, 56%)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Guilloche/Security Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`, backgroundSize: '12px 12px' }} />
            
            {/* Header */}
            <div style={{ background: "linear-gradient(165deg, hsl(222 67% 10%), hsl(222 67% 16%), hsl(222 50% 22%))" }} className="text-white p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <img src={logo} alt="" className="absolute inset-0 m-auto w-32 h-32 opacity-10 select-none pointer-events-none" />
              <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-3 rounded-full bg-white p-1.5 relative z-10 shadow-lg" />
              <h2 className="font-playfair text-xl md:text-2xl font-bold relative z-10 mb-2 leading-tight px-4">{ORG_NAME}</h2>
              <div className="inline-block px-4 py-1 rounded-full bg-accent/20 border border-accent/30 relative z-10">
                <p className="text-accent font-bold text-sm tracking-[0.2em] uppercase">{tr.admitCard.title}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-10 relative bg-[#fafafa]">
              <img src={logo} alt="" className="absolute inset-0 m-auto w-64 h-64 opacity-[0.03] select-none pointer-events-none" />

              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-1 grid grid-cols-1 gap-y-4">
                  {[
                    { label: tr.admitCard.group, value: data.group },
                    { label: tr.admitCard.studentName, value: data.name },
                    { label: tr.admitCard.fatherName, value: data.father_name },
                    { label: tr.admitCard.class, value: `Class ${data.class}` },
                    { label: tr.admitCard.examDate, value: EXAM_DATE },
                    { label: tr.admitCard.duration, value: data.duration },
                    { label: tr.admitCard.examCenter, value: EXAM_CENTER },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-gray-100 pb-2 last:border-0">
                      <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold block mb-0.5">{item.label}</span>
                      <span className="font-semibold text-gray-900 text-base">{item.value}</span>
                    </div>
                  ))}
                  <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">{tr.admitCard.rollNumber}</p>
                      <p className="font-playfair text-4xl font-black text-primary leading-none">{data.roll_number}</p>
                    </div>
                    <div className="text-right opacity-20 hidden sm:block">
                      <ImageIcon size={40} className="text-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-start gap-4">
                  <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-xl relative group">
                    <QRCodeSVG value={qrData} size={140} />
                    <div className="absolute inset-0 border-2 border-accent opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl pointer-events-none" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{tr.admitCard.scanDetails}</p>
                    <div className="flex gap-1 justify-center mt-1">
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse delay-75" />
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-500 relative z-10">
                <div>
                  <strong className="text-gray-700 uppercase tracking-tighter block mb-1">{tr.admitCard.office}</strong>
                  <p className="leading-tight">{CONTACT.office}</p>
                </div>
                <div className="sm:text-right">
                  <strong className="text-gray-700 uppercase tracking-tighter block mb-1">{tr.admitCard.contact}</strong>
                  <p className="leading-tight">{CONTACT.phone} | {CONTACT.email}</p>
                </div>
              </div>
            </div>
            
            {/* Footer Stripe */}
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
          </motion.div>

          {/* Warning */}
          <motion.div className="mt-6 flex items-start gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-foreground">
              <strong>{tr.admitCard.important}:</strong> {tr.admitCard.importantMsg}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div className="mt-6 flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button onClick={handleDownloadPDF} className="flex-1 bg-primary hover:bg-primary/90 h-11 rounded-xl">
              <Download size={16} className="mr-2" /> {tr.admitCard.downloadPDF}
            </Button>
            <Button onClick={handleDownloadImage} variant="outline" className="flex-1 h-11 rounded-xl">
              <ImageIcon size={16} className="mr-2" /> {tr.admitCard.downloadImage}
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="flex-1 h-11 rounded-xl">
              <Printer size={16} className="mr-2" /> {tr.admitCard.print}
            </Button>
          </motion.div>

          {/* WhatsApp Share */}
          <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Button onClick={handleWhatsAppShare} className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white">
              <MessageCircle size={16} className="mr-2" /> {tr.whatsapp.shareAdmitCard}
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdmitCard;
