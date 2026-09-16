import React from "react";

export default function QRCardModal({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-4">QR Card</h2>
        <p className="mb-6 text-slate-500">Modul QR Card sedang dalam perbaikan.</p>
        <button onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Tutup</button>
      </div>
    </div>
  );
}
