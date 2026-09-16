import React, { useState } from "react";
import { UtangPegawai, Staff } from "../types";
import { formatRupiah } from "../utils/excelExport";
import { Search, Plus, Trash2, Edit2, HandCoins } from "lucide-react";

export default function UtangPegawaiSheet({
  utangPegawai,
  staffList,
  onAddUtang,
  onUpdateUtang,
  onDeleteUtang,
  onAddCicilan,
  onDeleteCicilan
}: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
            <HandCoins size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">Utang Pegawai</h2>
            <p className="text-sm text-slate-500 font-medium">Kelola pinjaman dan cicilan</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-auto flex items-center justify-center text-slate-400">
        (Modul Utang Pegawai)
      </div>
    </div>
  );
}
