/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ProgramStudi {
  Perhotelan = "Perhotelan",
  KapalPesiar = "Kapal Pesiar",
  CulinaryArts = "Culinary Arts",
  CabinCrew = "Cabin Crew",
  BahasaInggrisSD = "Bahasa Inggris SD",
  BahasaInggrisSMP = "Bahasa Inggris SMP",
  BahasaInggrisSMA = "Bahasa Inggris SMA"
}

export enum Gender {
  LakiLaki = "Laki-laki",
  Perempuan = "Perempuan"
}

export enum SiswaStatus {
  Aktif = "Aktif",
  Lulus = "Lulus",
  Cuti = "Cuti",
  Keluar = "Keluar"
}

export enum StaffRole {
  Staf = "Staf",
  Instruktur = "Instruktur",
  Manajemen = "Manajemen"
}

export enum AbsensiStatus {
  Hadir = "Hadir",
  Sakit = "Sakit",
  Izin = "Izin",
  Alpa = "Alpa"
}

export enum JobLocationType {
  DalamNegeri = "Dalam Negeri",
  LuarNegeri = "Luar Negeri"
}

export enum JobStatus {
  Daftar = "Daftar",
  Interview = "Interview",
  Lolos = "Lolos",
  Berangkat = "Berangkat",
  Ditolak = "Ditolak"
}

export interface Siswa {
  id: string; // Unique ID, e.g. SIS-001
  nama: string;
  nis: string; // Nomor Induk Siswa
  tempatLahir: string;
  tanggalLahir: string;
  gender: Gender;
  alamat: string;
  noHp: string;
  programStudi: ProgramStudi;
  angkatan: string;
  tanggalDaftar: string;
  status: SiswaStatus;
  // Extended Buku Induk fields (optional for backwards compatibility)
  nik?: string;
  agama?: string;
  pendidikanTerakhir?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  noHpOrangTua?: string;
  tinggiBadan?: string;
  beratBadan?: string;
  catatanKesehatan?: string;
  rfidCardId?: string; // UID / Nomor Kartu RFID (125kHz EM-ID / 13.56MHz Mifare / NFC)
  fotoUrl?: string; // Foto resmi profil / ID card (Data URL base64 atau URL gambar)
  // Academic grades and graduation predicate
  nilaiHousekeeping?: string;
  nilaiFBService?: string;
  nilaiCulinaryArt?: string;
  nilaiBahasaInggris?: string;
  nilaiBahasaTurki?: string;
  predikatKelulusan?: string;
}

export interface Staff {
  id: string; // STF-001
  nama: string;
  nip: string; // Nomor Induk Pegawai
  role: StaffRole;
  spesialisasi: string; // e.g. "Food & Beverage", "Housekeeping", "Bahasa Inggris"
  noHp: string;
  alamat: string;
  status: "Aktif" | "Non-Aktif";
  gajiPokok: number;
  tarifPerJam?: number; // Tarif Honorarium per Jam khusus Instruktur (e.g. Rp 50.000)
  jamMengajarMingguan?: number; // Beban Jam Mengajar per Minggu khusus Instruktur (e.g. 8 Jam / Minggu)
  rfidCardId?: string; // UID / Nomor Kartu RFID (125kHz EM-ID / 13.56MHz Mifare / NFC)
  fotoUrl?: string; // Foto resmi profil / ID card (Data URL base64 atau URL gambar)
}

export interface Absensi {
  id: string; // ABS-001
  tanggal: string; // YYYY-MM-DD
  targetId: string; // ID of Siswa, Staf, or Instruktur
  nama: string;
  kategori: "Siswa" | "Staf" | "Instruktur";
  status: AbsensiStatus;
  keterangan: string;
  jamMasuk?: string; // Jam masuk mengajar (Guru/Staf) / Sesi 1 Mulai
  jamSelesai?: string; // Jam selesai mengajar (Guru/Staf) / Sesi 1 Selesai
  jamMasukSesi2?: string; // Sesi 2 Mulai
  jamSelesaiSesi2?: string; // Sesi 2 Selesai
  totalJamMengajar?: number; // Total Jam Mengajar hari itu
}

export interface Sertifikat {
  id: string; // CERT-001
  siswaId: string;
  siswaNama: string;
  namaKompetensi: string; // e.g. "Table Manners & Fine Dining", "Basic Safety Training (BST)"
  nomorSertifikat: string;
  tanggalTerbit: string;
  tanggalKadaluarsa: string;
  nilai: string; // e.g. "Sangat Baik (A)", "A+", "Lulus"
  penerbit: string; // LPK Nandita Floating Hotel or external agency
}

export interface KeuanganSiswa {
  id: string; // KEU-001
  siswaId: string;
  siswaNama: string;
  totalBiaya: number; // Tuition fees
  totalBayar: number; // Total payments made
  piutang: number; // totalBiaya - totalBayar (calculated)
  statusBayar: "Lunas" | "Belum Lunas" | "Belum Bayar";
  pembayaranTerakhir: string;
}

export interface PembayaranLog {
  id: string; // PAY-001
  keuanganSiswaId: string;
  siswaNama: string;
  tanggalBayar: string;
  jumlahBayar: number;
  metodeBayar: string; // Cash, Transfer Bank, dll.
  keterangan: string;
}

export interface Payroll {
  id: string; // PAYR-001
  staffId: string;
  staffNama: string;
  role: StaffRole;
  bulan: string; // e.g. "Juli 2026"
  gajiPokok: number;
  tunjangan: number;
  lemburBonus: number;
  potongan: number;
  totalGaji: number; // GajiPokok + Tunjangan + LemburBonus - Potongan
  tanggalBayar: string;
  statusGaji: "Dibayar" | "Pending";
  // Fields for Instruktur integration (Tarif/Jam x Jam/Minggu x 4 Minggu)
  totalJamMengajar?: number; // Total jam mengajar sebulan (jamPerMinggu * jumlahMinggu)
  tarifPerJam?: number; // Tarif honorarium per jam (Rp)
  jamPerMinggu?: number; // Jam mengajar per minggu
  jumlahMinggu?: number; // Jumlah minggu perhitungan sebulan (default 4)
}

export interface JobRegister {
  id: string; // JOB-001
  siswaId: string;
  siswaNama: string;
  programStudi: ProgramStudi | string;
  namaPerusahaan: string; // e.g. "Royal Caribbean", "Hilton Hotel Jakarta"
  posisi: string; // e.g. "Assistant Cook", "Steward", "Bartender"
  lokasiTipe: JobLocationType;
  negaraKota: string; // e.g. "Miami, USA", "Bali, Indonesia"
  gajiPerkiraan: string; // e.g. "USD 1,500 / month"
  tanggalDaftar: string;
  status: JobStatus;
  // New integrated fields for External LPK students & Placements
  isExternal?: boolean;
  noHpExternal?: string;
  biayaPemberangkatan?: number; // Biaya pemberangkatan/proses yang ditagihkan ke siswa external
  feePemberangkatanPT?: number; // Fee penempatan/pemberangkatan dari PT/Perusahaan
  totalBayarExternal?: number; // Jumlah yang sudah dibayar oleh siswa external
}

export interface SchoolSettings {
  namaLembaga: string;
  tagline: string;
  alamat: string;
  noTelepon: string;
  email: string;
  website: string;
  direkturNama: string;
  direkturNip: string;
  bendaharaNama?: string;
  bendaharaNip?: string;
  logoUrl: string;
  faviconUrl?: string; // SVG data or image URL
  warnaUtama: string; // Primary hex color code
  akreditasi?: string; // LPK Accreditation info
  nomorIzin?: string; // LPK School License number
  kopSuratPosisi?: "Kiri" | "Tengah" | "Kanan" | "LogoKiri_TeksTengah"; // Alignment of the letterhead (Kiri = left, Tengah = center, Kanan = right, LogoKiri_TeksTengah = logo on left but text is centered)
  // Bank transfer details
  bankNama?: string;
  bankRekening?: string;
  bankAtasNama?: string;
  googleSpreadsheetId?: string;
  autoSyncEnabled?: boolean;
  autoSyncCloudSql?: boolean;
  lastCloudSqlSync?: string;
  lastGoogleSheetSync?: string;
  waTemplatePembayaran?: string;
  waTemplateTagihanSiswa?: string;
  waTemplateGaji?: string;
  waTemplateDanaMasuk?: string;
  waTemplateInterviewLolos?: string;
  scannerKamera?: string;
  scannerKameraLabel?: string;
  // Pengaturan Jam Kerja Staf & Sesi Belajar/Mengajar (Otomatis QR)
  jamMasukStaf?: string; // Jam masuk kerja staf (default e.g. "08:00")
  jamPulangStaf?: string; // Jam selesai bekerja staf (default e.g. "17:00")
  // Jam Siswa (Jam Pertama & Jam Kedua)
  jamMasukSiswaSesi1?: string; // Jam Pertama Masuk Siswa (default e.g. "08:00")
  jamSelesaiSiswaSesi1?: string; // Jam Pertama Selesai Siswa (default e.g. "11:30")
  jamMasukSiswaSesi2?: string; // Jam Kedua Masuk Siswa (default e.g. "13:00")
  jamSelesaiSiswaSesi2?: string; // Jam Kedua Selesai Siswa (default e.g. "16:30")
  // Jam Instruktur (Jam Pertama & Jam Kedua)
  jamMasukInstrukturSesi1?: string; // Jam Pertama Masuk Instruktur (default e.g. "08:00")
  jamSelesaiInstrukturSesi1?: string; // Jam Pertama Selesai Instruktur (default e.g. "11:30")
  jamMasukInstrukturSesi2?: string; // Jam Kedua Masuk Instruktur (default e.g. "13:00")
  jamSelesaiInstrukturSesi2?: string; // Jam Kedua Selesai Instruktur (default e.g. "16:30")
  // Toleransi Keterlambatan
  toleransiKeterlambatanMenit?: number; // Toleransi keterlambatan dalam menit (default 15)
  // Pengaturan Potongan Jam Istirahat (Break Time Deduction)
  otomatisPotongIstirahat?: boolean; // Aktifkan otomatisasi pemotongan jam istirahat
  // Istirahat Pagi & Siang Standar (Senin - Rabu, Sabtu)
  istirahatPagiMulai?: string; // Jam mulai istirahat pagi standar (e.g. "10:00")
  istirahatPagiSelesai?: string; // Jam selesai istirahat pagi standar (e.g. "10:30")
  potonganIstirahatPagiMenit?: number; // Durasi potongan istirahat pagi standar dalam menit (e.g. 30)
  istirahatSiangMulai?: string; // Jam mulai istirahat siang standar (e.g. "12:00")
  istirahatSiangSelesai?: string; // Jam selesai istirahat siang standar (e.g. "13:00")
  potonganIstirahatSiangMenit?: number; // Durasi potongan istirahat siang standar dalam menit (e.g. 60)
  // Khusus Hari Kamis (Istirahat Pagi & Siang)
  khususKamisAktif?: boolean; // Aktifkan jadwal istirahat khusus hari Kamis
  kamisIstirahatPagiMulai?: string; // Jam mulai istirahat pagi Kamis (e.g. "10:00")
  kamisIstirahatPagiSelesai?: string; // Jam selesai istirahat pagi Kamis (e.g. "10:30")
  kamisPotonganIstirahatPagiMenit?: number; // Durasi potongan istirahat pagi Kamis (e.g. 30)
  kamisIstirahatSiangMulai?: string; // Jam mulai istirahat siang Kamis (e.g. "12:00")
  kamisIstirahatSiangSelesai?: string; // Jam selesai istirahat siang Kamis (e.g. "13:00")
  kamisPotonganIstirahatSiangMenit?: number; // Durasi potongan istirahat siang Kamis (e.g. 60)
  // Khusus Hari Jumat (Istirahat Pagi & Siang - Sholat Jumat)
  khususJumatAktif?: boolean; // Aktifkan jadwal istirahat khusus hari Jumat
  jumatIstirahatPagiMulai?: string; // Jam mulai istirahat pagi Jumat (e.g. "09:30")
  jumatIstirahatPagiSelesai?: string; // Jam selesai istirahat pagi Jumat (e.g. "10:00")
  jumatPotonganIstirahatPagiMenit?: number; // Durasi potongan istirahat pagi Jumat (e.g. 30)
  jumatIstirahatSiangMulai?: string; // Jam mulai istirahat siang Jumat (e.g. "11:30")
  jumatIstirahatSiangSelesai?: string; // Jam selesai istirahat siang Jumat (e.g. "13:00")
  jumatPotonganIstirahatSiangMenit?: number; // Durasi potongan istirahat siang Jumat (e.g. 90)
  // Backward compatibility / legacy category fields
  potonganIstirahatStafMenit?: number; // Durasi potongan jam istirahat staf dalam menit (e.g. 60)
  jamMulaiIstirahatStaf?: string; // Jam mulai istirahat staf (e.g. "12:00")
  jamSelesaiIstirahatStaf?: string; // Jam selesai istirahat staf (e.g. "13:00")
  potonganIstirahatInstrukturMenit?: number; // Durasi potongan jam istirahat instruktur dalam menit (e.g. 60)
  jamMulaiIstirahatInstruktur?: string; // Jam mulai istirahat instruktur (e.g. "11:30")
  jamSelesaiIstirahatInstruktur?: string; // Jam selesai istirahat instruktur (e.g. "13:00")
  potonganIstirahatSiswaMenit?: number; // Durasi potongan jam istirahat siswa dalam menit (e.g. 60)
  jamMulaiIstirahatSiswa?: string; // Jam mulai istirahat siswa (e.g. "11:30")
  jamSelesaiIstirahatSiswa?: string; // Jam selesai istirahat siswa (e.g. "13:00")
  // Integrasi RFID & Barcode Reader (USB / Wireless / NFC)
  rfidReaderEnabled?: boolean; // Aktifkan integrasi scanner RFID / Barcode USB
  rfidInputMode?: "Auto" | "KeyboardWedge" | "WebNFC"; // Mode scanner: Auto, USB HID Keyboard, Web NFC
  rfidBeepAudio?: boolean; // Bunyikan audio beep saat scan kartu/QR
  rfidAutoEnterDelay?: number; // Toleransi jeda pembacaan RFID reader (ms)
  // Standar Honorarium Instruktur (Tarif/Jam x Jam/Minggu x 4 Minggu)
  honorariumInstrukturPerJam?: number; // Tarif honorarium per jam default untuk instruktur (Rp)
  jamMengajarInstrukturPerMinggu?: number; // Standar jam mengajar per minggu untuk instruktur
  mingguPerBulanGaji?: number; // Standar jumlah minggu per bulan (default 4)
}

export interface UserAccount {
  id: string;
  username: string;
  nama: string;
  role: "Admin" | "Staf" | "Keuangan" | "Instruktur" | "Siswa";
  status: "Aktif" | "Non-Aktif";
  password?: string;
  allowedTabs?: string[];
  siswaId?: string; // Menghubungkan akun ke ID Siswa jika rolenya Siswa
  googleEmail?: string; // Menyimpan email Google yang terhubung untuk sinkronisasi/quick login
}

export interface TagihanSiswa {
  id: string;
  siswaId: string;
  siswaNama: string;
  namaTagihan: string; // e.g. "Pendaftaran", "Uang Gedung", "Seragam", "Sertifikasi", "Sewa Mess"
  jumlah: number;
  tanggalTagihan: string;
  status: "Lunas" | "Belum Lunas";
  deskripsi: string;
}

export interface PendapatanLain {
  id: string;
  tanggal: string;
  kategori: string; // e.g. "Sewa Ruangan", "Kemitraan", "Sertifikasi Luar", "Lain-lain"
  jumlah: number;
  keterangan: string;
  penerima: string;
}

export interface PengeluaranKas {
  id: string;
  tanggal: string;
  kategori: string; // e.g. "Alat Tulis", "Listrik", "Promosi", "Transportasi", "Lain-lain"
  jumlah: number;
  keterangan: string;
  penanggungJawab: string;
}

export interface UtangPegawai {
  id: string;
  staffId: string;
  staffNama: string;
  tanggalPinjam: string;
  jumlahPinjam: number;
  totalBayar: number;
  sisaUtang: number; // calculated: jumlahPinjam - totalBayar
  deskripsi: string;
  status: "Belum Lunas" | "Lunas";
  riwayatCicilan: {
    id: string;
    tanggal: string;
    jumlah: number;
    keterangan: string;
  }[];
}

export interface PokokBahasanModul {
  pertemuan: number;
  topik: string;
  subTopik: string;
  metode: "Teori" | "Praktik" | "Simulasi / Roleplay" | "Workshop" | "Ujian";
  durasiJam: number;
}

export interface ModulAjar {
  id: string; // MDL-001
  kodeModul: string; // e.g. "HK-101", "FBS-201", "CUL-301", "ENG-102"
  judul: string; // e.g. "Housekeeping Operations & Cabin Cleaning Procedure"
  programStudi: ProgramStudi | string;
  instrukturId?: string;
  instrukturNama: string;
  tingkat: "Dasar (Basic)" | "Menengah (Intermediate)" | "Lanjutan (Advanced)" | "Profesional";
  durasiJam: number; // Total jam tatap muka / praktik
  tujuanPelatihan: string; // Capaian kompetensi lulusan
  deskripsi: string;
  pokokBahasan: PokokBahasanModul[];
  fileUrl?: string; // Tautan PDF materi / modul cetak
  linkVideo?: string; // Tautan video peragaan / tutorial
  referensiBuku?: string;
  status: "Aktif" | "Draft" | "Arsip";
  tanggalDibuat: string;
  tanggalUpdate: string;
}

export interface PenilaianSiswa {
  id: string; // NILAI-001
  siswaId: string; // SIS-001
  siswaNama: string;
  nis: string;
  programStudi: ProgramStudi | string;
  angkatan: string;
  mataPelatihan: string; // e.g. "Housekeeping & Laundry", "F&B Service & Bar", "Culinary Art", "English for Hospitality", dll.
  modulKode?: string;
  instrukturId?: string;
  instrukturNama: string;
  tanggalPenilaian: string;
  // Bobot komponen nilai (0 - 100)
  nilaiTeori: number; // Bobot 25%
  nilaiPraktik: number; // Bobot 45%
  nilaiKehadiran: number; // Bobot 15%
  nilaiSikapEtika: number; // Bobot 15% (Grooming, Attitude, Hospitality Ethics)
  nilaiAkhir: number; // Terhitung otomatis: (Teori*0.25) + (Praktik*0.45) + (Kehadiran*0.15) + (Sikap*0.15)
  grade: "A" | "B+" | "B" | "C" | "D";
  statusKelulusan: "Kompeten (Lulus)" | "Belum Kompeten (Remedial)" | "Dalam Penilaian";
  predikat: "Sangat Memuaskan (Distinction)" | "Memuaskan (Merit)" | "Cukup (Pass)" | "Perlu Peningkatan";
  catatanInstruktur: string;
}
