import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Search, Users, QrCode, Edit2, Save, X, CheckCircle2, XCircle, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Registration } from "@/lib/supabase";

const ITEMS_PER_PAGE = 20;

const Invigilator = () => {
  const [searchParams] = useSearchParams();
  const verifyRoll = searchParams.get("verify");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { tr } = useLang();
  const { toast } = useToast();

  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.functions.invoke("validate-invigilator", {
        body: { password },
      });
      if (error || !data?.valid) {
        setAuthError(tr.invigilator?.wrongPassword || "Wrong password");
      } else {
        setAuthenticated(true);
      }
    } catch {
      setAuthError("Connection error");
    }
    setAuthLoading(false);
  };

  if (!authenticated) {
    return (
      <Layout>
        <SEOHead title="Invigilator Login" description="Invigilator dashboard login" path="/invigilator" />
        <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
          <motion.div className="bg-card rounded-2xl p-8 max-w-sm w-full premium-shadow border border-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Shield className="text-primary" size={24} />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-foreground text-center mb-6">
              {tr.invigilator?.title || "Invigilator Dashboard"}
            </h2>
            {authError && <p className="text-destructive text-sm text-center mb-4">{authError}</p>}
            <div className="space-y-4">
              <Input
                type="password"
                placeholder={tr.invigilator?.enterPassword || "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 rounded-xl"
              />
              <Button onClick={handleLogin} disabled={authLoading} className="w-full h-11 rounded-xl">
                {authLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                {tr.invigilator?.login || "Login"}
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Invigilator Dashboard" description="Manage students and verify admit cards" path="/invigilator" />
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
              {tr.invigilator?.title || "Invigilator Dashboard"}
            </h1>
            <div className="section-divider" />
          </motion.div>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search size={16} /> {tr.invigilator?.searchTab || "Search"}
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users size={16} /> {tr.invigilator?.allStudentsTab || "All Students"}
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode size={16} /> {tr.invigilator?.qrTab || "QR Scanner"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search"><SearchTab initialQuery={verifyRoll || ""} /></TabsContent>
            <TabsContent value="all"><AllStudentsTab /></TabsContent>
            <TabsContent value="qr"><QRScannerTab /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

// ==================== SEARCH TAB ====================
const SearchTab = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Registration[]>([]);
  const [searching, setSearching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Registration>>({});
  const { toast } = useToast();
  const { tr } = useLang();

  const doSearch = useCallback(async (qParam?: string | React.MouseEvent) => {
    const qValue = typeof qParam === 'string' ? qParam : query;
    const q = qValue.trim();
    if (!q) return;
    setSearching(true);
    // Try roll number, name, father_name, or phone
    let { data } = await supabase
      .from("registrations")
      .select("*")
      .or(`roll_number.eq.${q},name.ilike.%${q}%,father_name.ilike.%${q}%,phone.ilike.%${q}%`)
      .order("class")
      .limit(50);
    setResults(data || []);
    setSearching(false);
  }, [query]);

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery, doSearch]);

  const startEdit = (r: Registration) => {
    setEditingId(r.id!);
    setEditData({ name: r.name, father_name: r.father_name, class: r.class, village: r.village, phone: r.phone });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("registrations").update(editData).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved" });
      setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...editData } : r)));
    }
    setEditingId(null);
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border premium-shadow">
      <div className="flex gap-3 mb-6">
        <Input
          placeholder={tr.invigilator?.searchPlaceholder || "Search by roll number, name, or phone..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          className="h-11 rounded-xl"
        />
        <Button onClick={doSearch} disabled={searching} className="h-11 rounded-xl px-6">
          {searching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
        </Button>
      </div>

      {results.length === 0 && !searching && (
        <p className="text-muted-foreground text-center py-8">{tr.invigilator?.noResults || "No students found"}</p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <div key={r.id} className="border border-border rounded-xl p-4">
            {editingId === r.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Name" className="h-9 rounded-lg text-sm" />
                  <Input value={editData.father_name || ""} onChange={(e) => setEditData({ ...editData, father_name: e.target.value })} placeholder="Father's Name" className="h-9 rounded-lg text-sm" />
                  <Select value={String(editData.class)} onValueChange={(v) => setEditData({ ...editData, class: parseInt(v) })}>
                    <SelectTrigger className="h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{[6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Phone" className="h-9 rounded-lg text-sm" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(r.id!)} className="rounded-lg"><Save size={14} className="mr-1" /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="rounded-lg"><X size={14} className="mr-1" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{r.name} <span className="text-muted-foreground text-sm">s/o {r.father_name}</span></p>
                  <p className="text-sm text-muted-foreground">Roll: {r.roll_number} | Class {r.class} | {r.group} | {r.village} | {r.phone}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => startEdit(r)} className="rounded-lg"><Edit2 size={14} /></Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== ALL STUDENTS TAB ====================
const AllStudentsTab = () => {
  const [students, setStudents] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filterClass, setFilterClass] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Registration>>({});
  const { toast } = useToast();
  const { tr } = useLang();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("registrations").select("*", { count: "exact" });
    if (filterClass !== "all") query = query.eq("class", parseInt(filterClass));
    const { data, count } = await query.order("roll_number").range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
    setStudents(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, filterClass]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("registrations").update(editData).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved" });
      setStudents((prev) => prev.map((r) => (r.id === id ? { ...r, ...editData } : r)));
    }
    setEditingId(null);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border premium-shadow">
      <div className="flex items-center gap-3 mb-4">
        <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setPage(0); }}>
          <SelectTrigger className="w-40 h-9 rounded-lg text-sm"><SelectValue placeholder="Filter class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {[6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={String(c)}>Class {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">{total} students</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Father's Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-sm">{s.roll_number}</TableCell>
                    {editingId === s.id ? (
                      <>
                        <TableCell><Input value={editData.name || ""} onChange={(e) => setEditData({...editData, name: e.target.value})} className="h-8 text-sm rounded-lg" /></TableCell>
                        <TableCell><Input value={editData.father_name || ""} onChange={(e) => setEditData({...editData, father_name: e.target.value})} className="h-8 text-sm rounded-lg" /></TableCell>
                        <TableCell>
                          <Select value={String(editData.class)} onValueChange={(v) => setEditData({...editData, class: parseInt(v)})}>
                            <SelectTrigger className="h-8 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent>{[6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={String(c)}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Input value={editData.village || ""} onChange={(e) => setEditData({...editData, village: e.target.value})} className="h-8 text-sm rounded-lg" /></TableCell>
                        <TableCell><Input value={editData.phone || ""} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="h-8 text-sm rounded-lg" /></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(s.id!)}><Save size={14} /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X size={14} /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.father_name}</TableCell>
                        <TableCell>{s.class}</TableCell>
                        <TableCell>{s.village}</TableCell>
                        <TableCell>{s.phone}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => { setEditingId(s.id!); setEditData({ name: s.name, father_name: s.father_name, class: s.class, village: s.village, phone: s.phone }); }}>
                            <Edit2 size={14} />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-lg">Prev</Button>
              <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="rounded-lg">Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== QR SCANNER TAB ====================
const QRScannerTab = () => {
  const [scanResult, setScanResult] = useState<Registration | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { tr } = useLang();

  const startScanner = async () => {
    setScanResult(null);
    setScanError(null);
    setScanning(true);
    
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      
      if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch {}
      }
      
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          try {
            await scanner.stop();
            setScanning(false);
            
            // Try parsing QR data
            let qrData: any;
            try {
              qrData = JSON.parse(decodedText);
            } catch {
              // Maybe it's just a roll number
              qrData = { roll_number: decodedText };
            }
            
            const rollNumber = qrData.roll_number || qrData.rollNumber || decodedText;
            const { data } = await supabase
              .from("registrations")
              .select("*")
              .eq("roll_number", rollNumber)
              .single();
            
            if (data) {
              setScanResult(data as Registration);
              setScanError(null);
            } else {
              setScanError(tr.invigilator?.studentNotFound || "Student not found in database");
            }
          } catch (err: any) {
            setScanError(err.message || "Verification failed");
          }
        },
        () => {} // ignore scan failures
      );
    } catch (err: any) {
      setScanError("Camera error: " + (err.message || err));
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border premium-shadow">
      <div className="text-center mb-6">
        <p className="text-muted-foreground text-sm mb-4">
          {tr.invigilator?.qrInstructions || "Scan the QR code on the student's admit card to verify their identity"}
        </p>
        {!scanning ? (
          <Button onClick={startScanner} className="rounded-xl h-11">
            <QrCode size={16} className="mr-2" /> {tr.invigilator?.startScan || "Start Scanner"}
          </Button>
        ) : (
          <Button onClick={stopScanner} variant="outline" className="rounded-xl h-11">
            <X size={16} className="mr-2" /> {tr.invigilator?.stopScan || "Stop Scanner"}
          </Button>
        )}
      </div>

      <div id="qr-reader" ref={containerRef} className="mx-auto max-w-sm rounded-xl overflow-hidden" />

      {scanResult && (
        <motion.div
          className="mt-6 p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="text-green-500" size={28} />
            <h3 className="text-lg font-bold text-green-600 dark:text-green-400">{tr.invigilator?.verified || "Student Verified"}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Roll:</span> <span className="font-mono font-semibold">{scanResult.roll_number}</span></div>
            <div><span className="text-muted-foreground">Name:</span> <span className="font-semibold">{scanResult.name}</span></div>
            <div><span className="text-muted-foreground">Father:</span> <span>{scanResult.father_name}</span></div>
            <div><span className="text-muted-foreground">Class:</span> <span>{scanResult.class}</span></div>
            <div><span className="text-muted-foreground">Group:</span> <span>{scanResult.group}</span></div>
            <div><span className="text-muted-foreground">Village:</span> <span>{scanResult.village}</span></div>
          </div>
        </motion.div>
      )}

      {scanError && (
        <motion.div
          className="mt-6 p-6 rounded-xl border-2 border-destructive/30 bg-destructive/5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <XCircle className="text-destructive" size={28} />
            <div>
              <h3 className="text-lg font-bold text-destructive">{tr.invigilator?.notVerified || "Verification Failed"}</h3>
              <p className="text-sm text-muted-foreground">{scanError}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Invigilator;
