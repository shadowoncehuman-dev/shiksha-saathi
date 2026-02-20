import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, AlertTriangle, Image as ImageIcon } from "lucide-react";
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

  return (
    <Layout>
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ border: "3px solid hsl(43, 96%, 56%)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(165deg, hsl(222 67% 10%), hsl(222 67% 16%), hsl(222 50% 22%))" }} className="text-white p-6 text-center relative">
              <img src={logo} alt="" className="absolute inset-0 m-auto w-32 h-32 opacity-5 select-none pointer-events-none" />
              <img src={logo} alt="Logo" className="w-14 h-14 mx-auto mb-2 rounded-full bg-white p-1 relative z-10" />
              <h2 className="font-playfair text-lg md:text-xl font-bold relative z-10 mb-1">{ORG_NAME}</h2>
              <p className="text-amber-400 font-semibold relative z-10 text-sm tracking-wider">{tr.admitCard.title}</p>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 relative">
              <img src={logo} alt="" className="absolute inset-0 m-auto w-48 h-48 opacity-[0.04] select-none pointer-events-none" />

              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-1 space-y-3.5">
                  {[
                    { label: tr.admitCard.group, value: data.group },
                    { label: tr.admitCard.studentName, value: data.name },
                    { label: tr.admitCard.fatherName, value: data.father_name },
                    { label: tr.admitCard.class, value: `Class ${data.class}` },
                    { label: tr.admitCard.examDate, value: EXAM_DATE },
                    { label: tr.admitCard.duration, value: data.duration },
                    { label: tr.admitCard.examCenter, value: EXAM_CENTER },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-2">
                      <span className="text-gray-400 text-sm min-w-[120px]">{item.label}:</span>
                      <span className="font-medium text-gray-900 text-sm">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-3">
                    <p className="text-xs text-gray-400 mb-1">{tr.admitCard.rollNumber}</p>
                    <p className="font-playfair text-4xl font-bold" style={{ color: "hsl(222 67% 16%)" }}>{data.roll_number}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <QRCodeSVG value={qrData} size={110} />
                  </div>
                  <p className="text-xs text-gray-300">{tr.admitCard.scanDetails}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 relative z-10">
                <p><strong className="text-gray-500">{tr.admitCard.office}:</strong> {CONTACT.office}</p>
                <p><strong className="text-gray-500">{tr.admitCard.contact}:</strong> {CONTACT.phone} | {CONTACT.email}</p>
              </div>
            </div>
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
        </div>
      </section>
    </Layout>
  );
};

export default AdmitCard;
