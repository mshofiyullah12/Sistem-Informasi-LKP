import React, { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, Keyboard, CheckCircle, XCircle, Clock, ScanBarcode, User } from 'lucide-react';

export default function QRAbsensiScanner({
  siswa,
  staff,
  absensi,
  onAddAbsensi,
  onUpdateAbsensi,
}: any) {
  const [scanResult, setScanResult] = useState<any>(null);
  const [rfidInput, setRfidInput] = useState("");
  const [scanMode, setScanMode] = useState<"camera" | "rfid">("rfid");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-clear result after 3 seconds
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => {
        setScanResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  // Audio Beep
  const playBeep = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (success) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) {}
  };

  const processScannedCode = (code: string) => {
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString("id-ID", { hour12: false });
    
    // Check Siswa
    const foundSiswa = siswa.find((s: any) => s.nis === code || s.id === code || s.nisn === code);
    if (foundSiswa) {
      const existing = absensi.find((a: any) => a.studentId === foundSiswa.id && a.date === today);
      if (existing) {
        if (!existing.timeOut) {
          onUpdateAbsensi(existing.id, { ...existing, timeOut: time });
          setScanResult({ success: true, message: `Check-OUT: ${foundSiswa.nama}`, type: "Siswa", time });
          playBeep(true);
        } else {
          setScanResult({ success: false, message: `Sudah lengkap (IN/OUT): ${foundSiswa.nama}`, type: "Siswa", time: "" });
          playBeep(false);
        }
      } else {
        onAddAbsensi({
          id: Date.now().toString(),
          studentId: foundSiswa.id,
          studentName: foundSiswa.nama,
          date: today,
          status: "Hadir",
          timeIn: time,
          timeOut: ""
        });
        setScanResult({ success: true, message: `Check-IN: ${foundSiswa.nama}`, type: "Siswa", time });
        playBeep(true);
      }
      return;
    }
    
    // Check Staf
    const foundStaff = staff.find((s: any) => s.nip === code || s.id === code);
    if (foundStaff) {
       const existing = absensi.find((a: any) => a.studentId === foundStaff.id && a.date === today);
       if (existing) {
        if (!existing.timeOut) {
          onUpdateAbsensi(existing.id, { ...existing, timeOut: time });
          setScanResult({ success: true, message: `Check-OUT Staf: ${foundStaff.nama}`, type: "Instruktur/Staf", time });
          playBeep(true);
        } else {
          setScanResult({ success: false, message: `Sudah lengkap (IN/OUT): ${foundStaff.nama}`, type: "Instruktur/Staf", time: "" });
          playBeep(false);
        }
      } else {
        onAddAbsensi({
          id: Date.now().toString(),
          studentId: foundStaff.id,
          studentName: foundStaff.nama,
          date: today,
          status: "Hadir",
          timeIn: time,
          timeOut: ""
        });
        setScanResult({ success: true, message: `Check-IN Staf: ${foundStaff.nama}`, type: "Instruktur/Staf", time });
        playBeep(true);
      }
      return;
    }

    setScanResult({ success: false, message: `Data tidak ditemukan! Kode: ${code}`, type: "?", time: "" });
    playBeep(false);
  };

  const handleRFIDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfidInput.trim()) {
      processScannedCode(rfidInput.trim());
      setRfidInput("");
    }
  };

  // Autofocus for RFID mode
  useEffect(() => {
    let interval: any;
    if (scanMode === "rfid") {
      interval = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [scanMode]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
      <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Scanner Absensi Otomatis</h2>
          <p className="text-sm text-slate-500">Scan QR Code, Barcode, atau Kartu RFID untuk absensi instan.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setScanMode("rfid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition ${scanMode === "rfid" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ScanBarcode size={16} /> RFID / Scanner Hardware
          </button>
          <button 
            onClick={() => setScanMode("camera")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition ${scanMode === "camera" ? "bg-white text-emerald-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Camera size={16} /> Kamera Perangkat (QR)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center relative">
        
        {/* Main Content Area */}
        <div className="w-full max-w-2xl">
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            {scanMode === "camera" ? (
              <div className="bg-black relative h-[400px] flex items-center justify-center">
                <Scanner 
                  onScan={(result) => {
                    if (result && result.length > 0 && result[0].rawValue) {
                      processScannedCode(result[0].rawValue);
                    }
                  }}
                  formats={["qr_code", "ean_13", "code_128", "code_39"]}
                  components={{
                    audio: false, // Custom audio handling
                    tracker: true,
                  }}
                  styles={{
                    container: { width: "100%", height: "100%" }
                  }}
                />
                
                {/* Overlay guides */}
                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                  <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px] bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner border border-blue-200">
                    <ScanBarcode size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Mode Hardware Scanner Aktif</h3>
                  <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                    Arahkan Barcode Scanner ke kartu ID, atau tempelkan kartu RFID pada reader. Sistem siap menerima input otomatis.
                  </p>
                  
                  <form onSubmit={handleRFIDSubmit} className="max-w-xs mx-auto relative group">
                    <input
                      ref={inputRef}
                      type="text"
                      value={rfidInput}
                      onChange={(e) => setRfidInput(e.target.value)}
                      placeholder="Menunggu scan..."
                      className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3 text-center font-mono font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm transition"
                      autoFocus
                    />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                      Mendengarkan
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Status Panel (Bottom of scanner) */}
            <div className="p-6 bg-white border-t border-slate-200 min-h-[140px] flex items-center justify-center">
              {!scanResult ? (
                <div className="text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-20 animate-pulse" />
                  <p className="text-sm font-semibold uppercase tracking-widest">Menunggu Pemindaian...</p>
                </div>
              ) : (
                <div className={`w-full p-4 rounded-xl border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${scanResult.success ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${scanResult.success ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                    {scanResult.success ? <CheckCircle size={28} /> : <XCircle size={28} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-base font-black uppercase tracking-tight ${scanResult.success ? "text-emerald-800" : "text-red-800"}`}>
                      {scanResult.message}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      {scanResult.type && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${scanResult.success ? "bg-emerald-200 text-emerald-700" : "bg-red-200 text-red-700"}`}>
                          <User size={10} className="inline mr-1 -mt-0.5" />
                          {scanResult.type}
                        </span>
                      )}
                      {scanResult.time && (
                        <span className={`text-xs font-mono font-semibold ${scanResult.success ? "text-emerald-600" : "text-red-600"}`}>
                          {scanResult.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
