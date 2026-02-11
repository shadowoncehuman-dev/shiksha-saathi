export const ORG_NAME = "Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti";
export const ORG_SHORT = "BBDBASS";
export const TAGLINE = "Empowering Education Through Excellence";
export const SUBHEADING = "Organizing and facilitating student examinations with integrity and innovation";

export const CONTACT = {
  phone: "9917917438",
  email: "bijanderk3@gmail.com",
  office: "Pradhan Office, Nayagaon",
};

export const EXAM_DATE = "10–14 April 2026";

export const EXAM_GROUPS = [
  {
    name: "Group 1",
    classes: [6, 7, 8],
    duration: "2 Hours",
  },
  {
    name: "Group 2",
    classes: [9, 10, 11, 12],
    duration: "3 Hours",
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
