import * as XLSX from "xlsx";
import { type Registration } from "@/lib/supabase";
import { formatIndianDateTime, getGrade, EXAM_YEAR } from "@/lib/constants";

type StudentMarks = {
  roll_number: string;
  subject1: number;
  subject2: number;
  subject3: number;
  subject4: number;
  total: number;
  percentage: number;
  grade: string;
  status: string;
};

export const exportStudentsToExcel = async (
  students: Registration[],
  marksConfigMap: Record<number, number> = {},
  supabase?: any
) => {
  if (!students.length) return;

  // Fetch marks data from database if supabase is provided
  let marksMap: Record<string, StudentMarks> = {};
  if (supabase) {
    try {
      const { data: marksData } = await supabase.from("results").select("*").eq("exam_year", EXAM_YEAR);
      if (marksData) {
        marksMap = marksData.reduce((acc: Record<string, StudentMarks>, mark: StudentMarks) => {
          acc[mark.roll_number] = mark;
          return acc;
        }, {});
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  }

  const sorted = [...students].sort((a, b) => a.class - b.class || a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true }));

  const data = sorted.map((s) => {
    const outOf = marksConfigMap[s.class] || 100;
    const marks = marksMap[s.roll_number];
    
    return {
      "Roll Number": s.roll_number,
      "Name": s.name,
      "Father Name": s.father_name,
      "Class": s.class,
      "Group": s.group,
      "Phone": s.phone,
      "Village": s.village,
      "Registered At": s.created_at ? formatIndianDateTime(s.created_at) : "",
      "Subject 1": marks?.subject1 || "",
      "Subject 2": marks?.subject2 || "",
      "Subject 3": marks?.subject3 || "",
      "Subject 4": marks?.subject4 || "",
      [`Total Marks (out of ${outOf})`]: marks?.total || "",
      "Percentage": marks?.percentage || "",
      "Grade": marks?.grade || "",
      "Status": marks?.status || "",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");

  const colWidths = Object.keys(data[0]).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String((row as any)[key]).length)) + 2,
  }));
  ws["!cols"] = colWidths;

  XLSX.writeFile(wb, "students_data.xlsx");
};

export type ParsedExcelRow = {
  roll_number: string;
  total: number;
  studentClass?: number;
};

export const parseExcelFile = (file: File, marksConfigMap: Record<number, number> = {}): Promise<ParsedExcelRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

        const parsed: ParsedExcelRow[] = [];
        for (const row of rows) {
          const rollNumber = String(row["Roll Number"] || "").trim();
          const studentClass = parseInt(String(row["Class"] || "0"));
          const outOf = marksConfigMap[studentClass] || 100;

          // Find the marks column dynamically
          const marksKey = Object.keys(row).find(k => k.startsWith("Total Marks"));
          const totalRaw = marksKey ? row[marksKey] : undefined;
          if (!rollNumber || totalRaw === undefined || totalRaw === null || totalRaw === "") continue;

          const total = parseInt(String(totalRaw)) || 0;
          if (total < 0 || total > outOf) continue;

          parsed.push({ roll_number: rollNumber, total, studentClass });
        }
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

export const buildResultsFromParsed = (rows: ParsedExcelRow[], marksConfigMap: Record<number, number> = {}) => {
  return rows.map((r) => {
    const outOf = marksConfigMap[r.studentClass || 0] || 100;
    const percentage = Math.round((r.total / outOf) * 100);
    const grade = getGrade(percentage);
    const status = percentage >= 33 ? "PASS" : "FAIL";
    return {
      roll_number: r.roll_number, exam_year: EXAM_YEAR,
      subject1: 0, subject2: 0, subject3: 0, subject4: 0,
      total: r.total, percentage, grade, status,
    };
  });
};
