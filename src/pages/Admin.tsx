import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Settings, Users, BookOpen, Download, Trash2, Search, Save, BarChart3, CheckCircle, XCircle, UserCheck, Upload, Image, UsersRound, Plus, Edit, Phone, Briefcase, FileText, Trophy } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { type Registration, type SiteSettings } from "@/lib/supabase";
import { getGrade, formatIndianDateTime } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/i18n";
import { exportStudentsToExcel, parseExcelFile, buildResultsFromParsed } from "@/lib/excel-utils";

const SUPABASE_URL = "https://qukzclnrxscrrhindgsz.supabase.co";

type TeamMemberDB = {
  id: string;
  name: string;
  role: string;
  father_name: string;
  post: string;
  phone: string;
  photo_url: string | null;
  sort_order: number;
};

type GalleryImageDB = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
};

type MarksConfig = {
  class: number;
  total_out_of: number;
};

type WinnerDB = {
  id: string;
  year: number;
  rank: number;
  name: string;
  father_name: string;
  class: number;
  group_name: string;
  roll_number: string;
  percentage: number;
  photo_url: string | null;
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();
  const { tr } = useLang();

  const [settings, setSettings] = useState<SiteSettings>({
    registration_status: "Not Started", result_status: "Not Declared",
    result_publish_date: null, result_expiry_date: null,
    exam_notice: null, exam_notice_type: "info",
  });

  const [students, setStudents] = useState<Registration[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [markRoll, setMarkRoll] = useState("");
  const [markStudent, setMarkStudent] = useState<Registration | null>(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [savingMarks, setSavingMarks] = useState(false);

  const [resultStats, setResultStats] = useState({ total: 0, pass: 0, fail: 0 });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Marks config
  const [marksConfig, setMarksConfig] = useState<MarksConfig[]>([]);
  const marksConfigMap = useMemo(() => {
    const map: Record<number, number> = {};
    marksConfig.forEach(c => { map[c.class] = c.total_out_of; });
    return map;
  }, [marksConfig]);

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMemberDB[]>([]);
  const [teamForm, setTeamForm] = useState({ name: "", role: "Member", father_name: "", post: "", phone: "" });
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamPhotoFile, setTeamPhotoFile] = useState<File | null>(null);
  const [savingTeam, setSavingTeam] = useState(false);
  const teamPhotoRef = useRef<HTMLInputElement>(null);

  // Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImageDB[]>([]);
  const [galleryForm, setGalleryForm] = useState({ title: "", category: "General" });
  const [galleryPhotoFile, setGalleryPhotoFile] = useState<File | null>(null);
  const [savingGallery, setSavingGallery] = useState(false);
  const galleryPhotoRef = useRef<HTMLInputElement>(null);

  // PDFs
  type PdfDB = { id: string; title: string; description: string; file_url: string; file_name: string; category: string; sort_order: number };
  const [pdfFiles, setPdfFiles] = useState<PdfDB[]>([]);
  const [pdfForm, setPdfForm] = useState({ title: "", description: "", category: "General" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [savingPdf, setSavingPdf] = useState(false);
  const pdfFileRef = useRef<HTMLInputElement>(null);

  // Winners
  const [winners, setWinners] = useState<WinnerDB[]>([]);
  const [winnerForm, setWinnerForm] = useState({ year: new Date().getFullYear().toString(), rank: "1", name: "", father_name: "", class: "6", group_name: "", roll_number: "", percentage: "" });
  const [editingWinnerId, setEditingWinnerId] = useState<string | null>(null);
  const [winnerPhotoFile, setWinnerPhotoFile] = useState<File | null>(null);
  const [savingWinner, setSavingWinner] = useState(false);
  const winnerPhotoRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-admin", { body: { password } });
      if (error || !data?.valid) toast({ title: "Access Denied", description: "Invalid password.", variant: "destructive" });
      else { setAuthenticated(true); fetchAll(); }
    } catch { toast({ title: "Error", description: "Failed to verify.", variant: "destructive" }); }
    setVerifying(false);
  };

  const fetchAll = useCallback(() => {
    fetchSettings(); fetchStudents(); fetchResultStats(); fetchMarksConfig(); fetchTeam(); fetchGallery(); fetchPdfs(); fetchWinners();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) setSettings(data as unknown as SiteSettings);
  };

  const updateSetting = async (key: string, value: string | null) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await supabase.from("site_settings").update({ [key]: value }).eq("id", 1);
    toast({ title: "Setting Updated" });
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    if (data) setStudents(data);
    setLoadingStudents(false);
  };

  const fetchResultStats = async () => {
    const { data } = await supabase.from("results").select("status");
    if (data) {
      setResultStats({
        total: data.length,
        pass: data.filter(r => r.status === "PASS").length,
        fail: data.filter(r => r.status === "FAIL").length,
      });
    }
  };

  const fetchMarksConfig = async () => {
    const { data } = await supabase.from("marks_config").select("*").order("class");
    if (data) setMarksConfig(data as MarksConfig[]);
  };

  const updateMarksConfig = async (cls: number, outOf: number) => {
    await supabase.from("marks_config").update({ total_out_of: outOf }).eq("class", cls);
    setMarksConfig(prev => prev.map(c => c.class === cls ? { ...c, total_out_of: outOf } : c));
    toast({ title: `Class ${cls} marks updated to ${outOf}` });
  };

  // Team CRUD
  const fetchTeam = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    if (data) setTeamMembers(data as TeamMemberDB[]);
  };

  const uploadPhoto = async (file: File, bucket: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  };

  const saveTeamMember = async () => {
    setSavingTeam(true);
    try {
      let photo_url: string | null = null;
      if (teamPhotoFile) {
        photo_url = await uploadPhoto(teamPhotoFile, "team-photos");
      }

      if (editingTeamId) {
        const updates: any = { ...teamForm };
        if (photo_url) updates.photo_url = photo_url;
        await supabase.from("team_members").update(updates).eq("id", editingTeamId);
        toast({ title: "Team member updated" });
      } else {
        await supabase.from("team_members").insert({
          ...teamForm,
          photo_url,
          sort_order: teamMembers.length,
        });
        toast({ title: "Team member added" });
      }
      resetTeamForm();
      fetchTeam();
    } catch {
      toast({ title: "Error saving team member", variant: "destructive" });
    }
    setSavingTeam(false);
  };

  const editTeamMember = (m: TeamMemberDB) => {
    setEditingTeamId(m.id);
    setTeamForm({ name: m.name, role: m.role, father_name: m.father_name, post: m.post, phone: m.phone });
    setTeamPhotoFile(null);
  };

  const deleteTeamMember = async (id: string) => {
    await supabase.from("team_members").delete().eq("id", id);
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    toast({ title: "Team member deleted" });
  };

  const resetTeamForm = () => {
    setEditingTeamId(null);
    setTeamForm({ name: "", role: "Member", father_name: "", post: "", phone: "" });
    setTeamPhotoFile(null);
    if (teamPhotoRef.current) teamPhotoRef.current.value = "";
  };

  // Gallery CRUD
  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
    if (data) setGalleryImages(data as GalleryImageDB[]);
  };

  const saveGalleryImage = async () => {
    if (!galleryPhotoFile) {
      toast({ title: "Please select a photo", variant: "destructive" });
      return;
    }
    setSavingGallery(true);
    try {
      const image_url = await uploadPhoto(galleryPhotoFile, "gallery-photos");
      await supabase.from("gallery_images").insert({
        ...galleryForm,
        image_url,
        sort_order: galleryImages.length,
      });
      toast({ title: "Gallery image added" });
      setGalleryForm({ title: "", category: "General" });
      setGalleryPhotoFile(null);
      if (galleryPhotoRef.current) galleryPhotoRef.current.value = "";
      fetchGallery();
    } catch {
      toast({ title: "Error saving gallery image", variant: "destructive" });
    }
    setSavingGallery(false);
  };

  const deleteGalleryImage = async (id: string) => {
    await supabase.from("gallery_images").delete().eq("id", id);
    setGalleryImages(prev => prev.filter(g => g.id !== id));
    toast({ title: "Gallery image deleted" });
  };

  // PDF functions
  const fetchPdfs = async () => {
    const { data } = await supabase.from("pdfs").select("*").order("sort_order", { ascending: true });
    if (data) setPdfFiles(data as PdfDB[]);
  };

  const savePdfFile = async () => {
    if (!pdfFile) return;
    setSavingPdf(true);
    try {
      const ext = pdfFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("pdf-files").upload(path, pdfFile);
      if (uploadError) throw uploadError;
      const file_url = `${SUPABASE_URL}/storage/v1/object/public/pdf-files/${path}`;
      await supabase.from("pdfs").insert({
        title: pdfForm.title || pdfFile.name,
        description: pdfForm.description,
        file_url,
        file_name: pdfFile.name,
        category: pdfForm.category || "General",
        sort_order: pdfFiles.length,
      });
      toast({ title: "PDF uploaded" });
      setPdfForm({ title: "", description: "", category: "General" });
      setPdfFile(null);
      if (pdfFileRef.current) pdfFileRef.current.value = "";
      fetchPdfs();
    } catch {
      toast({ title: "Error uploading PDF", variant: "destructive" });
    }
    setSavingPdf(false);
  };

  const deletePdf = async (id: string) => {
    await supabase.from("pdfs").delete().eq("id", id);
    setPdfFiles(prev => prev.filter(p => p.id !== id));
    toast({ title: "PDF deleted" });
  };

  const deleteStudent = async (id: string) => {
    await supabase.from("registrations").delete().eq("id", id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Student Deleted" });
  };

  // Winners CRUD
  const fetchWinners = async () => {
    const { data } = await supabase.from("winners").select("*").order("year", { ascending: false }).order("rank");
    if (data) setWinners(data as WinnerDB[]);
  };

  const saveWinner = async () => {
    setSavingWinner(true);
    try {
      let photo_url: string | null = null;
      if (winnerPhotoFile) photo_url = await uploadPhoto(winnerPhotoFile, "team-photos");

      const payload = {
        year: parseInt(winnerForm.year),
        rank: parseInt(winnerForm.rank),
        name: winnerForm.name,
        father_name: winnerForm.father_name,
        class: parseInt(winnerForm.class),
        group_name: winnerForm.group_name,
        roll_number: winnerForm.roll_number,
        percentage: parseFloat(winnerForm.percentage) || 0,
      };

      if (editingWinnerId) {
        const updates: any = { ...payload };
        if (photo_url) updates.photo_url = photo_url;
        await supabase.from("winners").update(updates).eq("id", editingWinnerId);
        toast({ title: "Winner updated" });
      } else {
        await supabase.from("winners").insert({ ...payload, photo_url });
        toast({ title: "Winner added" });
      }
      resetWinnerForm();
      fetchWinners();
    } catch {
      toast({ title: "Error saving winner", variant: "destructive" });
    }
    setSavingWinner(false);
  };

  const editWinner = (w: WinnerDB) => {
    setEditingWinnerId(w.id);
    setWinnerForm({
      year: w.year.toString(), rank: w.rank.toString(), name: w.name,
      father_name: w.father_name, class: w.class.toString(), group_name: w.group_name,
      roll_number: w.roll_number, percentage: w.percentage.toString(),
    });
    setWinnerPhotoFile(null);
  };

  const deleteWinner = async (id: string) => {
    await supabase.from("winners").delete().eq("id", id);
    setWinners(prev => prev.filter(w => w.id !== id));
    toast({ title: "Winner deleted" });
  };

  const resetWinnerForm = () => {
    setEditingWinnerId(null);
    setWinnerForm({ year: new Date().getFullYear().toString(), rank: "1", name: "", father_name: "", class: "6", group_name: "", roll_number: "", percentage: "" });
    setWinnerPhotoFile(null);
    if (winnerPhotoRef.current) winnerPhotoRef.current.value = "";
  };

  const exportExcel = () => exportStudentsToExcel(students, marksConfigMap);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const parsed = await parseExcelFile(file, marksConfigMap);
      if (!parsed.length) {
        toast({ title: "No marks found", description: "Fill the marks column in the Excel file.", variant: "destructive" });
        setUploading(false);
        return;
      }
      const results = buildResultsFromParsed(parsed, marksConfigMap);
      const { error } = await supabase.from("results").upsert(results, { onConflict: "roll_number" });
      if (error) toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Marks Uploaded", description: `${results.length} student(s) updated successfully.` });
        fetchResultStats();
      }
    } catch {
      toast({ title: "Error", description: "Failed to parse Excel file.", variant: "destructive" });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.roll_number.toLowerCase().includes(q) ||
      s.village.toLowerCase().includes(q) ||
      s.father_name.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const searchStudentForMarks = async () => {
    if (!markRoll.trim()) return;
    const { data } = await supabase.from("registrations").select("*").eq("roll_number", markRoll.trim()).single();
    if (data) {
      setMarkStudent(data);
      const { data: existing } = await supabase.from("results").select("*").eq("roll_number", markRoll.trim()).single();
      if (existing) setTotalMarks(existing.total?.toString() || "");
      else setTotalMarks("");
    } else {
      toast({ title: "Student not found", variant: "destructive" });
      setMarkStudent(null);
    }
  };

  const saveMarks = async () => {
    if (!markStudent) return;
    const total = parseInt(totalMarks) || 0;
    const outOf = marksConfigMap[markStudent.class] || 100;
    const percentage = Math.round((total / outOf) * 100);
    const grade = getGrade(percentage);
    const status = percentage >= 33 ? "PASS" : "FAIL";
    setSavingMarks(true);
    const { error } = await supabase.from("results").upsert(
      { roll_number: markStudent.roll_number, subject1: 0, subject2: 0, subject3: 0, subject4: 0, total, percentage, grade, status },
      { onConflict: "roll_number" }
    );
    if (error) toast({ title: "Error saving marks", variant: "destructive" });
    else { toast({ title: "Marks Saved", description: `Total: ${total}/${outOf}, Grade: ${grade}, ${status}` }); fetchResultStats(); }
    setSavingMarks(false);
  };

  if (!authenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="bg-card rounded-2xl p-8 w-full max-w-sm premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary" size={22} />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-foreground">Admin Access</h2>
              <p className="text-muted-foreground text-sm mt-1">Enter admin password to continue</p>
            </div>
            <div className="space-y-4">
              <Input type="password" placeholder="Enter password" className="h-11 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
              <Button onClick={handleLogin} className="w-full bg-primary h-11 rounded-xl" disabled={verifying}>
                {verifying ? <><Loader2 className="animate-spin mr-2" size={16} /> Verifying...</> : "Access Dashboard"}
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const currentOutOf = markStudent ? (marksConfigMap[markStudent.class] || 100) : 100;

  return (
    <Layout>
      <section className="pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">{tr.admin.title}</h2>
            <p className="text-muted-foreground text-sm mt-1">Manage registrations, results, team, and gallery</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: UserCheck, label: tr.admin.totalRegistrations, value: students.length, color: "text-primary" },
              { icon: BarChart3, label: tr.admin.totalResults, value: resultStats.total, color: "text-secondary" },
              { icon: CheckCircle, label: tr.admin.passCount, value: resultStats.pass, color: "text-emerald-600" },
              { icon: XCircle, label: tr.admin.failCount, value: resultStats.fail, color: "text-destructive" },
            ].map((stat) => (
              <motion.div key={stat.label} className="bg-card rounded-2xl p-5 premium-shadow border border-border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={18} className={stat.color} />
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                </div>
                <p className="font-playfair text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="settings">
            <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl">
              <TabsTrigger value="settings" className="rounded-lg text-sm"><Settings size={14} className="mr-1.5" /> Settings</TabsTrigger>
              <TabsTrigger value="marks" className="rounded-lg text-sm"><BookOpen size={14} className="mr-1.5" /> Marks</TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg text-sm"><Users size={14} className="mr-1.5" /> Students</TabsTrigger>
              <TabsTrigger value="team" className="rounded-lg text-sm"><UsersRound size={14} className="mr-1.5" /> Team</TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-lg text-sm"><Image size={14} className="mr-1.5" /> Gallery</TabsTrigger>
              <TabsTrigger value="winners" className="rounded-lg text-sm"><Trophy size={14} className="mr-1.5" /> Winners</TabsTrigger>
              <TabsTrigger value="pdfs" className="rounded-lg text-sm"><FileText size={14} className="mr-1.5" /> PDFs</TabsTrigger>
            </TabsList>

            {/* SETTINGS TAB */}
            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Registration Control</h3>
                  <Select value={settings.registration_status} onValueChange={(v) => updateSetting("registration_status", v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border space-y-4">
                  <h3 className="font-playfair text-lg font-semibold">Result Control</h3>
                  <Select value={settings.result_status} onValueChange={(v) => updateSetting("result_status", v)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Declared">Not Declared</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Viewing Period Ended">Viewing Period Ended</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">Publish Date</label>
                    <Input type="datetime-local" className="h-11 rounded-xl" value={settings.result_publish_date || ""} onChange={(e) => updateSetting("result_publish_date", e.target.value || null)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1.5">Expiry Date</label>
                    <Input type="datetime-local" className="h-11 rounded-xl" value={settings.result_expiry_date || ""} onChange={(e) => updateSetting("result_expiry_date", e.target.value || null)} />
                  </div>
                </div>

                {/* Exam Notice */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border md:col-span-2 space-y-4">
                  <h3 className="font-playfair text-lg font-semibold">Exam Notice / Cancellation</h3>
                  <p className="text-xs text-muted-foreground">Set a notice to show on Home, Register, and Result pages. "Cancelled" or "Rescheduled" will block registration.</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Notice Type</label>
                      <Select value={settings.exam_notice_type || "info"} onValueChange={(v) => updateSetting("exam_notice_type", v)}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Notice Message</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Exam cancelled due to weather conditions"
                          className="h-11 rounded-xl"
                          value={settings.exam_notice || ""}
                          onChange={(e) => setSettings(s => ({ ...s, exam_notice: e.target.value || null }))}
                        />
                        <Button
                          onClick={() => {
                            updateSetting("exam_notice", settings.exam_notice);
                          }}
                          className="shrink-0 h-11 rounded-xl"
                        >
                          <Save size={14} className="mr-1.5" /> Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  {settings.exam_notice && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-destructive hover:text-destructive"
                      onClick={() => {
                        updateSetting("exam_notice", null);
                        setSettings(s => ({ ...s, exam_notice: null }));
                      }}
                    >
                      <Trash2 size={13} className="mr-1.5" /> Clear Notice
                    </Button>
                  )}
                </div>

                {/* Marks Config */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border md:col-span-2">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Marks Configuration (Per Class)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {marksConfig.map(c => (
                      <div key={c.class} className="bg-muted/50 rounded-xl p-3">
                        <label className="text-xs text-muted-foreground font-medium block mb-1.5">Class {c.class} — Out of</label>
                        <Input
                          type="number"
                          min={50}
                          max={1000}
                          className="h-9 rounded-lg text-sm"
                          defaultValue={c.total_out_of}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value) || 400;
                            if (val !== c.total_out_of) updateMarksConfig(c.class, val);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* MARKS TAB */}
            <TabsContent value="marks">
              <div className="bg-card rounded-2xl p-6 max-w-lg premium-shadow border border-border">
                <h3 className="font-playfair text-lg font-semibold mb-4">Add / Update Marks</h3>
                <div className="flex gap-3 mb-4">
                  <Input placeholder="Enter Roll Number" className="h-11 rounded-xl" value={markRoll} onChange={(e) => setMarkRoll(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchStudentForMarks()} />
                  <Button onClick={searchStudentForMarks} className="shrink-0 h-11 w-11 rounded-xl p-0"><Search size={16} /></Button>
                </div>
                {markStudent && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-sm"><strong>{markStudent.name}</strong> — Class {markStudent.class} ({markStudent.group})</p>
                      <p className="text-xs text-muted-foreground">Father: {markStudent.father_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Total Marks (out of {currentOutOf})</label>
                      <Input type="number" min={0} max={currentOutOf} placeholder="Enter total marks" className="h-11 rounded-xl" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
                    </div>
                    {totalMarks && (
                      <div className="bg-muted/50 rounded-xl p-3 text-sm">
                        {(() => {
                          const total = parseInt(totalMarks) || 0;
                          const pct = Math.round((total / currentOutOf) * 100);
                          return <p>Total: <strong>{total}/{currentOutOf}</strong> | Percentage: <strong>{pct}%</strong> | Grade: <strong>{getGrade(pct)}</strong> | {pct >= 33 ? "✅ PASS" : "❌ FAIL"}</p>;
                        })()}
                      </div>
                    )}
                    <Button onClick={saveMarks} className="w-full bg-primary h-11 rounded-xl" disabled={savingMarks}>
                      {savingMarks ? <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</> : <><Save size={16} className="mr-2" /> Save Marks</>}
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            {/* STUDENTS TAB */}
            <TabsContent value="students">
              <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                  <h3 className="font-playfair text-lg font-semibold">Registered Students ({students.length})</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder={tr.admin.searchPlaceholder} className="h-9 rounded-lg pl-9 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Button variant="outline" onClick={exportExcel} size="sm" className="rounded-lg shrink-0"><Download size={14} className="mr-1.5" /> Excel</Button>
                    <input type="file" accept=".xlsx,.xls" ref={fileInputRef} onChange={handleExcelUpload} className="hidden" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} size="sm" className="rounded-lg shrink-0" disabled={uploading}>
                      {uploading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Upload size={14} className="mr-1.5" />} Upload Marks
                    </Button>
                  </div>
                </div>
                {loadingStudents ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={28} /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Roll No.</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Name</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs hidden md:table-cell">Father</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Class</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs hidden md:table-cell">Phone</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs hidden lg:table-cell">Registered</th>
                          <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-2 font-mono font-bold text-primary text-xs">{s.roll_number}</td>
                            <td className="py-2.5 px-2 text-xs">{s.name}</td>
                            <td className="py-2.5 px-2 hidden md:table-cell text-xs">{s.father_name}</td>
                            <td className="py-2.5 px-2 text-xs">{s.class}</td>
                            <td className="py-2.5 px-2 hidden md:table-cell text-xs">{s.phone}</td>
                            <td className="py-2.5 px-2 hidden lg:table-cell text-xs text-muted-foreground">{s.created_at ? formatIndianDateTime(s.created_at) : ""}</td>
                            <td className="py-2.5 px-2 text-right">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive rounded-lg" onClick={() => s.id && deleteStudent(s.id)}>
                                <Trash2 size={13} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!filteredStudents.length && <p className="text-center py-8 text-muted-foreground text-sm">{searchQuery ? "No matching students found." : "No registrations yet."}</p>}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TEAM TAB */}
            <TabsContent value="team">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Add/Edit Form */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">{editingTeamId ? "Edit" : "Add"} Team Member</h3>
                  <div className="space-y-3">
                    <Input placeholder="Name" className="h-10 rounded-xl" value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} />
                    <Select value={teamForm.role} onValueChange={v => setTeamForm(f => ({ ...f, role: v }))}>
                      <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["President", "Vice President", "Secretary", "Cashier", "Co-ordinator", "Auditor", "Member"].map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Father's Name" className="h-10 rounded-xl" value={teamForm.father_name} onChange={e => setTeamForm(f => ({ ...f, father_name: e.target.value }))} />
                    <Input placeholder="Post / Designation" className="h-10 rounded-xl" value={teamForm.post} onChange={e => setTeamForm(f => ({ ...f, post: e.target.value }))} />
                    <Input placeholder="Phone Number" className="h-10 rounded-xl" value={teamForm.phone} onChange={e => setTeamForm(f => ({ ...f, phone: e.target.value }))} />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Photo</label>
                      <input type="file" accept="image/*" ref={teamPhotoRef} onChange={e => setTeamPhotoFile(e.target.files?.[0] || null)} className="text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveTeamMember} className="flex-1 bg-primary h-10 rounded-xl" disabled={savingTeam || !teamForm.name}>
                        {savingTeam ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />}
                        {editingTeamId ? "Update" : "Add Member"}
                      </Button>
                      {editingTeamId && (
                        <Button variant="outline" onClick={resetTeamForm} className="rounded-xl h-10">Cancel</Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Team List */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Team Members ({teamMembers.length})</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {teamMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                        {m.photo_url ? (
                          <img src={m.photo_url} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users size={16} className="text-primary" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.role} • {m.post}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => editTeamMember(m)}>
                            <Edit size={12} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive rounded-lg" onClick={() => deleteTeamMember(m.id)}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!teamMembers.length && <p className="text-center py-4 text-muted-foreground text-sm">No team members yet.</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* GALLERY TAB */}
            <TabsContent value="gallery">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Form */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Add Gallery Image</h3>
                  <div className="space-y-3">
                    <Input placeholder="Image title" className="h-10 rounded-xl" value={galleryForm.title} onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))} />
                    <Input placeholder="Category (e.g., Annual Meeting 2025)" className="h-10 rounded-xl" value={galleryForm.category} onChange={e => setGalleryForm(f => ({ ...f, category: e.target.value }))} />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Photo</label>
                      <input type="file" accept="image/*" ref={galleryPhotoRef} onChange={e => setGalleryPhotoFile(e.target.files?.[0] || null)} className="text-sm" />
                    </div>
                    <Button onClick={saveGalleryImage} className="w-full bg-primary h-10 rounded-xl" disabled={savingGallery || !galleryPhotoFile}>
                      {savingGallery ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload size={14} className="mr-2" />}
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* Gallery Grid */}
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Gallery ({galleryImages.length})</h3>
                  <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                    {galleryImages.map(g => (
                      <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-[4/3]">
                        <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center">
                          <p className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity mb-1 px-2 text-center">{g.title || g.category}</p>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive" onClick={() => deleteGalleryImage(g.id)}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!galleryImages.length && <p className="col-span-2 text-center py-4 text-muted-foreground text-sm">No gallery images yet.</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* WINNERS TAB */}
            <TabsContent value="winners">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">{editingWinnerId ? "Edit" : "Add"} Winner</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Year" type="number" className="h-10 rounded-xl" value={winnerForm.year} onChange={e => setWinnerForm(f => ({ ...f, year: e.target.value }))} />
                      <Select value={winnerForm.rank} onValueChange={v => setWinnerForm(f => ({ ...f, rank: v }))}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Rank" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st</SelectItem>
                          <SelectItem value="2">2nd</SelectItem>
                          <SelectItem value="3">3rd</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input placeholder="Student Name" className="h-10 rounded-xl" value={winnerForm.name} onChange={e => setWinnerForm(f => ({ ...f, name: e.target.value }))} />
                    <Input placeholder="Father's Name" className="h-10 rounded-xl" value={winnerForm.father_name} onChange={e => setWinnerForm(f => ({ ...f, father_name: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={winnerForm.class} onValueChange={v => setWinnerForm(f => ({ ...f, class: v }))}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Class" /></SelectTrigger>
                        <SelectContent>
                          {[6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Percentage" type="number" className="h-10 rounded-xl" value={winnerForm.percentage} onChange={e => setWinnerForm(f => ({ ...f, percentage: e.target.value }))} />
                    </div>
                    <Input placeholder="Group Name" className="h-10 rounded-xl" value={winnerForm.group_name} onChange={e => setWinnerForm(f => ({ ...f, group_name: e.target.value }))} />
                    <Input placeholder="Roll Number" className="h-10 rounded-xl" value={winnerForm.roll_number} onChange={e => setWinnerForm(f => ({ ...f, roll_number: e.target.value }))} />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">Photo</label>
                      <input type="file" accept="image/*" ref={winnerPhotoRef} onChange={e => setWinnerPhotoFile(e.target.files?.[0] || null)} className="text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveWinner} className="flex-1 bg-primary h-10 rounded-xl" disabled={savingWinner || !winnerForm.name}>
                        {savingWinner ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />}
                        {editingWinnerId ? "Update" : "Add Winner"}
                      </Button>
                      {editingWinnerId && <Button variant="outline" onClick={resetWinnerForm} className="rounded-xl h-10">Cancel</Button>}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Winners ({winners.length})</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {winners.map(w => (
                      <div key={w.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                        {w.photo_url ? (
                          <img src={w.photo_url} alt={w.name} className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                            <Trophy size={16} className="text-secondary" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{w.name}</p>
                          <p className="text-xs text-muted-foreground">#{w.rank} • {w.year} • Class {w.class} • {w.percentage}%</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => editWinner(w)}><Edit size={12} /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive rounded-lg" onClick={() => deleteWinner(w.id)}><Trash2 size={12} /></Button>
                        </div>
                      </div>
                    ))}
                    {!winners.length && <p className="text-center py-4 text-muted-foreground text-sm">No winners yet.</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PDFs TAB */}
            <TabsContent value="pdfs">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Upload PDF</h3>
                  <div className="space-y-3">
                    <Input placeholder="Title" className="h-10 rounded-xl" value={pdfForm.title} onChange={e => setPdfForm(f => ({ ...f, title: e.target.value }))} />
                    <Input placeholder="Description (optional)" className="h-10 rounded-xl" value={pdfForm.description} onChange={e => setPdfForm(f => ({ ...f, description: e.target.value }))} />
                    <Input placeholder="Category (e.g., Syllabus)" className="h-10 rounded-xl" value={pdfForm.category} onChange={e => setPdfForm(f => ({ ...f, category: e.target.value }))} />
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1.5">PDF File</label>
                      <input type="file" accept=".pdf" ref={pdfFileRef} onChange={e => setPdfFile(e.target.files?.[0] || null)} className="text-sm" />
                    </div>
                    <Button onClick={savePdfFile} className="w-full bg-primary h-10 rounded-xl" disabled={savingPdf || !pdfFile}>
                      {savingPdf ? <Loader2 className="animate-spin mr-2" size={14} /> : <Upload size={14} className="mr-2" />}
                      Upload PDF
                    </Button>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Uploaded PDFs ({pdfFiles.length})</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {pdfFiles.map(p => (
                      <div key={p.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-destructive" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{p.title || p.file_name}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted transition-colors">
                            <Download size={12} />
                          </a>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive rounded-lg" onClick={() => deletePdf(p.id)}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!pdfFiles.length && <p className="text-center py-4 text-muted-foreground text-sm">No PDFs uploaded yet.</p>}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
