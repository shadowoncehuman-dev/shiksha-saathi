import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Settings, Users, BookOpen, Upload, Download, Trash2, Edit, Search, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { type Registration, type SiteSettings } from "@/lib/supabase";
import { getGrade } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>({
    registration_status: "Not Started",
    result_status: "Not Declared",
    result_publish_date: null,
    result_expiry_date: null,
  });

  // Students state
  const [students, setStudents] = useState<Registration[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Marks state
  const [markRoll, setMarkRoll] = useState("");
  const [markStudent, setMarkStudent] = useState<Registration | null>(null);
  const [marks, setMarks] = useState({ subject1: "", subject2: "", subject3: "", subject4: "" });
  const [savingMarks, setSavingMarks] = useState(false);

  const handleLogin = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-admin", {
        body: { password },
      });
      if (error || !data?.valid) {
        toast({ title: "Access Denied", description: "Invalid password.", variant: "destructive" });
      } else {
        setAuthenticated(true);
        fetchSettings();
        fetchStudents();
      }
    } catch {
      toast({ title: "Error", description: "Failed to verify.", variant: "destructive" });
    }
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

  const deleteStudent = async (id: string) => {
    await supabase.from("registrations").delete().eq("id", id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Student Deleted" });
  };

  const exportCSV = () => {
    if (!students.length) return;
    const headers = ["Roll Number", "Name", "Father Name", "Class", "Group", "Phone", "Village"];
    const rows = students.map((s) => [s.roll_number, s.name, s.father_name, s.class, s.group, s.phone, s.village]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
  };

  const searchStudentForMarks = async () => {
    if (!markRoll.trim()) return;
    const { data } = await supabase.from("registrations").select("*").eq("roll_number", markRoll.trim()).single();
    if (data) {
      setMarkStudent(data);
      // Check existing marks
      const { data: existing } = await supabase.from("results").select("*").eq("roll_number", markRoll.trim()).single();
      if (existing) {
        setMarks({
          subject1: existing.subject1?.toString() || "",
          subject2: existing.subject2?.toString() || "",
          subject3: existing.subject3?.toString() || "",
          subject4: existing.subject4?.toString() || "",
        });
      } else {
        setMarks({ subject1: "", subject2: "", subject3: "", subject4: "" });
      }
    } else {
      toast({ title: "Student not found", variant: "destructive" });
      setMarkStudent(null);
    }
  };

  const saveMarks = async () => {
    if (!markStudent) return;
    const s1 = parseInt(marks.subject1) || 0;
    const s2 = parseInt(marks.subject2) || 0;
    const s3 = parseInt(marks.subject3) || 0;
    const s4 = parseInt(marks.subject4) || 0;
    const total = s1 + s2 + s3 + s4;
    const percentage = Math.round((total / 400) * 100);
    const grade = getGrade(percentage);
    const status = percentage >= 33 ? "PASS" : "FAIL";

    setSavingMarks(true);
    // Upsert
    const { error } = await supabase.from("results").upsert(
      {
        roll_number: markStudent.roll_number,
        subject1: s1, subject2: s2, subject3: s3, subject4: s4,
        total, percentage, grade, status,
      },
      { onConflict: "roll_number" }
    );

    if (error) {
      toast({ title: "Error saving marks", variant: "destructive" });
    } else {
      toast({ title: "Marks Saved", description: `Total: ${total}, Grade: ${grade}, ${status}` });
    }
    setSavingMarks(false);
  };

  // Login screen
  if (!authenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div
            className="glass-card gold-border rounded-xl p-8 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="text-primary" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-foreground">Admin Access</h2>
              <p className="text-muted-foreground text-sm mt-1">Enter admin password to continue</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full bg-primary" disabled={verifying}>
                {verifying ? <><Loader2 className="animate-spin mr-2" size={18} /> Verifying...</> : "Access Dashboard"}
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-6">Admin Dashboard</h2>

          <Tabs defaultValue="settings">
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="settings"><Settings size={16} className="mr-1" /> Settings</TabsTrigger>
              <TabsTrigger value="marks"><BookOpen size={16} className="mr-1" /> Add Marks</TabsTrigger>
              <TabsTrigger value="students"><Users size={16} className="mr-1" /> Students</TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Registration Control</h3>
                  <Select value={settings.registration_status} onValueChange={(v) => updateSetting("registration_status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="glass-card rounded-xl p-6 space-y-4">
                  <h3 className="font-playfair text-lg font-semibold mb-4">Result Control</h3>
                  <Select value={settings.result_status} onValueChange={(v) => updateSetting("result_status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Declared">Not Declared</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Viewing Period Ended">Viewing Period Ended</SelectItem>
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Publish Date</label>
                    <Input type="datetime-local" value={settings.result_publish_date || ""} onChange={(e) => updateSetting("result_publish_date", e.target.value || null)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Expiry Date</label>
                    <Input type="datetime-local" value={settings.result_expiry_date || ""} onChange={(e) => updateSetting("result_expiry_date", e.target.value || null)} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Add Marks Tab */}
            <TabsContent value="marks">
              <div className="glass-card rounded-xl p-6 max-w-lg">
                <h3 className="font-playfair text-lg font-semibold mb-4">Add / Update Marks</h3>
                <div className="flex gap-3 mb-4">
                  <Input placeholder="Enter Roll Number" value={markRoll} onChange={(e) => setMarkRoll(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchStudentForMarks()} />
                  <Button onClick={searchStudentForMarks} className="shrink-0"><Search size={18} /></Button>
                </div>

                {markStudent && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm"><strong>{markStudent.name}</strong> — Class {markStudent.class} ({markStudent.group})</p>
                      <p className="text-xs text-muted-foreground">Father: {markStudent.father_name}</p>
                    </div>
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n}>
                        <label className="text-sm text-muted-foreground">Subject {n} (out of 100)</label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={marks[`subject${n}` as keyof typeof marks]}
                          onChange={(e) => setMarks((prev) => ({ ...prev, [`subject${n}`]: e.target.value }))}
                        />
                      </div>
                    ))}

                    {/* Preview */}
                    {Object.values(marks).some((m) => m !== "") && (
                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        {(() => {
                          const total = [marks.subject1, marks.subject2, marks.subject3, marks.subject4].reduce((sum, v) => sum + (parseInt(v) || 0), 0);
                          const pct = Math.round((total / 400) * 100);
                          return (
                            <p>Total: <strong>{total}/400</strong> | Percentage: <strong>{pct}%</strong> | Grade: <strong>{getGrade(pct)}</strong> | {pct >= 33 ? "✅ PASS" : "❌ FAIL"}</p>
                          );
                        })()}
                      </div>
                    )}

                    <Button onClick={saveMarks} className="w-full bg-primary" disabled={savingMarks}>
                      {savingMarks ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : <><Save size={18} className="mr-2" /> Save Marks</>}
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <div className="glass-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-playfair text-lg font-semibold">Registered Students ({students.length})</h3>
                  <Button variant="outline" onClick={exportCSV} size="sm"><Download size={16} className="mr-1" /> Export CSV</Button>
                </div>

                {loadingStudents ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Roll No.</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">Father</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium">Class</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden md:table-cell">Phone</th>
                          <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden lg:table-cell">Village</th>
                          <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => (
                          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-2 px-2 font-mono font-bold text-primary">{s.roll_number}</td>
                            <td className="py-2 px-2">{s.name}</td>
                            <td className="py-2 px-2 hidden md:table-cell">{s.father_name}</td>
                            <td className="py-2 px-2">{s.class}</td>
                            <td className="py-2 px-2 hidden md:table-cell">{s.phone}</td>
                            <td className="py-2 px-2 hidden lg:table-cell">{s.village}</td>
                            <td className="py-2 px-2 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => s.id && deleteStudent(s.id)}>
                                <Trash2 size={14} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!students.length && <p className="text-center py-8 text-muted-foreground">No registrations yet.</p>}
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
