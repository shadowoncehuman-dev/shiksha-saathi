import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Settings, Users, BookOpen, Download, Trash2, Search, Save, BarChart3, CheckCircle, XCircle, UserCheck, Upload } from "lucide-react";
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

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();
  const { tr } = useLang();

  const [settings, setSettings] = useState<SiteSettings>({
    registration_status: "Not Started", result_status: "Not Declared",
    result_publish_date: null, result_expiry_date: null,
  });

  const [students, setStudents] = useState<Registration[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [markRoll, setMarkRoll] = useState("");
  const [markStudent, setMarkStudent] = useState<Registration | null>(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [savingMarks, setSavingMarks] = useState(false);

  // Dashboard stats
  const [resultStats, setResultStats] = useState({ total: 0, pass: 0, fail: 0 });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-admin", { body: { password } });
      if (error || !data?.valid) toast({ title: "Access Denied", description: "Invalid password.", variant: "destructive" });
      else { setAuthenticated(true); fetchSettings(); fetchStudents(); fetchResultStats(); }
    } catch { toast({ title: "Error", description: "Failed to verify.", variant: "destructive" }); }
    setVerifying(false);
  };

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

  const deleteStudent = async (id: string) => {
    await supabase.from("registrations").delete().eq("id", id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Student Deleted" });
  };

  const exportExcel = () => exportStudentsToExcel(students);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const parsed = await parseExcelFile(file);
      if (!parsed.length) {
        toast({ title: "No marks found", description: "Fill the 'Total Marks (out of 400)' column in the Excel file.", variant: "destructive" });
        setUploading(false);
        return;
      }
      const results = buildResultsFromParsed(parsed);
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
    const percentage = Math.round((total / 400) * 100);
    const grade = getGrade(percentage);
    const status = percentage >= 33 ? "PASS" : "FAIL";
    setSavingMarks(true);
    const { error } = await supabase.from("results").upsert(
      { roll_number: markStudent.roll_number, subject1: 0, subject2: 0, subject3: 0, subject4: 0, total, percentage, grade, status },
      { onConflict: "roll_number" }
    );
    if (error) toast({ title: "Error saving marks", variant: "destructive" });
    else { toast({ title: "Marks Saved", description: `Total: ${total}, Grade: ${grade}, ${status}` }); fetchResultStats(); }
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

  return (
    <Layout>
      <section className="pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">{tr.admin.title}</h2>
            <p className="text-muted-foreground text-sm mt-1">Manage registrations, results, and settings</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: UserCheck, label: tr.admin.totalRegistrations, value: students.length, color: "text-primary" },
              { icon: BarChart3, label: tr.admin.totalResults, value: resultStats.total, color: "text-secondary" },
              { icon: CheckCircle, label: tr.admin.passCount, value: resultStats.pass, color: "text-emerald-600" },
              { icon: XCircle, label: tr.admin.failCount, value: resultStats.fail, color: "text-destructive" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="bg-card rounded-2xl p-5 premium-shadow border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
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
              <TabsTrigger value="marks" className="rounded-lg text-sm"><BookOpen size={14} className="mr-1.5" /> Add Marks</TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg text-sm"><Users size={14} className="mr-1.5" /> Students</TabsTrigger>
            </TabsList>

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
              </div>
            </TabsContent>

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
                      <label className="text-sm text-muted-foreground block mb-1.5">Total Marks (out of 400)</label>
                      <Input type="number" min={0} max={400} placeholder="Enter total marks" className="h-11 rounded-xl" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
                    </div>
                    {totalMarks && (
                      <div className="bg-muted/50 rounded-xl p-3 text-sm">
                        {(() => {
                          const total = parseInt(totalMarks) || 0;
                          const pct = Math.round((total / 400) * 100);
                          return <p>Total: <strong>{total}/400</strong> | Percentage: <strong>{pct}%</strong> | Grade: <strong>{getGrade(pct)}</strong> | {pct >= 33 ? "✅ PASS" : "❌ FAIL"}</p>;
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

            <TabsContent value="students">
              <div className="bg-card rounded-2xl p-6 premium-shadow border border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                  <h3 className="font-playfair text-lg font-semibold">Registered Students ({students.length})</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={tr.admin.searchPlaceholder}
                        className="h-9 rounded-lg pl-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
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
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
