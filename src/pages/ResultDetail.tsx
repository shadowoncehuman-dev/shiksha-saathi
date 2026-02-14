import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Printer, ArrowLeft, Award } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ORG_NAME, CONTACT, EXAM_DATE } from "@/lib/constants";
import logo from "@/assets/logo.png";

type ResultData = {
  roll_number: string;
  name?: string;
  father_name?: string;
  class?: number;
  total: number;
  percentage: number;
  grade: string;
  status: string;
};

const ResultDetail = () => {
  const [data, setData] = useState<ResultData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("result_data");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate("/result");
    }
  }, [navigate]);

  if (!data) return null;

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

  const handlePrint = () => window.print();

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" onClick={() => navigate("/result")} className="mb-6 text-muted-foreground">
            <ArrowLeft size={18} className="mr-2" /> Back to Search
          </Button>

          {/* Certificate Card */}
          <motion.div
            ref={cardRef}
            className="bg-white rounded-xl overflow-hidden shadow-2xl"
            style={{ border: "3px solid hsl(43, 80%, 50%)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="bg-[hsl(222,67%,20%)] text-white p-6 text-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[8rem] font-serif font-bold select-none pointer-events-none">अ</div>
              <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-2 rounded-full bg-white p-1" />
              <h3 className="font-serif text-lg font-bold relative z-10">{ORG_NAME}</h3>
              <p className="text-[hsl(36,100%,50%)] text-sm relative z-10 font-semibold mt-1">CERTIFICATE OF EXAMINATION RESULT</p>
              <p className="text-white/60 text-xs mt-1">Exam Date: {EXAM_DATE}</p>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <p className="font-serif text-lg rotate-[-30deg]">Official Result – BBDBASS Samiti</p>
              </div>

              <div className="text-center mb-6 relative z-10">
                <p className="text-gray-500 text-sm">This is to certify that</p>
                <p className="font-serif text-2xl font-bold text-gray-900 mt-1">{data.name || "N/A"}</p>
                <p className="text-gray-500 text-sm mt-1">S/o <span className="font-medium text-gray-700">{data.father_name || "N/A"}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs">Roll Number</p>
                  <p className="font-serif text-2xl font-bold text-[hsl(222,67%,20%)]">{data.roll_number}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-xs">Class</p>
                  <p className="font-semibold text-lg text-gray-900">{data.class ? `Class ${data.class}` : "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                <div className="text-center p-4 bg-[hsl(222,67%,20%)]/5 rounded-lg">
                  <p className="text-xs text-gray-500">Total Marks</p>
                  <p className="font-bold text-xl text-[hsl(222,67%,20%)]">{data.total}</p>
                </div>
                <div className="text-center p-4 bg-[hsl(222,67%,20%)]/5 rounded-lg">
                  <p className="text-xs text-gray-500">Percentage</p>
                  <p className="font-bold text-xl text-[hsl(222,67%,20%)]">{data.percentage}%</p>
                </div>
                <div className="text-center p-4 bg-[hsl(222,67%,20%)]/5 rounded-lg">
                  <p className="text-xs text-gray-500">Grade</p>
                  <p className="font-bold text-xl text-[hsl(222,67%,20%)]">{data.grade}</p>
                </div>
              </div>

              <div className="text-center mb-6 relative z-10">
                <Badge className={`text-base px-6 py-2 ${data.status === "PASS" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                  <Award size={18} className="mr-2" />
                  {data.status}
                </Badge>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 relative z-10 flex justify-between">
                <div>
                  <p><strong>Office:</strong> {CONTACT.office}</p>
                  <p><strong>Contact:</strong> {CONTACT.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">Authorized Signatory</p>
                  <p>{ORG_NAME.split(" ").slice(0, 3).join(" ")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="mt-6 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={handleDownloadPDF} className="flex-1 bg-primary hover:bg-primary/90">
              <Download size={18} className="mr-2" /> Download Certificate PDF
            </Button>
            <Button onClick={handleDownloadImage} variant="outline" className="flex-1">
              <Download size={18} className="mr-2" /> Download Image
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

export default ResultDetail;
