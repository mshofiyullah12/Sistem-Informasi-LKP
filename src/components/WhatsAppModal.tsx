import React from "react";
export default function WhatsAppModal({ onClose }: any) {
  return <div className="fixed inset-0 bg-black/50 flex justify-center items-center"><div className="p-4 bg-white rounded shadow text-center w-80"><h2 className="text-lg font-bold mb-2">Kirim Pesan WhatsApp</h2><p className="text-sm text-slate-500 mb-4">Fitur ini sedang dalam perbaikan.</p><button onClick={onClose} className="px-3 py-1 bg-slate-200 rounded text-sm w-full">Tutup</button></div></div>;
}
