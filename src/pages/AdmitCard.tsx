import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Printer, AlertTriangle, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ORG_NAME, EXAM_DATE, CONTACT } from "@/lib/constants";

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

  useEffect(() => {
    const stored = sessionStorage.getItem("admit_card_data");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate("/register");
    }
  }, [navigate]);

  if (!data) return null;

  const qrData = JSON.stringify({
    name: data.name,
    father_name: data.father_name,
    roll_number: data.roll_number,
    class: data.class,
    group: data.group,
    exam_date: EXAM_DATE,
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

  const handlePrint = () => window.print();

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            ref={cardRef}
            className="bg-card rounded-xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ border: "3px solid hsl(43, 80%, 50%)" }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 text-center relative">
              <div className="absolute inset-0 opacity-5 flex items-center justify-center text-[10rem] font-playfair font-bold select-none pointer-events-none">
                अ
              </div>
              <h2 className="font-playfair text-xl md:text-2xl font-bold relative z-10 mb-1">
                {ORG_NAME}
              </h2>
              <p className="text-secondary font-medium relative z-10 text-sm">ADMIT CARD</p>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[12rem] font-playfair font-bold select-none pointer-events-none">
                अ
              </div>

              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-1 space-y-4">
                  {[
                    { label: "Group", value: data.group },
                    { label: "Student Name", value: data.name },
                    { label: "Father's Name", value: data.father_name },
                    { label: "Class", value: `Class ${data.class}` },
                    { label: "Exam Date", value: EXAM_DATE },
                    { label: "Duration", value: data.duration },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-2">
                      <span className="text-muted-foreground text-sm min-w-[110px]">{item.label}:</span>
                      <span className="font-medium text-foreground text-sm">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Roll Number</p>
                    <p className="font-playfair text-4xl font-bold text-primary">{data.roll_number}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="p-2 bg-card rounded-lg border border-border">
                    <QRCodeSVG value={qrData} size={120} />
                  </div>
                  <p className="text-xs text-muted-foreground">Scan for details</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground relative z-10">
                <p><strong>Office:</strong> {CONTACT.office}</p>
                <p><strong>Contact:</strong> {CONTACT.phone} | {CONTACT.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div
            className="mt-6 flex items-start gap-3 p-4 bg-secondary/10 rounded-lg border border-secondary/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-foreground">
              <strong>Important:</strong> Please take a screenshot or download this Admit Card and keep it safe for examination and result checking.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="mt-6 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={handleDownloadPDF} className="flex-1 bg-primary hover:bg-primary/90">
              <Download size={18} className="mr-2" /> Download PDF
            </Button>
            <Button onClick={handleDownloadImage} variant="outline" className="flex-1">
              <ImageIcon size={18} className="mr-2" /> Download Image
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer size={18} className="mr-2" /> Print
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AdmitCard;
