import React, { useState, useMemo } from "react";
import { Plus, Trash2, Calendar, FileText, Search, Clock, Save, X, Filter } from "lucide-react";

export default function AbsensiSheet({
  absensi,
  siswa,
  staff,
  onAddAbsensi,
  onUpdateAbsensi,
  onDeleteAbsensi,
  onBulkGenerateAbsensi,
  viewMode,
  schoolSettings
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const today = new Date().toISOString().split("T")[0];
  
  const [formData, setFormData] = useState({
    date: today,
    studentId: "",
    status: "Hadir",
    timeIn: "",
    timeOut: "",
    notes: ""
  });

  const activePeople = viewMode === "Siswa" ? siswa : staff;
  
  // Filter Data
  const filteredData = useMemo(() => {
    return absensi.filter((a: any) => {
      // Filter based on viewMode (Siswa vs Staff)
      const person = activePeople.find((p: any) => p.id === a.studentId);
      if (!person) return false;
      
      // Filter by search (name)
      const matchesSearch = a.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === "Semua" || a.status === statusFilter;
      
      // Filter by date range
      let matchesDate = true;
      if (dateFilterStart && dateFilterEnd) {
        matchesDate = a.date >= dateFilterStart && a.date <= dateFilterEnd;
      } else if (dateFilterStart) {
        matchesDate = a.date >= dateFilterStart;
      } else if (dateFilterEnd) {
        matchesDate = a.date <= dateFilterEnd;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [absensi, activePeople, searchTerm, statusFilter, dateFilterStart, dateFilterEnd]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = activePeople.find((p: any) => p.id === formData.studentId);
    if (!person) return;

    if (editingId) {
      onUpdateAbsensi(editingId, {
        ...formData,
        studentName: person.nama
      });
    } else {
      onAddAbsensi({
        id: Date.now().toString(),
        ...formData,
        studentName: person.nama
      });
    }
    closeForm();
  };

  const handleEdit = (record: any) => {
    setFormData({
      date: record.date || today,
      studentId: record.studentId || "",
      status: record.status || "Hadir",
      timeIn: record.timeIn || "",
      timeOut: record.timeOut || "",
      notes: record.notes || ""
    });
    setEditingId(record.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      date: today,
      studentId: "",
      status: "Hadir",
      timeIn: "",
      timeOut: "",
      notes: ""
    });
  };

  const handleBulkToday = () => {
    if(window.confirm(`Generate absensi 'Hadir' untuk semua ${viewMode} aktif hari ini?`)) {
      onBulkGenerateAbsensi(viewMode);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
      <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Absensi {viewMode}</h2>
          <p className="text-sm text-slate-500">Kelola dan filter data kehadiran {viewMode.toLowerCase()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleBulkToday}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-medium transition"
          >
            <Calendar size={16} /> Generate Hadir Hari Ini
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} /> Input Absen Manual
          </button>
        </div>
      </div>

      <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Cari Nama</label>
          <div className="relative">
            <Search className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="w-full md:w-40 space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="Semua">Semua Status</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpa">Alpa</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex gap-2 items-end">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Tgl Mulai</label>
            <input
              type="date"
              value={dateFilterStart}
              onChange={(e) => setDateFilterStart(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Tgl Akhir</label>
            <input
              type="date"
              value={dateFilterEnd}
              onChange={(e) => setDateFilterEnd(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {(dateFilterStart || dateFilterEnd || statusFilter !== "Semua" || searchTerm) && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("Semua");
                setDateFilterStart("");
                setDateFilterEnd("");
              }}
              className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
              title="Reset Filter"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nama {viewMode}</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Jam Masuk</th>
                <th className="px-4 py-3 text-center">Jam Pulang</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((record: any) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{new Date(record.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{record.studentName}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${record.status === "Hadir" ? "bg-emerald-100 text-emerald-700" : 
                          record.status === "Izin" ? "bg-blue-100 text-blue-700" :
                          record.status === "Sakit" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 font-mono text-xs">{record.timeIn || "-"}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-mono text-xs">{record.timeOut || "-"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]">{record.notes || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(record)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50 transition">
                          <FileText size={14} />
                        </button>
                        <button onClick={() => {
                          if(window.confirm('Hapus data absensi ini?')) onDeleteAbsensi(record.id);
                        }} className="p-1.5 text-slate-400 hover:text-red-600 rounded bg-slate-50 hover:bg-red-50 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada data absensi ditemukan sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editingId ? "Edit Data Absensi" : "Input Absen Manual"}
              </h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Nama {viewMode}</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">-- Pilih {viewMode} --</option>
                  {activePeople.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Status Kehadiran</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpa">Alpa</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Jam Masuk</label>
                  <input
                    type="time"
                    value={formData.timeIn}
                    onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Jam Keluar</label>
                  <input
                    type="time"
                    value={formData.timeOut}
                    onChange={(e) => setFormData({...formData, timeOut: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Catatan / Keterangan</label>
                <input
                  type="text"
                  placeholder="Misal: Terlambat 15 menit..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm flex items-center gap-2"
                >
                  <Save size={16} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
