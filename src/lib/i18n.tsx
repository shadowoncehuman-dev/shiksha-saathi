import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "hi";

const t = {
  en: {
    // Nav
    nav: {
      home: "Home",
      examDetails: "Exam Details",
      register: "Register",
      result: "Result",
      team: "Team",
      gallery: "Gallery",
    },
    // Hero
    hero: {
      examBadge: "Exam",
      tagline: "Empowering Education Through Excellence",
      subheading: "Organizing and facilitating student examinations with integrity and innovation",
      viewExam: "View Exam Details",
      registerNow: "Register Now",
    },
    // Stats
    stats: {
      examGroups: "Exam Groups",
      classes: "Classes",
      villages: "Villages",
      students: "Students",
    },
    // Index sections
    index: {
      examinationStructure: "Examination Structure",
      examinationGroups: "Examination Groups",
      examinationGroupsDesc: "Students are divided into two groups based on their class for systematic examination.",
      duration: "Duration",
      date: "Date",
      viewDetails: "View Details",
      whoWeAre: "Who We Are",
      aboutSamiti: "About the Samiti",
      excellence: "Excellence",
      excellenceDesc: "Committed to maintaining the highest standards of educational assessment and student evaluation.",
      inclusivity: "Inclusivity",
      inclusivityDesc: "Providing equal opportunities for students across all classes from 6 to 12 to demonstrate their knowledge.",
      integrity: "Integrity",
      integrityDesc: "Ensuring transparent, fair, and secure examination processes that uphold trust and credibility.",
      moments: "Moments",
      fromGallery: "From Our Gallery",
      viewFullGallery: "View Full Gallery",
      readyToRegister: "Ready to Register?",
      readyDesc: "Join thousands of students in the Dr. B.R. Ambedkar examination. Registration is quick and easy.",
      meetTeam: "Meet Our Team",
    },
    // Exam Details
    examDetails: {
      badge: "Dr. B.R. Ambedkar Examination",
      title: "Examination Groups",
      subtitle: "Detailed information about examination groups, syllabus, and templates",
      downloads: "Downloads",
      syllabus: "Syllabus",
      template: "Template",
      topics: "Topics",
      registerNow: "Register Now",
      classes: "Classes",
    },
    // Register
    register: {
      joinUs: "Join Us",
      title: "Student Registration",
      studentName: "Student Name",
      fatherName: "Father's Name",
      class: "Class",
      phone: "Phone Number",
      village: "Village",
      selectClass: "Select class",
      selectVillage: "Select village",
      registerBtn: "Register Now",
      registering: "Registering...",
      notStarted: "Registration Not Started",
      notStartedMsg: "Registration has not started yet. Please check back later.",
      closed: "Registration Closed",
      closedMsg: "Registration is currently closed. Thank you for your interest.",
    },
    // Result
    result: {
      examination: "Examination",
      checkResult: "Check Your Result",
      byRollNumber: "By Roll Number",
      byName: "By Name",
      enterRoll: "Enter Roll Number",
      studentName: "Student Name",
      fatherName: "Father's Name",
      search: "Search",
      searching: "Searching...",
      notDeclared: "Result Not Declared",
      notDeclaredMsg: "Results will be declared soon. Please check back later.",
      viewingEnded: "Viewing Period Ended",
      viewingEndedMsg: "The result viewing period has ended. Contact the office for queries.",
    },
    // Result Detail
    resultDetail: {
      rollNumber: "Roll Number",
      studentName: "Student Name",
      fatherName: "Father's Name",
      class: "Class",
      group: "Group",
      total: "Total Marks",
      percentage: "Percentage",
      grade: "Grade",
      status: "Status",
      pass: "PASS",
      fail: "FAIL",
      downloadCert: "Download Certificate",
      downloadPDF: "Download PDF",
      print: "Print",
      back: "Back to Result",
    },
    // Admit Card
    admitCard: {
      title: "ADMIT CARD",
      group: "Group",
      studentName: "Student Name",
      fatherName: "Father's Name",
      class: "Class",
      examDate: "Exam Date",
      duration: "Duration",
      examCenter: "Exam Center",
      rollNumber: "Roll Number",
      scanDetails: "Scan for details",
      office: "Office",
      contact: "Contact",
      important: "Important",
      importantMsg: "Please download this Admit Card and keep it safe for examination and result checking.",
      downloadPDF: "Download PDF",
      downloadImage: "Download Image",
      print: "Print",
    },
    // Team
    team: {
      peopleBehind: "The People Behind",
      ourTeam: "Our Team",
      teamDesc: "Dedicated leaders and members working towards educational excellence",
      coreCommittee: "Core Committee",
      leadership: "Leadership",
      extendedTeam: "Extended Team",
      members: "Members",
      fatherName: "F/N",
    },
    // Gallery
    gallery: {
      capturedMoments: "Captured Moments",
      ourGallery: "Our Gallery",
      galleryDesc: "Moments from our events, meetings, and award ceremonies",
    },
    // Footer
    footer: {
      tagline: "Empowering Education Through Excellence. Organizing and facilitating student examinations with integrity and innovation since our founding.",
      vision: "Dedicated to Dr. B.R. Ambedkar's vision of education for all.",
      navigation: "Navigation",
      getInTouch: "Get in Touch",
      allRights: "All rights reserved.",
      builtWith: "Built with purpose. Powered by vision.",
      links: {
        home: "Home",
        examDetails: "Exam Details",
        register: "Register",
        results: "Results",
        team: "Our Team",
        gallery: "Gallery",
      },
    },
    // Admin
    admin: {
      title: "Admin Panel",
    },
  },

  hi: {
    // Nav
    nav: {
      home: "होम",
      examDetails: "परीक्षा विवरण",
      register: "पंजीकरण",
      result: "परिणाम",
      team: "टीम",
      gallery: "गैलरी",
    },
    // Hero
    hero: {
      examBadge: "परीक्षा",
      tagline: "उत्कृष्टता के माध्यम से शिक्षा सशक्तिकरण",
      subheading: "ईमानदारी और नवाचार के साथ छात्र परीक्षाओं का आयोजन एवं संचालन",
      viewExam: "परीक्षा विवरण देखें",
      registerNow: "अभी पंजीकरण करें",
    },
    // Stats
    stats: {
      examGroups: "परीक्षा समूह",
      classes: "कक्षाएं",
      villages: "गाँव",
      students: "विद्यार्थी",
    },
    // Index sections
    index: {
      examinationStructure: "परीक्षा संरचना",
      examinationGroups: "परीक्षा समूह",
      examinationGroupsDesc: "विद्यार्थियों को व्यवस्थित परीक्षा के लिए उनकी कक्षा के आधार पर दो समूहों में विभाजित किया गया है।",
      duration: "अवधि",
      date: "तिथि",
      viewDetails: "विवरण देखें",
      whoWeAre: "हम कौन हैं",
      aboutSamiti: "समिति के बारे में",
      excellence: "उत्कृष्टता",
      excellenceDesc: "शैक्षिक मूल्यांकन और छात्र मूल्यांकन के उच्चतम मानकों को बनाए रखने के लिए प्रतिबद्ध।",
      inclusivity: "समावेशिता",
      inclusivityDesc: "कक्षा 6 से 12 तक के सभी छात्रों को अपना ज्ञान प्रदर्शित करने के समान अवसर प्रदान करना।",
      integrity: "ईमानदारी",
      integrityDesc: "पारदर्शी, निष्पक्ष और सुरक्षित परीक्षा प्रक्रियाओं को सुनिश्चित करना जो विश्वास और विश्वसनीयता को बनाए रखती हैं।",
      moments: "यादगार पल",
      fromGallery: "हमारी गैलरी से",
      viewFullGallery: "पूरी गैलरी देखें",
      readyToRegister: "पंजीकरण के लिए तैयार हैं?",
      readyDesc: "डॉ. बी.आर. अम्बेडकर परीक्षा में हजारों छात्रों के साथ जुड़ें। पंजीकरण त्वरित और आसान है।",
      meetTeam: "हमारी टीम से मिलें",
    },
    // Exam Details
    examDetails: {
      badge: "डॉ. बी.आर. अम्बेडकर परीक्षा",
      title: "परीक्षा समूह",
      subtitle: "परीक्षा समूहों, पाठ्यक्रम और टेम्पलेट के बारे में विस्तृत जानकारी",
      downloads: "डाउनलोड",
      syllabus: "पाठ्यक्रम",
      template: "टेम्पलेट",
      topics: "विषय",
      registerNow: "अभी पंजीकरण करें",
      classes: "कक्षाएं",
    },
    // Register
    register: {
      joinUs: "जुड़ें",
      title: "छात्र पंजीकरण",
      studentName: "छात्र का नाम",
      fatherName: "पिता का नाम",
      class: "कक्षा",
      phone: "फोन नंबर",
      village: "गाँव",
      selectClass: "कक्षा चुनें",
      selectVillage: "गाँव चुनें",
      registerBtn: "अभी पंजीकरण करें",
      registering: "पंजीकरण हो रहा है...",
      notStarted: "पंजीकरण शुरू नहीं हुआ",
      notStartedMsg: "पंजीकरण अभी शुरू नहीं हुआ है। कृपया बाद में जाँचें।",
      closed: "पंजीकरण बंद है",
      closedMsg: "पंजीकरण वर्तमान में बंद है। आपकी रुचि के लिए धन्यवाद।",
    },
    // Result
    result: {
      examination: "परीक्षा",
      checkResult: "अपना परिणाम देखें",
      byRollNumber: "रोल नंबर से",
      byName: "नाम से",
      enterRoll: "रोल नंबर दर्ज करें",
      studentName: "छात्र का नाम",
      fatherName: "पिता का नाम",
      search: "खोजें",
      searching: "खोज रहे हैं...",
      notDeclared: "परिणाम घोषित नहीं हुआ",
      notDeclaredMsg: "परिणाम जल्द ही घोषित किए जाएंगे। कृपया बाद में जाँचें।",
      viewingEnded: "देखने की अवधि समाप्त",
      viewingEndedMsg: "परिणाम देखने की अवधि समाप्त हो गई है। प्रश्नों के लिए कार्यालय से संपर्क करें।",
    },
    // Result Detail
    resultDetail: {
      rollNumber: "रोल नंबर",
      studentName: "छात्र का नाम",
      fatherName: "पिता का नाम",
      class: "कक्षा",
      group: "समूह",
      total: "कुल अंक",
      percentage: "प्रतिशत",
      grade: "ग्रेड",
      status: "स्थिति",
      pass: "उत्तीर्ण",
      fail: "अनुत्तीर्ण",
      downloadCert: "प्रमाण पत्र डाउनलोड करें",
      downloadPDF: "PDF डाउनलोड करें",
      print: "प्रिंट करें",
      back: "परिणाम पर वापस जाएं",
    },
    // Admit Card
    admitCard: {
      title: "प्रवेश पत्र",
      group: "समूह",
      studentName: "छात्र का नाम",
      fatherName: "पिता का नाम",
      class: "कक्षा",
      examDate: "परीक्षा तिथि",
      duration: "अवधि",
      examCenter: "परीक्षा केंद्र",
      rollNumber: "रोल नंबर",
      scanDetails: "विवरण के लिए स्कैन करें",
      office: "कार्यालय",
      contact: "संपर्क",
      important: "महत्वपूर्ण",
      importantMsg: "कृपया यह प्रवेश पत्र डाउनलोड करें और परीक्षा और परिणाम जाँच के लिए सुरक्षित रखें।",
      downloadPDF: "PDF डाउनलोड करें",
      downloadImage: "छवि डाउनलोड करें",
      print: "प्रिंट करें",
    },
    // Team
    team: {
      peopleBehind: "जो लोग इसे चलाते हैं",
      ourTeam: "हमारी टीम",
      teamDesc: "शैक्षिक उत्कृष्टता के लिए कार्यरत समर्पित नेता और सदस्य",
      coreCommittee: "मुख्य समिति",
      leadership: "नेतृत्व",
      extendedTeam: "विस्तारित टीम",
      members: "सदस्य",
      fatherName: "पिता का नाम",
    },
    // Gallery
    gallery: {
      capturedMoments: "यादगार पल",
      ourGallery: "हमारी गैलरी",
      galleryDesc: "हमारे कार्यक्रमों, बैठकों और पुरस्कार समारोहों के पल",
    },
    // Footer
    footer: {
      tagline: "उत्कृष्टता के माध्यम से शिक्षा सशक्तिकरण। स्थापना से ईमानदारी और नवाचार के साथ छात्र परीक्षाओं का आयोजन।",
      vision: "डॉ. बी.आर. अम्बेडकर की सभी के लिए शिक्षा की दृष्टि को समर्पित।",
      navigation: "नेविगेशन",
      getInTouch: "संपर्क करें",
      allRights: "सर्वाधिकार सुरक्षित।",
      builtWith: "उद्देश्य के साथ बनाया। दृष्टि से संचालित।",
      links: {
        home: "होम",
        examDetails: "परीक्षा विवरण",
        register: "पंजीकरण",
        results: "परिणाम",
        team: "हमारी टीम",
        gallery: "गैलरी",
      },
    },
    // Admin
    admin: {
      title: "व्यवस्थापक पैनल",
    },
  },
};

type Translations = typeof t.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  tr: t.en,
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "en";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, tr: t[lang] }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
export default t;
