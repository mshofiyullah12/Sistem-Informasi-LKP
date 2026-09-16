import React, { useState, useRef } from "react";
import { Save, Upload, Download, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function SettingsSheet({
  settings,
  onUpdateSettings,
  onResetToDefault,
  onImportFullBackup,
  onExportFullBackup,
}: any) {
  const [formData, setFormData] = useState(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    onUpdateSettings(formData);
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
      <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Pengaturan Lembaga</h2>
          <p className="text-sm text-slate-500">Konfigurasi profil dan branding LPK</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExportFullBackup}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <form id="settings-form" onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8">
          {/* Logo & Favicon Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Branding & Logo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase">Logo Utama LPK</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logoUrl")}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <Upload size={16} /> Upload Logo
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2">Format: PNG, JPG, SVG. Rekomendasi ukuran transparan (Square).</p>
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase">Logo Favicon (Ikon Tab Browser)</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                    {formData.faviconUrl ? (
                      <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/png, image/x-icon, image/svg+xml"
                      onChange={(e) => handleImageUpload(e, "faviconUrl")}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <label
                      htmlFor="favicon-upload"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <Upload size={16} /> Upload Favicon
                    </label>
                    <p className="text-[10px] text-slate-400 mt-2">Format: PNG, ICO. Ukuran: 32x32px atau 16x16px.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Lembaga Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Profil Lembaga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Nama LPK</label>
                <input
                  type="text"
                  name="namaLembaga"
                  value={formData.namaLembaga || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Slogan / Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500">Alamat Lengkap</label>
                <textarea
                  name="alamat"
                  value={formData.alamat || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">No. Telepon / WA</label>
                <input
                  type="text"
                  name="noTelepon"
                  value={formData.noTelepon || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onResetToDefault}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={16} /> Reset Default
        </button>
        <button
          form="settings-form"
          type="submit"
          disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#001124] rounded-lg text-sm font-bold transition shadow-md ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Save size={18} /> {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
