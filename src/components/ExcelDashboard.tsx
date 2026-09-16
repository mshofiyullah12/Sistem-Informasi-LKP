import React, { useMemo } from "react";
import { Users, UserCheck, Briefcase, Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Activity, GraduationCap, Clock, FileText, Settings, UserPlus, FileSpreadsheet, Receipt, BookOpen, MessageSquare, Database } from "lucide-react";
import { formatRupiah } from "../utils/excelExport";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ExcelDashboard({
  siswa,
  staff,
  absensi,
  keuangan,
  pembayaranLog,
  pendapatanLain,
  pengeluaranKas,
  payroll,
  utangPegawai,
  onSwitchSheet
}: any) {
  const stats = useMemo(() => {
    const totalSiswa = siswa.length;
    const siswaAktif = siswa.filter((s: any) => s.status === "Aktif").length;
    const totalStaff = staff.length;
    const staffAktif = staff.filter((s: any) => s.status === "Aktif").length;

    const totalSPPMasuk = pembayaranLog.reduce((sum: number, log: any) => sum + (log.jumlahBayar || 0), 0);
    const totalPendapatanLain = pendapatanLain.reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);
    const totalPemasukan = totalSPPMasuk + totalPendapatanLain;

    const totalPengeluaranLain = pengeluaranKas.reduce((sum: number, p: any) => sum + (p.jumlah || 0), 0);
    const totalGajiDibayar = payroll.filter((p: any) => p.statusGaji === "Sudah Dibayar").reduce((sum: number, p: any) => sum + (p.totalGaji || 0), 0);
    const totalPengeluaran = totalPengeluaranLain + totalGajiDibayar;

    const saldoKas = totalPemasukan - totalPengeluaran;

    const totalTunggakanSPP = keuangan.reduce((sum: number, k: any) => sum + (k.piutang || 0), 0);
    const totalPiutangKaryawan = utangPegawai.reduce((sum: number, u: any) => sum + (u.sisaUtang || 0), 0);

    return {
      totalSiswa,
      siswaAktif,
      totalStaff,
      staffAktif,
      totalPemasukan,
      totalPengeluaran,
      saldoKas,
      totalTunggakanSPP,
      totalPiutangKaryawan
    };
  }, [siswa, staff, keuangan, pembayaranLog, pendapatanLain, pengeluaranKas, payroll, utangPegawai]);

  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const data = months.map(m => ({ name: m, Pemasukan: 0, Pengeluaran: 0 }));
    
    pembayaranLog.forEach((log: any) => {
      const d = new Date(log.tanggalBayar);
      if (!isNaN(d.getTime())) {
        data[d.getMonth()].Pemasukan += log.jumlahBayar || 0;
      }
    });
    pendapatanLain.forEach((log: any) => {
      const d = new Date(log.tanggalPendapatan);
      if (!isNaN(d.getTime())) {
        data[d.getMonth()].Pemasukan += log.jumlah || 0;
      }
    });

    pengeluaranKas.forEach((log: any) => {
      const d = new Date(log.tanggalPengeluaran);
      if (!isNaN(d.getTime())) {
        data[d.getMonth()].Pengeluaran += log.jumlah || 0;
      }
    });
    payroll.forEach((log: any) => {
      if (log.statusGaji === "Sudah Dibayar") {
        const d = new Date(log.tanggalBayar);
        if (!isNaN(d.getTime())) {
          data[d.getMonth()].Pengeluaran += log.totalGaji || 0;
        }
      }
    });

    return data;
  }, [pembayaranLog, pendapatanLain, pengeluaranKas, payroll]);

  const quickNavs = [
    { name: "Buku Induk Siswa", sheet: "Siswa", icon: GraduationCap, color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100" },
    { name: "Staf & Instruktur", sheet: "Staf & Instruktur", icon: UserCheck, color: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100" },
    { name: "Absensi Siswa", sheet: "Absensi Siswa", icon: Clock, color: "bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100" },
    { name: "Absensi Instruktur", sheet: "Absensi Instruktur", icon: Clock, color: "bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100" },
    { name: "Keuangan & Tunggakan", sheet: "Keuangan & Tunggakan Siswa", icon: CreditCard, color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" },
    { name: "Tagihan WA", sheet: "Tunggakan Siswa", icon: MessageSquare, color: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" },
    { name: "Kas Operasional", sheet: "Kas Operasional", icon: Wallet, color: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" },
    { name: "Laporan Keuangan", sheet: "Laporan Keuangan", icon: FileSpreadsheet, color: "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100" },
    { name: "Payroll Gaji", sheet: "Payroll Gaji", icon: Receipt, color: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100" },
    { name: "Utang Pegawai", sheet: "Utang Pegawai", icon: Activity, color: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" },
    { name: "Bursa Kerja (Job)", sheet: "Lowongan / Job", icon: Briefcase, color: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100" },
    { name: "Modul Ajar", sheet: "Modul Ajar", icon: BookOpen, color: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100" },
    { name: "Rekap Penilaian", sheet: "Rekap Penilaian Siswa", icon: FileText, color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-100" },
    { name: "Akun Pengguna", sheet: "Data Pengguna", icon: UserPlus, color: "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" },
    { name: "Integrasi SQL", sheet: "Audit & Hosting", icon: Database, color: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100" },
    { name: "Pengaturan", sheet: "Pengaturan", icon: Settings, color: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
      <div className="p-5 md:p-8 border-b border-slate-200 bg-white">
        <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
            <span className="text-3xl">📊</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
              Ringkasan Eksekutif & Dashboard Keuangan LPK Nandita
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-3xl leading-relaxed">
              Sistem Informasi Terpadu & Buku Induk Siswa LPK Nandita Floating Hotel Perhotelan dan Kapal Pesiar
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        
        {/* Sistem Navigasi Cepat (Sistem Terpadu) */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" /> Navigasi Modul Sistem Terpadu
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {quickNavs.map((nav, idx) => {
              const Icon = nav.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onSwitchSheet(nav.sheet)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all transform hover:-translate-y-1 ${nav.color} shadow-sm`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{nav.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Buku Induk Siswa Aktif</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.siswaAktif} <span className="text-sm font-medium text-slate-400">/ {stats.totalSiswa}</span></h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
              <GraduationCap size={20} />
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Staff & Instruktur</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.staffAktif} <span className="text-sm font-medium text-slate-400">/ {stats.totalStaff}</span></h3>
            </div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-200">
              <UserCheck size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Manajemen Kas</p>
              <h3 className={`text-xl font-black tracking-tight ${stats.saldoKas >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatRupiah(stats.saldoKas)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
              <Wallet size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tagihan & Tunggakan SPP</p>
              <h3 className="text-xl font-black tracking-tight text-red-600">{formatRupiah(stats.totalTunggakanSPP)}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center border border-rose-200">
              <CreditCard size={20} />
            </div>
          </div>
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Grafik Arus Kas & Laporan Keuangan</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}M`} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    formatter={(value: number) => formatRupiah(value)} 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#colorPemasukan)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorPengeluaran)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Ringkasan Pendapatan & Pengeluaran</h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <ArrowUpRight size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
                      <p className="text-sm font-black text-slate-800">{formatRupiah(stats.totalPemasukan)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-px w-full bg-slate-100"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                      <ArrowDownRight size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</p>
                      <p className="text-sm font-black text-slate-800">{formatRupiah(stats.totalPengeluaran)}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Piutang / Kasbon Staf</p>
                      <p className="text-sm font-black text-slate-800">{formatRupiah(stats.totalPiutangKaryawan)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => onSwitchSheet("Laporan Keuangan")}
                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-md flex items-center justify-center gap-2"
              >
                <FileSpreadsheet size={16} /> Buka Laporan Lengkap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
