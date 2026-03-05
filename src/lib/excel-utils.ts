import * as XLSX from "xlsx";
import { type Registration } from "@/lib/supabase";
import { formatIndianDateTime, getGrade } from "@/lib/constants";

export const exportStudentsToExcel = (students: Registration[]) => {
  if (!students.length) return;

  const data = students.map((s) => ({
    "Roll Number": s.roll_number,
    "Name": s.name,
    "Father Name": s.father_name,
    "Class": s.class,
    "Group": s.group,
    "Phone": s.phone,
    "Village": s.village,
    "Registered At": s.created_at ? formatIndianDateTime(s.created_at) : "",
    "Total Marks (out of 400)": "",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");

  // Auto-width columns
  const colWidths = Object.keys(data[0]).map((key) => ({
    wch: Math.max(key.length, ...data.map((row) => String((row as any)[key]).length)) + 2,
  }));
  ws["!cols"] = colWidths;

  XLSX.writeFile(wb, "students_data.xlsx");
};

export type ParsedExcelRow = {
  roll_number: string;
  total: number;
};

export const parseExcelFile = (file: File): Promise<ParsedExcelRow[]> => {
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
          const totalRaw = row["Total Marks (out of 400)"];
          if (!rollNumber || totalRaw === undefined || totalRaw === null || totalRaw === "") continue;

          const total = parseInt(String(totalRaw)) || 0;
          if (total < 0 || total > 400) continue;

          parsed.push({ roll_number: rollNumber, total });
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

export const buildResultsFromParsed = (rows: ParsedExcelRow[]) => {
  return rows.map((r) => {
    const percentage = Math.round((r.total / 400) * 100);
    const grade = getGrade(percentage);
    const status = percentage >= 33 ? "PASS" : "FAIL";
    return {
      roll_number: r.roll_number,
      subject1: 0, subject2: 0, subject3: 0, subject4: 0,
      total: r.total, percentage, grade, status,
    };
  });
};
