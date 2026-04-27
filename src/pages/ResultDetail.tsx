import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, ArrowLeft, Award, MessageCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ORG_NAME, CONTACT, EXAM_DATE } from "@/lib/constants";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

type ResultData = {
  roll_number: string;
  name?: string;
  father_name?: string;
  class?: number;
  total: number;
  percentage: number;
  grade?: string;
  status?: string;
};

const ResultDetail = () => {
  const [data, setData] = useState<ResultData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { tr } = useLang();

  useEffect(() => {
    const stored = sessionStorage.getItem("result_data");
    if (stored) setData(JSON.parse(stored));
    else navigate("/result");
  }, [navigate]);

  if (!data) return null;

  const isAbsent = data.total === 0 || data.total === undefined || data.total === null;

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, w, h);
    pdf.save(`Result_Certificate_${data.roll_number}.pdf`);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `Result_Certificate_${data.roll_number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleWhatsAppShare = () => {
    const emoji = isAbsent ? "📋" : "🎉";
    const statusText = isAbsent ? "ABSENT" : `📊 Total: ${data.total}/100\n📈 Percentage: ${data.percentage}%`;
    const text = `${emoji} *EXAMINATION RESULT*\n\n🏫 ${ORG_NAME}\n\n👤 Name: ${data.name || "N/A"}\n📝 Roll No: ${data.roll_number}\n${statusText}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <Layout>
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/result")} className="mb-6 text-muted-foreground hover:text-foreground rounded-xl">
            <ArrowLeft size={16} className="mr-2" /> {tr.resultDetail.back}
          </Button>

          {/* Certificate */}
          <motion.div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ border: "3px solid hsl(43, 96%, 56%)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(165deg, hsl(222 67% 10%), hsl(222 67% 16%), hsl(222 50% 22%))" }} className="text-white p-8 text-center relative">
              <img src={logo} alt="" className="absolute inset-0 m-auto w-32 h-32 opacity-5 select-none pointer-events-none" />
              <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-3 rounded-full bg-white p-1 relative z-10" />
              <h3 className="font-serif text-lg font-bold relative z-10">{ORG_NAME}</h3>
              <p className="text-amber-400 text-sm relative z-10 font-semibold mt-1">CERTIFICATE OF EXAMINATION RESULT</p>
              <p className="text-white/40 text-xs mt-1 relative z-10">Exam Date: {EXAM_DATE}</p>
            </div>

            {/* Body */}
            <div className="p-8 relative">
              <img src={logo} alt="" className="absolute inset-0 m-auto w-48 h-48 opacity-[0.04] select-none pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <p className="text-gray-400 text-sm">This is to certify that</p>
                <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{data.name || "N/A"}</p>
                <p className="text-gray-400 text-sm mt-1">S/o <span className="font-medium text-gray-600">{data.father_name || "N/A"}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{tr.resultDetail.rollNumber}</p>
                  <p className="font-serif text-2xl font-bold" style={{ color: "hsl(222 67% 16%)" }}>{data.roll_number}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{tr.resultDetail.class}</p>
                  <p className="font-semibold text-lg text-gray-900">{data.class ? `Class ${data.class}` : "N/A"}</p>
                </div>
              </div>

              {isAbsent ? (
                <div className="text-center mb-6 relative z-10">
                  <Badge className="text-sm px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white">
                    <Award size={16} className="mr-2" />
                    ABSENT
                  </Badge>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                  {[
                    { label: tr.resultDetail.total, value: `${data.total}/100` },
                    { label: tr.resultDetail.percentage, value: `${data.percentage}%` },
                  ].map(item => (
                    <div key={item.label} className="text-center p-4 rounded-xl" style={{ background: "hsl(222 67% 16% / 0.03)" }}>
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className="font-bold text-xl" style={{ color: "hsl(222 67% 16%)" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 relative z-10 flex justify-between">
                <div>
                  <p><strong className="text-gray-500">Office:</strong> {CONTACT.office}</p>
                  <p><strong className="text-gray-500">Contact:</strong> {CONTACT.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-600">President</p>
                  <p>Bijander Kumar</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div className="mt-8 flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button onClick={handleDownloadPDF} className="flex-1 bg-primary hover:bg-primary/90 h-11 rounded-xl">
              <Download size={16} className="mr-2" /> {tr.resultDetail.downloadPDF}
            </Button>
            <Button onClick={handleDownloadImage} variant="outline" className="flex-1 h-11 rounded-xl">
              <Download size={16} className="mr-2" /> {tr.resultDetail.downloadCert}
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="flex-1 h-11 rounded-xl">
              <Printer size={16} className="mr-2" /> {tr.resultDetail.print}
            </Button>
          </motion.div>

          {/* WhatsApp Share */}
          <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Button onClick={handleWhatsAppShare} className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white">
              <MessageCircle size={16} className="mr-2" /> {tr.whatsapp.shareResult}
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ResultDetail;
