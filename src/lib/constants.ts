export const ORG_NAME = "Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti";
export const ORG_SHORT = "BBDBASS";
export const TAGLINE = "Empowering Education Through Excellence";
export const SUBHEADING = "Organizing and facilitating student examinations with integrity and innovation";

export const CONTACT = {
  phone: "9917917438",
  email: "bijanderk3@gmail.com",
  office: "Gram panchayat karyalay ,Nayagaon, Hapur, Uttar Pradesh",
};

export const EXAM_DATE = "12 April 2026";
export const EXAM_CENTER = "Govt. School, Nayagaon";

// times have changed: both groups take the exam on the same day with distinct slots
export const EXAM_GROUPS = [
  {
    name: "Group 1",
    classes: [6, 7, 8],
    // morning slot 11:00 - 12:30
    duration: "11:00–12:30",
  },
  {
    name: "Group 2",
    classes: [9, 10, 11, 12],
    // afternoon slot 14:00 - 16:00
    duration: "14:00–16:00",
  },
];

export const VILLAGES = [
  "Ahmadpur Nayagaon",
  "Kamalpur",
  "Anwarpur",
  "Kanvi",
  "Nizampur",
  "Dehpa",
  "Others",
];

export function getGroup(studentClass: number) {
  return studentClass <= 8 ? EXAM_GROUPS[0] : EXAM_GROUPS[1];
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 33) return "D";
  return "F";
}

export function formatIndianDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
