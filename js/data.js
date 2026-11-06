/*
 * data.js — Data dummy aplikasi pemesanan buku
 * Tugas UTS Pemrograman Web 1
 * Nama : Astian Handal Cahya Putra
 * NIM  : 312310527
 */

// Akun untuk login (index.html)
const dataPengguna = [
  {
    email: "astian@mail.com",
    password: "123456",
    nama: "Astian Handal Cahya Putra",
    nim: "312310527"
  },
  {
    email: "admin@tokobuku.com",
    password: "admin123",
    nama: "Admin Toko"
  }
];

// Katalog / stok buku (stok.html, checkout.html)
const dataKatalogBuku = [
  { kode: "BK001", judul: "Laskar Pelangi",            kategori: "Novel",     harga: 89000,  stok: 24, gambar: "img/buku1.png" },
  { kode: "BK002", judul: "Bumi Manusia",              kategori: "Novel",     harga: 110000, stok: 15, gambar: "img/buku2.png" },
  { kode: "BK003", judul: "Filosofi Teras",            kategori: "Pengembangan Diri", harga: 98000, stok: 30, gambar: "img/buku3.png" },
  { kode: "BK004", judul: "Atomic Habits",             kategori: "Pengembangan Diri", harga: 119000, stok: 18, gambar: "img/buku4.png" },
  { kode: "BK005", judul: "Dasar Pemrograman Web",     kategori: "Teknologi", harga: 125000, stok: 12, gambar: "img/buku5.png" },
  { kode: "BK006", judul: "Algoritma dan Struktur Data", kategori: "Teknologi", harga: 135000, stok: 9,  gambar: "img/buku6.png" },
  { kode: "BK007", judul: "Sapiens",                   kategori: "Sejarah",   harga: 149000, stok: 7,  gambar: "img/buku7.png" },
  { kode: "BK008", judul: "Pulang",                    kategori: "Novel",     harga: 79000,  stok: 0,  gambar: "img/buku8.png" }
];

// Data tracking pengiriman (tracking.html)
// status: 0 Diproses, 1 Dikemas, 2 Dikirim, 3 Dalam Perjalanan, 4 Diterima
const statusPengiriman = ["Diproses", "Dikemas", "Dikirim", "Dalam Perjalanan", "Diterima"];

const dataTracking = [
  {
    nomorDO: "DO-2026-0001",
    nama: "Astian Handal Cahya Putra",
    status: 4,
    ekspedisi: "JNE",
    tanggalKirim: "2026-10-28",
    jenisPaket: "Reguler",
    total: 208000
  },
  {
    nomorDO: "DO-2026-0002",
    nama: "Rina Anggraini",
    status: 3,
    ekspedisi: "J&T Express",
    tanggalKirim: "2026-11-03",
    jenisPaket: "Express",
    total: 119000
  },
  {
    nomorDO: "DO-2026-0003",
    nama: "Budi Santoso",
    status: 1,
    ekspedisi: "SiCepat",
    tanggalKirim: "2026-11-05",
    jenisPaket: "Reguler",
    total: 260000
  },
  {
    nomorDO: "DO-2026-0004",
    nama: "Dewi Lestari",
    status: 0,
    ekspedisi: "Pos Indonesia",
    tanggalKirim: "2026-11-06",
    jenisPaket: "Kilat Khusus",
    total: 149000
  }
];

// Riwayat pemesanan (dashboard: Laporan Pemesanan & History Transaksi)
const dataPemesanan = [
  {
    nomorDO: "DO-2026-0001",
    tanggal: "2026-10-27",
    pemesan: "Astian Handal Cahya Putra",
    item: [
      { kode: "BK001", jumlah: 1 },
      { kode: "BK005", jumlah: 1 }
    ],
    pembayaran: "Transfer Bank",
    total: 208000
  },
  {
    nomorDO: "DO-2026-0002",
    tanggal: "2026-11-02",
    pemesan: "Rina Anggraini",
    item: [{ kode: "BK004", jumlah: 1 }],
    pembayaran: "E-Wallet",
    total: 119000
  },
  {
    nomorDO: "DO-2026-0003",
    tanggal: "2026-11-04",
    pemesan: "Budi Santoso",
    item: [
      { kode: "BK006", jumlah: 1 },
      { kode: "BK005", jumlah: 1 }
    ],
    pembayaran: "COD",
    total: 260000
  },
  {
    nomorDO: "DO-2026-0004",
    tanggal: "2026-11-05",
    pemesan: "Dewi Lestari",
    item: [{ kode: "BK007", jumlah: 1 }],
    pembayaran: "Transfer Bank",
    total: 149000
  }
];
