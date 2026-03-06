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
    // Countdown
    countdown: {
      title: "Exam Countdown",
      heading: "Time Until Examination",
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    // FAQ
    faq: {
      badge: "Common Questions",
      title: "Frequently Asked Questions",
      items: [
        { q: "Who can register for the examination?", a: "Students from Class 6 to Class 12 from the listed villages can register. Registration is open to all eligible students regardless of their school." },
        { q: "What is the registration process?", a: "Go to the Register page, fill in your details (name, father's name, class, phone, village), and submit. You will receive a roll number and admit card instantly." },
        { q: "What are the exam dates?", a: "The examination is scheduled for 12 April 2026 at Govt. School, Nayagaon. Group A (classes 6–8) will be held 11:00–12:30 and Group B (classes 9–12) 14:00–16:00." },
        { q: "How can I check my result?", a: "Visit the Result page and enter your roll number or search by name. Results will be available once declared by the committee." },
        { q: "What is the total marks for the exam?", a: "The examination is out of 400 marks total. Students need at least 33% to pass." },
        { q: "Can I download my admit card?", a: "Yes! After registration, you can download your admit card as PDF or image. Keep it safe for the examination day." },
        { q: "What if I lose my roll number?", a: "You can search your result by name and father's name on the Result page. For further help, contact us on WhatsApp." },
      ],
    },
    // Testimonials
    testimonials: {
      badge: "What People Say",
      title: "Voices of Our Community",
      items: [
        { name: "Rahul Kumar", role: "Student, Class 10", text: "The registration process was so smooth! I got my admit card instantly. This is the best organized exam I've ever seen." },
        { name: "Sunita Devi", role: "Parent", text: "I'm so proud that our village children get such a well-organized platform. The committee is doing amazing work for education." },
        { name: "Amit Singh", role: "Student, Class 12", text: "The online result checking saved me so much time. I could share my result with my family on WhatsApp right away!" },
        { name: "Meera Kumari", role: "Student, Class 8", text: "I was nervous about my first big exam, but the process was easy to understand. Thank you BBDBASS!" },
        { name: "Rajesh Verma", role: "Village Elder", text: "Dr. Ambedkar's vision of education for all is being fulfilled through this initiative. Keep up the great work!" },
      ],
    },
    // WhatsApp
    whatsapp: {
      shareAdmitCard: "Share on WhatsApp",
      shareResult: "Share on WhatsApp",
    },
    // 404
    notFound: {
      title: "Page Not Found",
      subtitle: "The page you're looking for doesn't exist or has been moved.",
      goHome: "Go Back Home",
    },
    // Error pages
    errors: {
      goHome: "Go Back Home",
      retry: "Try Again",
      notFound: {
        title: "Page Not Found",
        subtitle: "The page you're looking for has vanished into the digital void. It may have been moved or deleted.",
      },
      forbidden: {
        title: "Access Denied",
        subtitle: "You don't have permission to access this page. Please contact the administrator if you think this is a mistake.",
      },
      serverError: {
        title: "Server Error",
        subtitle: "Something went wrong on our end. Our team has been notified and we're working to fix it!",
      },
      serviceUnavailable: {
        title: "Service Unavailable",
        subtitle: "Our servers are temporarily down for maintenance. Please try again in a few minutes.",
      },
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
      duplicateWarning: "A student with the same name, father's name and class already exists. Please check before submitting.",
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
      totalRegistrations: "Total Registrations",
      totalResults: "Results Entered",
      passCount: "Passed",
      failCount: "Failed",
      searchPlaceholder: "Search by name, roll no, or village...",
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
    // Countdown
    countdown: {
      title: "परीक्षा उलटी गिनती",
      heading: "परीक्षा तक शेष समय",
      days: "दिन",
      hours: "घंटे",
      minutes: "मिनट",
      seconds: "सेकंड",
    },
    // FAQ
    faq: {
      badge: "सामान्य प्रश्न",
      title: "अक्सर पूछे जाने वाले प्रश्न",
      items: [
        { q: "परीक्षा के लिए कौन पंजीकरण कर सकता है?", a: "सूचीबद्ध गाँवों के कक्षा 6 से कक्षा 12 तक के छात्र पंजीकरण कर सकते हैं। पंजीकरण सभी योग्य छात्रों के लिए खुला है।" },
        { q: "पंजीकरण की प्रक्रिया क्या है?", a: "पंजीकरण पृष्ठ पर जाएं, अपना विवरण भरें (नाम, पिता का नाम, कक्षा, फोन, गाँव) और सबमिट करें। आपको तुरंत रोल नंबर और प्रवेश पत्र मिल जाएगा।" },
        { q: "परीक्षा की तिथि क्या है?", a: "परीक्षा 12 अप्रैल 2026 को सरकारी स्कूल, नयागांव में आयोजित की जाएगी। समूह A (कक्षा 6–8) सुबह 11:00–12:30 और समूह B (कक्षा 9–12) दोपहर 14:00–16:00 होगा।" },
        { q: "मैं अपना परिणाम कैसे देख सकता हूं?", a: "परिणाम पृष्ठ पर जाएं और अपना रोल नंबर दर्ज करें या नाम से खोजें। परिणाम समिति द्वारा घोषित होने पर उपलब्ध होंगे।" },
        { q: "परीक्षा में कुल कितने अंक हैं?", a: "परीक्षा कुल 400 अंकों की है। पास होने के लिए कम से कम 33% अंक आवश्यक हैं।" },
        { q: "क्या मैं अपना प्रवेश पत्र डाउनलोड कर सकता हूं?", a: "हां! पंजीकरण के बाद, आप अपना प्रवेश पत्र PDF या छवि के रूप में डाउनलोड कर सकते हैं।" },
        { q: "अगर मैं अपना रोल नंबर भूल गया तो?", a: "आप परिणाम पृष्ठ पर नाम और पिता के नाम से खोज सकते हैं। अधिक सहायता के लिए WhatsApp पर संपर्क करें।" },
      ],
    },
    // Testimonials
    testimonials: {
      badge: "लोग क्या कहते हैं",
      title: "हमारे समुदाय की आवाज़",
      items: [
        { name: "राहुल कुमार", role: "छात्र, कक्षा 10", text: "पंजीकरण प्रक्रिया बहुत आसान थी! मुझे तुरंत प्रवेश पत्र मिल गया। यह सबसे अच्छी संगठित परीक्षा है।" },
        { name: "सुनीता देवी", role: "अभिभावक", text: "मुझे गर्व है कि हमारे गाँव के बच्चों को इतना अच्छा मंच मिला है। समिति शिक्षा के लिए अद्भुत काम कर रही है।" },
        { name: "अमित सिंह", role: "छात्र, कक्षा 12", text: "ऑनलाइन परिणाम जांच ने मेरा बहुत समय बचाया। मैंने तुरंत WhatsApp पर परिवार को परिणाम भेज दिया!" },
        { name: "मीरा कुमारी", role: "छात्र, कक्षा 8", text: "मैं अपनी पहली बड़ी परीक्षा को लेकर घबराई हुई थी, लेकिन प्रक्रिया समझने में आसान थी। धन्यवाद!" },
        { name: "राजेश वर्मा", role: "गाँव के बुजुर्ग", text: "डॉ. अम्बेडकर की सभी के लिए शिक्षा की दृष्टि इस पहल से पूरी हो रही है। शानदार काम जारी रखें!" },
      ],
    },
    // WhatsApp
    whatsapp: {
      shareAdmitCard: "WhatsApp पर शेयर करें",
      shareResult: "WhatsApp पर शेयर करें",
    },
    // 404
    notFound: {
      title: "पृष्ठ नहीं मिला",
      subtitle: "आप जो पृष्ठ खोज रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दिया गया है।",
      goHome: "होम पर वापस जाएं",
    },
    // Error pages
    errors: {
      goHome: "होम पर वापस जाएं",
      retry: "फिर से कोशिश करें",
      notFound: {
        title: "पृष्ठ नहीं मिला",
        subtitle: "आप जो पृष्ठ खोज रहे हैं वह डिजिटल शून्य में गायब हो गया है। हो सकता है कि इसे हटा दिया गया हो या स्थानांतरित कर दिया गया हो।",
      },
      forbidden: {
        title: "पहुँच अस्वीकृत",
        subtitle: "आपको इस पृष्ठ तक पहुँचने की अनुमति नहीं है। अगर आपको लगता है कि यह गलती है तो कृपया व्यवस्थापक से संपर्क करें।",
      },
      serverError: {
        title: "सर्वर त्रुटि",
        subtitle: "हमारी ओर से कुछ गड़बड़ हो गई। हमारी टीम को सूचित कर दिया गया है और हम इसे ठीक करने पर काम कर रहे हैं!",
      },
      serviceUnavailable: {
        title: "सेवा अनुपलब्ध",
        subtitle: "हमारे सर्वर अस्थायी रूप से रखरखाव के लिए बंद हैं। कृपया कुछ मिनट बाद पुनः प्रयास करें।",
      },
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
      duplicateWarning: "इसी नाम, पिता के नाम और कक्षा का एक छात्र पहले से पंजीकृत है। कृपया सबमिट करने से पहले जांचें।",
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
      totalRegistrations: "कुल पंजीकरण",
      totalResults: "परिणाम दर्ज",
      passCount: "उत्तीर्ण",
      failCount: "अनुत्तीर्ण",
      searchPlaceholder: "नाम, रोल नंबर या गाँव से खोजें...",
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
