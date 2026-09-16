/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { formatRupiah } from "../utils/excelExport";
export function cleanPhoneNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  return clean;
}
export function getWhatsAppUrl(phone, text) {
  const formattedPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}
export function replacePlaceholders(template, replacements) {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{${key}}`, "g");
    result = result.replace(regex, value);
  }
  return result;
}
export function formatPaymentNotification(studentName, amount, description, date, remainingDebt, lembaga = "LPK Nandita Floating Hotel", customTemplate) {
  if (customTemplate) {
    return replacePlaceholders(customTemplate, {
      "lembaga": lembaga,
      "nama_siswa": studentName,
      "tanggal": date,
      "nominal": formatRupiah(amount),
      "keterangan": description,
      "sisa_piutang": formatRupiah(remainingDebt)
    });
  }
  return `*BUKTI PEMBAYARAN RESMI* ✅
${lembaga}

Yth. *${studentName}*,
Terima kasih, pembayaran Anda telah berhasil kami terima dan verifikasi.

*Rincian Transaksi:*
- *Tanggal:* ${date}
- *Nominal:* ${formatRupiah(amount)}
- *Keterangan:* ${description}
- *Sisa Tunggakan Siswa:* ${formatRupiah(remainingDebt)}

Pembayaran ini telah tercatat secara otomatis di Buku Induk Siswa. Silakan hubungi bagian Administrasi jika ada pertanyaan.
_Pesan ini dikirim otomatis oleh Sistem Keuangan ${lembaga}._`;
}
export function formatReceivableNotification(studentName, totalBiaya, unpaidAmount, lembaga = "LPK Nandita Floating Hotel", customTemplate) {
  const paidAmount = totalBiaya - unpaidAmount;
  if (customTemplate) {
    return replacePlaceholders(customTemplate, {
      "lembaga": lembaga,
      "nama_siswa": studentName,
      "total_biaya": formatRupiah(totalBiaya),
      "terbayar": formatRupiah(paidAmount),
      "sisa_piutang": formatRupiah(unpaidAmount)
    });
  }
  return `Ini tagihan`;
}

export function formatAttendanceNotification(name: string, type: string, time: string, status: string, lembaga = "LPK Nandita") {
  return `Absensi ${name} status ${status} waktu ${time}`;
}

export function formatSalaryNotification(name: string, month: string, amount: number, lembaga = "LPK Nandita") {
  return `Gaji ${name} bulan ${month} sebesar Rp${amount}`;
}

export function formatInterviewPassedNotification(name: string, jobTitle: string, company: string, location: string) {
  return `Selamat ${name}, lolos interview ${jobTitle} di ${company}`;
}

export function formatClassScheduleReminder(name: string, className: string, time: string) {
  return `Jadwal kelas ${className} jam ${time} untuk ${name}`;
}
