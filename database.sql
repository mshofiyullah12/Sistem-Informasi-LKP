-- phpMyAdmin SQL Dump
-- LPK Nandita Hostinger Database Schema
--
-- This schema is designed for MySQL / MariaDB (Hostinger).
-- Import this file into your Hostinger database via phpMyAdmin.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id` varchar(100) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nis` varchar(100) DEFAULT NULL,
  `tempatLahir` varchar(255) DEFAULT NULL,
  `tanggalLahir` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `noHp` varchar(50) DEFAULT NULL,
  `programStudi` varchar(255) DEFAULT NULL,
  `angkatan` varchar(100) DEFAULT NULL,
  `tanggalDaftar` varchar(50) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `nik` varchar(50) DEFAULT NULL,
  `agama` varchar(100) DEFAULT NULL,
  `pendidikanTerakhir` varchar(255) DEFAULT NULL,
  `namaAyah` varchar(255) DEFAULT NULL,
  `pekerjaanAyah` varchar(255) DEFAULT NULL,
  `namaIbu` varchar(255) DEFAULT NULL,
  `pekerjaanIbu` varchar(255) DEFAULT NULL,
  `tanggalMulaiPelatihan` varchar(50) DEFAULT NULL,
  `tanggalSelesaiPelatihan` varchar(50) DEFAULT NULL,
  `nomorSepatu` varchar(20) DEFAULT NULL,
  `ukuranBaju` varchar(20) DEFAULT NULL,
  `nomorPaspor` varchar(100) DEFAULT NULL,
  `nomorBukuPelaut` varchar(100) DEFAULT NULL,
  `nomorBST` varchar(100) DEFAULT NULL,
  `asalSekolah` varchar(255) DEFAULT NULL,
  `rfidCardId` varchar(100) DEFAULT NULL,
  `fotoUrl` text DEFAULT NULL,
  `tanggalUpdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` varchar(100) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nip` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `spesialisasi` varchar(255) DEFAULT NULL,
  `noHp` varchar(50) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `gajiPokok` decimal(15,2) DEFAULT '0.00',
  `tarifPerJam` decimal(15,2) DEFAULT '0.00',
  `jamMengajarMingguan` int(11) DEFAULT '0',
  `rfidCardId` varchar(100) DEFAULT NULL,
  `fotoUrl` text DEFAULT NULL,
  `tanggalUpdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` varchar(100) NOT NULL,
  `tanggal` varchar(50) NOT NULL,
  `targetId` varchar(100) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `jamMasuk` varchar(20) DEFAULT NULL,
  `jamSelesai` varchar(20) DEFAULT NULL,
  `jamMasukSesi2` varchar(20) DEFAULT NULL,
  `jamSelesaiSesi2` varchar(20) DEFAULT NULL,
  `totalJamMengajar` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `sertifikat`
--

CREATE TABLE `sertifikat` (
  `id` varchar(100) NOT NULL,
  `siswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `namaKompetensi` varchar(255) NOT NULL,
  `nomorSertifikat` varchar(100) DEFAULT NULL,
  `tanggalTerbit` varchar(50) DEFAULT NULL,
  `tanggalKadaluarsa` varchar(50) DEFAULT NULL,
  `nilai` varchar(50) DEFAULT NULL,
  `penerbit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `keuangan_siswa`
--

CREATE TABLE `keuangan_siswa` (
  `id` varchar(100) NOT NULL,
  `siswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `totalBiaya` decimal(15,2) DEFAULT '0.00',
  `totalBayar` decimal(15,2) DEFAULT '0.00',
  `piutang` decimal(15,2) DEFAULT '0.00',
  `statusBayar` varchar(100) DEFAULT NULL,
  `pembayaranTerakhir` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pembayaran_log`
--

CREATE TABLE `pembayaran_log` (
  `id` varchar(100) NOT NULL,
  `keuanganSiswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `tanggalBayar` varchar(50) NOT NULL,
  `jumlahBayar` decimal(15,2) DEFAULT '0.00',
  `metodeBayar` varchar(100) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` varchar(100) NOT NULL,
  `staffId` varchar(100) NOT NULL,
  `staffNama` varchar(255) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `bulan` varchar(100) NOT NULL,
  `gajiPokok` decimal(15,2) DEFAULT '0.00',
  `tunjangan` decimal(15,2) DEFAULT '0.00',
  `lemburBonus` decimal(15,2) DEFAULT '0.00',
  `potongan` decimal(15,2) DEFAULT '0.00',
  `totalGaji` decimal(15,2) DEFAULT '0.00',
  `tanggalBayar` varchar(50) DEFAULT NULL,
  `statusGaji` varchar(100) DEFAULT NULL,
  `totalJamMengajar` decimal(10,2) DEFAULT '0.00',
  `tarifPerJam` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `job_register`
--

CREATE TABLE `job_register` (
  `id` varchar(100) NOT NULL,
  `siswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `programStudi` varchar(255) DEFAULT NULL,
  `namaPerusahaan` varchar(255) NOT NULL,
  `posisi` varchar(255) NOT NULL,
  `lokasiTipe` varchar(100) DEFAULT NULL,
  `negaraKota` varchar(255) DEFAULT NULL,
  `gajiPerkiraan` varchar(255) DEFAULT NULL,
  `tanggalDaftar` varchar(50) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `isExternal` tinyint(1) DEFAULT '0',
  `noHpExternal` varchar(50) DEFAULT NULL,
  `biayaPemberangkatan` decimal(15,2) DEFAULT '0.00',
  `feePemberangkatanPT` decimal(15,2) DEFAULT '0.00',
  `totalBayarExternal` decimal(15,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `id` varchar(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `role` varchar(100) NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `siswaId` varchar(100) DEFAULT NULL,
  `googleEmail` varchar(255) DEFAULT NULL,
  `allowedTabs` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `tagihan_siswa`
--

CREATE TABLE `tagihan_siswa` (
  `id` varchar(100) NOT NULL,
  `siswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `namaTagihan` varchar(255) NOT NULL,
  `jumlah` decimal(15,2) DEFAULT '0.00',
  `tanggalTagihan` varchar(50) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pendapatan_lain`
--

CREATE TABLE `pendapatan_lain` (
  `id` varchar(100) NOT NULL,
  `tanggal` varchar(50) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `jumlah` decimal(15,2) DEFAULT '0.00',
  `keterangan` text DEFAULT NULL,
  `penerima` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `pengeluaran_kas`
--

CREATE TABLE `pengeluaran_kas` (
  `id` varchar(100) NOT NULL,
  `tanggal` varchar(50) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `jumlah` decimal(15,2) DEFAULT '0.00',
  `keterangan` text DEFAULT NULL,
  `penanggungJawab` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `utang_pegawai`
--

CREATE TABLE `utang_pegawai` (
  `id` varchar(100) NOT NULL,
  `staffId` varchar(100) NOT NULL,
  `staffNama` varchar(255) NOT NULL,
  `tanggalPinjam` varchar(50) NOT NULL,
  `jumlahPinjam` decimal(15,2) DEFAULT '0.00',
  `totalBayar` decimal(15,2) DEFAULT '0.00',
  `sisaUtang` decimal(15,2) DEFAULT '0.00',
  `deskripsi` text DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `riwayatCicilan` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `modul_ajar`
--

CREATE TABLE `modul_ajar` (
  `id` varchar(100) NOT NULL,
  `kodeModul` varchar(100) DEFAULT NULL,
  `judul` varchar(255) NOT NULL,
  `programStudi` varchar(255) DEFAULT NULL,
  `instrukturId` varchar(100) DEFAULT NULL,
  `instrukturNama` varchar(255) DEFAULT NULL,
  `tingkat` varchar(100) DEFAULT NULL,
  `durasiJam` int(11) DEFAULT '0',
  `tujuanPelatihan` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `pokokBahasan` json DEFAULT NULL,
  `fileUrl` text DEFAULT NULL,
  `linkVideo` text DEFAULT NULL,
  `referensiBuku` text DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `tanggalDibuat` varchar(50) DEFAULT NULL,
  `tanggalUpdate` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `penilaian_siswa`
--

CREATE TABLE `penilaian_siswa` (
  `id` varchar(100) NOT NULL,
  `siswaId` varchar(100) NOT NULL,
  `siswaNama` varchar(255) NOT NULL,
  `nis` varchar(100) DEFAULT NULL,
  `programStudi` varchar(255) DEFAULT NULL,
  `angkatan` varchar(100) DEFAULT NULL,
  `mataPelatihan` varchar(255) DEFAULT NULL,
  `modulKode` varchar(100) DEFAULT NULL,
  `instrukturId` varchar(100) DEFAULT NULL,
  `instrukturNama` varchar(255) DEFAULT NULL,
  `tanggalPenilaian` varchar(50) DEFAULT NULL,
  `nilaiTeori` decimal(5,2) DEFAULT '0.00',
  `nilaiPraktik` decimal(5,2) DEFAULT '0.00',
  `nilaiKehadiran` decimal(5,2) DEFAULT '0.00',
  `nilaiSikapEtika` decimal(5,2) DEFAULT '0.00',
  `nilaiAkhir` decimal(5,2) DEFAULT '0.00',
  `grade` varchar(10) DEFAULT NULL,
  `statusKelulusan` varchar(100) DEFAULT NULL,
  `predikat` varchar(100) DEFAULT NULL,
  `catatanInstruktur` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
