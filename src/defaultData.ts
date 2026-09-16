/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export const initialSchoolSettings = {
  namaLembaga: "LPK Nandita Floating Hotel",
  tagline: "Pusat Pendidikan & Pelatihan Perhotelan dan Kapal Pesiar",
  alamat: "Jl. Raya Floating Hotel No. 88, Kawasan Pendidikan Maritim, Indonesia",
  noTelepon: "+62 821-3456-7890",
  email: "info@nanditafloatinghotel.com",
  website: "www.nanditafloatinghotel.com",
  direkturNama: "Nandita Wahyuni, M.Par.",
  direkturNip: "NIP. 19820512 201012 2 001",
  bendaharaNama: "Bendahara Utama",
  bendaharaNip: "NIP. 19900101 201501 1 001",
  logoUrl: "",
  // We can render a fallback custom icon/logo in the UI
  warnaUtama: "#001f3f",
  // Navy-900 (Bento Grid Theme)
  akreditasi: "Terakreditasi A (Sangat Baik) - LA-LPK",
  nomorIzin: "KEP. 421.9/3024/436.7.15/2026",
  kopSuratPosisi: "Kiri",
  bankNama: "Bank Mandiri",
  bankRekening: "142-00-1234567-8",
  bankAtasNama: "LPK NANDITA FLOATING HOTEL",
  googleSpreadsheetId: "",
  autoSyncEnabled: false,
  autoSyncCloudSql: true,
  lastCloudSqlSync: "",
  lastGoogleSheetSync: "",
  waTemplatePembayaran: `*BUKTI PEMBAYARAN RESMI* ✅
{lembaga}

Yth. *{nama_siswa}*,
Terima kasih, pembayaran Anda telah berhasil kami terima dan verifikasi.

*Rincian Transaksi:*
- *Tanggal:* {tanggal}
- *Nominal:* {nominal}
- *Keterangan:* {keterangan}
- *Sisa Tunggakan Siswa:* {sisa_piutang}

Pembayaran ini telah tercatat secara otomatis di Buku Induk Siswa. Silakan hubungi bagian Administrasi jika ada pertanyaan.
_Pesan ini dikirim otomatis oleh Sistem Keuangan {lembaga}._`,
  waTemplateTagihan: `Yth. {nama_siswa}, ini tagihan anda.`,
  waTemplateAbsensi: ``,
  waTemplateGaji: ``,
  waTemplateInterview: ``
};
export const initialSiswa = [];
export const initialStaff = [];
export const initialAbsensi = [];
export const initialKeuangan = [];
export const initialPembayaranLog = [];
export const initialPayroll = [];
export const initialJobRegister = [];
export const initialUserAccounts = [];
export const initialTagihan = [];
export const initialPendapatan = [];
export const initialPengeluaran = [];
export const initialUtang = [];
export const initialModulAjar = [];
export const initialPenilaian = [];
export const initialSertifikat = [];
export const initialKeuanganSiswa = [];
export const initialUsers = [];
export const initialPendapatanLain = [];
export const initialPengeluaranKas = [];
export const initialUtangPegawai = [];
export const initialPenilaianSiswa = [];
export const defaultJenisPendapatan = [];
export const defaultKatPengeluaran = [];
