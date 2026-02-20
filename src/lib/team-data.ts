import member1 from "@/assets/team/member-1.jpg";
import member2 from "@/assets/team/member-2.jpg";
import member3 from "@/assets/team/member-3.jpg";
import member4 from "@/assets/team/member-4.jpg";
import member5 from "@/assets/team/member-5.jpg";
import member6 from "@/assets/team/member-6.jpg";
import member7 from "@/assets/team/member-7.jpg";
import member8 from "@/assets/team/member-8.jpg";
import member9 from "@/assets/team/member-9.jpg";
import member10 from "@/assets/team/member-10.jpg";
import member11 from "@/assets/team/member-11.jpg";

export interface TeamMember {
  name: string;
  role: string;
  fatherName: string;
  post: string;
  phone: string;
  photo: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Bijander Kumar",
    role: "President",
    fatherName: "Ram Lal Singh",
    post: "Lecturer",
    phone: "9917917438",
    photo: member1,
  },
  {
    name: "Ravindra Kumar Pradhan",
    role: "Vice President",
    fatherName: "Brahama Singh",
    post: "Technical Architect",
    phone: "9999752323",
    photo: member2,
  },
  {
    name: "Ravindra Kumar",
    role: "Secretary",
    fatherName: "Tejram Singh",
    post: "Government Servant",
    phone: "7520061008",
    photo: member3,
  },
  {
    name: "Devendra Kumar",
    role: "Cashier",
    fatherName: "Sh. Gangadas",
    post: "Self Employed (Computer Hardware)",
    phone: "9289692860",
    photo: member4,
  },
  {
    name: "Surendra Singh",
    role: "Co-ordinator",
    fatherName: "Bijendra Singh",
    post: "U.P.P",
    phone: "8533873692",
    photo: member5,
  },
  {
    name: "Harbir Singh",
    role: "Member",
    fatherName: "Sh. Jaipal Singh",
    post: "Inspector C.R.P.F",
    phone: "8218428057",
    photo: member6,
  },
  {
    name: "Virendra Kumar",
    role: "Member",
    fatherName: "Sh. Chhidda Singh",
    post: "Manager, Central Bank of India",
    phone: "9818071968",
    photo: member7,
  },
  {
    name: "Jitendra Kumar Azad",
    role: "Member",
    fatherName: "Harish Chand",
    post: "DESU (IPGCL / PPCL)",
    phone: "7520061008",
    photo: member8,
  },
  {
    name: "Jagmohan Singh",
    role: "Member",
    fatherName: "Shishpal Singh",
    post: "U.P.P",
    phone: "7409667324",
    photo: member9,
  },
  {
    name: "Montu Kumar",
    role: "Member",
    fatherName: "Mange Ram",
    post: "U.P.P",
    phone: "9760649628",
    photo: member10,
  },
  {
    name: "Dinesh Kumar",
    role: "Member",
    fatherName: "Bharat Lal",
    post: "U.P.P",
    phone: "9457738032",
    photo: member11,
  },
];
