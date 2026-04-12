import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Download, Upload, Users, Search, FileSpreadsheet } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import type { Registration } from "@/lib/supabase";

const Admin2Page = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [students, setStudents] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const login = async () => {
    if (!password.trim()) return;
    setVerifying(true);
    try {
      const res = await supabase.functions.invoke("validate-admin", { body: { password } });
      if (res.data?.valid) {
        setAuthenticated(true);
        sessionStorage.setItem("admin2_auth", "1");
      } else {
        toast({ title: "Invalid password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
    setVerifying(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin2_auth")) setAuthenticated(true);
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("class", { ascending: true })
      .order("roll_number", { ascending: true });
    if (data) setStudents(data as Registration[]);
    if (error) toast({ title: "Failed to load students", variant: "destructive" });
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchStudents();
  }, [authenticated]);

  const filtered = useMemo(() => {
    let list = [...students];
    if (filterClass !== "all") list = list.filter((s) => s.class === parseInt(filterClass));
    if (filterGroup !== "all") list = list.filter((s) => s.group === filterGroup);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.roll_number.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.father_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [students, filterClass, filterGroup, search]);

  const sortForExport = (data: Registration[]) =>
    [...data].sort((a, b) => a.class - b.class || a.roll_number.localeCompare(b.roll_number, undefined, { numeric: true }));

  const exportToExcel = (data: Registration[], filename: string) => {
    const sorted = sortForExport(data);
    const rows = sorted.map((s, i) => ({
      "S.No": i + 1,
      "Roll Number": s.roll_number,
      "Name": s.name,
      "Father Name": s.father_name,
      "Class": s.class,
      "Group": s.group,
      "Phone": s.phone,
      "Village": s.village,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String((r as any)[key]).length)) + 2,
    }));
    ws["!cols"] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, filename);
  };

  const downloadAll = () => exportToExcel(students, "all_students.xlsx");
  const downloadGroup1 = () => exportToExcel(students.filter((s) => s.group === "Group 1"), "group1_students.xlsx");
  const downloadGroup2 = () => exportToExcel(students.filter((s) => s.group === "Group 2"), "group2_students.xlsx");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(data), { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

      let added = 0, updated = 0, skipped = 0;
      for (const row of rows) {
        const rollNumber = String(row["Roll Number"] || "").trim();
        const name = String(row["Name"] || "").trim();
        const fatherName = String(row["Father Name"] || "").trim();
        const studentClass = parseInt(String(row["Class"] || "0"));
        const group = String(row["Group"] || "").trim();
        const phone = String(row["Phone"] || "").trim();
        const village = String(row["Village"] || "").trim();

        if (!name || !fatherName || !studentClass) { skipped++; continue; }

        if (rollNumber) {
          // Check if exists by roll number
          const { data: existing } = await supabase
            .from("registrations")
            .select("id")
            .eq("roll_number", rollNumber)
            .maybeSingle();

          if (existing) {
            // Update existing
            await supabase
              .from("registrations")
              .update({ name, father_name: fatherName, class: studentClass, group, phone, village })
              .eq("id", existing.id);
            updated++;
          } else {
            // Insert new
            const { error } = await supabase
              .from("registrations")
              .insert({ roll_number: rollNumber, name, father_name: fatherName, class: studentClass, group, phone, village });
            if (error) skipped++;
            else added++;
          }
        } else {
          skipped++;
        }
      }

      toast({
        title: "Upload Complete",
        description: `Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`,
      });
      fetchStudents();
    } catch (err) {
      toast({ title: "Upload failed", description: String(err), variant: "destructive" });
    }
    setUploading(false);
    e.target.value = "";
  };

  if (!authenticated) {
    return (
      <Layout>
        <SEOHead title="Admin Panel — BBDBASS" description="Admin access panel" path="/admin2" />
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="bg-card rounded-2xl p-8 w-full max-w-sm premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h2 className="font-playfair text-xl font-bold text-foreground">Admin Access</h2>
              <p className="text-muted-foreground text-sm mt-1">Enter password to continue</p>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="h-11 rounded-xl"
              />
              <Button onClick={login} disabled={verifying} className="h-11 rounded-xl shrink-0">
                {verifying ? <Loader2 className="animate-spin" size={16} /> : "Login"}
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Admin Panel — BBDBASS" description="Student management panel" path="/admin2" />
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Student Management</h1>
            <p className="text-muted-foreground text-sm">
              Total Registered: <span className="font-semibold text-primary">{students.length}</span>
            </p>
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            className="bg-card rounded-2xl p-4 md:p-5 premium-shadow border border-border mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by roll, name, father name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>

              {/* Class filter */}
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-[120px] h-10 rounded-xl">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                    <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Group filter */}
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="w-[130px] h-10 rounded-xl">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="Group 1">Group 1</SelectItem>
                  <SelectItem value="Group 2">Group 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Download & Upload buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={downloadAll}>
                <Download size={14} className="mr-1.5" /> All Students
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={downloadGroup1}>
                <Download size={14} className="mr-1.5" /> Group 1
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={downloadGroup2}>
                <Download size={14} className="mr-1.5" /> Group 2
              </Button>

              <label className="inline-flex items-center gap-1.5 cursor-pointer">
                <Button variant="default" size="sm" className="rounded-xl" asChild disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Upload size={14} className="mr-1.5" />}
                    Upload Excel
                  </span>
                </Button>
                <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </motion.div>

          {/* Students Table */}
          <motion.div
            className="bg-card rounded-2xl premium-shadow border border-border overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileSpreadsheet size={40} className="mx-auto mb-3 opacity-40" />
                <p>No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Father Name</TableHead>
                      <TableHead className="w-16">Class</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Village</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s, i) => (
                      <TableRow key={s.id || i}>
                        <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell className="font-mono text-xs font-medium">{s.roll_number}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.father_name}</TableCell>
                        <TableCell className="text-center">{s.class}</TableCell>
                        <TableCell className="text-xs">{s.group}</TableCell>
                        <TableCell className="text-xs">{s.phone}</TableCell>
                        <TableCell className="text-xs">{s.village}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing {filtered.length} of {students.length} students
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Admin2Page;
