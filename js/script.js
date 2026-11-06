/* ==========================================================================
   script.js — Logika Front-End Aplikasi Pemesanan Buku Toko Online
   Tugas UTS Pemrograman Web 1
   Identitas: Astian Handal Cahya Putra · NIM: 312310527
   Panduan: Mengikuti design.md (Clean Code, Satu Fungsi Satu Tugas, Tanpa innerHTML Input)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Konstanta Global
   -------------------------------------------------------------------------- */
const PESAN_LOGIN_SALAH = "Email/password yang Anda masukkan salah";
const KUNCI_SESI_PENGGUNA = "tokobuku_pengguna_login";
const KUNCI_SESI_KERANJANG = "tokobuku_keranjang_belanja";

/* --------------------------------------------------------------------------
   2. Helper Umum
   -------------------------------------------------------------------------- */

/**
 * Format angka ke format mata uang Rupiah
 * @param {number} nominal
 * @returns {string}
 */
function formatRupiah(nominal) {
  return "Rp " + Number(nominal).toLocaleString("id-ID");
}

/**
 * Mengambil elemen DOM berdasarkan selektor CSS
 * @param {string} selektor
 * @returns {HTMLElement|null}
 */
function ambilElemen(selektor) {
  return document.querySelector(selektor);
}

/**
 * Menyimpan data ke sessionStorage dengan aman (serialisasi JSON)
 * @param {string} kunci
 * @param {any} nilai
 */
function simpanSesi(kunci, nilai) {
  try {
    sessionStorage.setItem(kunci, JSON.stringify(nilai));
  } catch (error) {
    console.error("Gagal menyimpan ke sessionStorage", error);
  }
}

/**
 * Mengambil data dari sessionStorage
 * @param {string} kunci
 * @returns {any|null}
 */
function ambilSesi(kunci) {
  try {
    const data = sessionStorage.getItem(kunci);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Gagal membaca dari sessionStorage", error);
    return null;
  }
}

/**
 * Menghapus data dari sessionStorage
 * @param {string} kunci
 */
function hapusSesi(kunci) {
  sessionStorage.removeItem(kunci);
}

/**
 * Menampilkan pesan toast singkat di pojok kanan bawah
 * @param {string} pesan
 */
function tampilkanToast(pesan) {
  let toast = ambilElemen("#toast-notifikasi");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notifikasi";
    toast.className = "toast-notifikasi";
    document.body.appendChild(toast);
  }
  toast.textContent = pesan;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

/* --------------------------------------------------------------------------
   3. Komponen Modal
   -------------------------------------------------------------------------- */

/**
 * Membuka modal berdasarkan ID modal
 * @param {string} idModal
 */
function bukaModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.add("modal-overlay--buka");
    modal.setAttribute("aria-hidden", "false");
  }
}

/**
 * Menutup modal berdasarkan ID modal
 * @param {string} idModal
 */
function tutupModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.classList.remove("modal-overlay--buka");
    modal.setAttribute("aria-hidden", "true");
  }
}

/**
 * Inisialisasi event penutup modal (klik tombol tutup, overlay, dan tombol Escape)
 */
function inisialisasiModalUniversal() {
  const daftarModal = document.querySelectorAll(".modal-overlay");
  daftarModal.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (
        event.target === modal ||
        event.target.classList.contains("js-tutup-modal")
      ) {
        modal.classList.remove("modal-overlay--buka");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      daftarModal.forEach((m) => m.classList.remove("modal-overlay--buka"));
    }
  });
}

/* --------------------------------------------------------------------------
   4. Halaman: Login (index.html)
   -------------------------------------------------------------------------- */

/**
 * Validasi isian form login
 * @param {string} email
 * @param {string} password
 * @returns {{valid: boolean, pesan: string}}
 */
function validasiFormLogin(email, password) {
  if (!email.trim() || !password.trim()) {
    return { valid: false, pesan: "Email dan password wajib diisi." };
  }
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!polaEmail.test(email)) {
    return { valid: false, pesan: "Format email tidak valid." };
  }
  return { valid: true, pesan: "" };
}

/**
 * Otentikasi data login pengguna terhadap dataPengguna di data.js
 * @param {string} email
 * @param {string} password
 * @returns {object|null}
 */
function otentikasiPengguna(email, password) {
  if (typeof dataPengguna === "undefined") return null;
  return (
    dataPengguna.find(
      (p) => p.email.toLowerCase() === email.toLowerCase() && p.password === password
    ) || null
  );
}

/**
 * Inisialisasi fitur login dan modal di index.html
 */
function inisialisasiHalamanLogin() {
  const formLogin = ambilElemen("#form-login");
  const pesanError = ambilElemen("#login-pesan-error");

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = ambilElemen("#login-email").value;
      const password = ambilElemen("#login-password").value;

      const hasilValidasi = validasiFormLogin(email, password);
      if (!hasilValidasi.valid) {
        if (pesanError) {
          pesanError.textContent = hasilValidasi.pesan;
          pesanError.classList.add("form-pesan-error--tampil");
        }
        return;
      }

      const pengguna = otentikasiPengguna(email, password);
      if (!pengguna) {
        if (pesanError) {
          pesanError.textContent = PESAN_LOGIN_SALAH;
          pesanError.classList.add("form-pesan-error--tampil");
        }
        alert(PESAN_LOGIN_SALAH);
        return;
      }

      simpanSesi(KUNCI_SESI_PENGGUNA, pengguna);
      window.location.href = "dashboard.html";
    });
  }

  // Tombol buka modal Lupa Password & Daftar
  const btnLupa = ambilElemen("#btn-buka-lupa-password");
  if (btnLupa) {
    btnLupa.addEventListener("click", () => bukaModal("modal-lupa-password"));
  }

  const btnDaftar = ambilElemen("#btn-buka-daftar");
  if (btnDaftar) {
    btnDaftar.addEventListener("click", () => bukaModal("modal-daftar"));
  }

  // Form Lupa Password simulasi
  const formLupa = ambilElemen("#form-lupa-password");
  if (formLupa) {
    formLupa.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailLupa = ambilElemen("#lupa-email").value;
      if (!emailLupa) return;
      alert(`Instruksi pengaturan ulang sandi telah dikirim ke ${emailLupa}`);
      tutupModal("modal-lupa-password");
      formLupa.reset();
    });
  }

  // Form Pendaftaran simulasi
  const formDaftar = ambilElemen("#form-daftar");
  if (formDaftar) {
    formDaftar.addEventListener("submit", (e) => {
      e.preventDefault();
      const nama = ambilElemen("#daftar-nama").value.trim();
      const email = ambilElemen("#daftar-email").value.trim();
      const password = ambilElemen("#daftar-password").value.trim();

      if (!nama || !email || !password) {
        alert("Semua data pendaftaran wajib diisi!");
        return;
      }

      if (typeof dataPengguna !== "undefined") {
        dataPengguna.push({ email, password, nama });
      }

      alert("Pendaftaran berhasil! Silakan masuk menggunakan akun baru Anda.");
      tutupModal("modal-daftar");
      formDaftar.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   5. Halaman: Dashboard (dashboard.html)
   -------------------------------------------------------------------------- */

/**
 * Menghasilkan sapaan ramah berdasarkan jam lokal
 * Sesuai aturan PRD.md subbab 4.2
 * @param {number} jam
 * @returns {string}
 */
function tentukanSapaanWaktu(jam) {
  if (jam >= 5 && jam <= 10) return "Selamat pagi";
  if (jam >= 11 && jam <= 14) return "Selamat siang";
  if (jam >= 15 && jam <= 17) return "Selamat sore";
  return "Selamat malam";
}

/**
 * Merender tabel ringkas laporan pemesanan di dalam modal
 * @param {HTMLElement} kontainer
 */
function renderTabelLaporanPemesanan(kontainer) {
  kontainer.textContent = "";
  if (typeof dataPemesanan === "undefined" || dataPemesanan.length === 0) {
    kontainer.textContent = "Belum ada laporan pemesanan.";
    return;
  }

  const tabel = document.createElement("table");
  tabel.className = "tabel-ledger";

  const thead = document.createElement("thead");
  const trH = document.createElement("tr");
  ["No. DO", "Tanggal", "Pemesan", "Metode", "Total"].forEach((teks) => {
    const th = document.createElement("th");
    th.textContent = teks;
    trH.appendChild(th);
  });
  thead.appendChild(trH);
  tabel.appendChild(thead);

  const tbody = document.createElement("tbody");
  dataPemesanan.forEach((pesanan) => {
    const tr = document.createElement("tr");

    const tdDO = document.createElement("td");
    tdDO.className = "label-kapital";
    tdDO.textContent = pesanan.nomorDO;

    const tdTgl = document.createElement("td");
    tdTgl.textContent = pesanan.tanggal;

    const tdNama = document.createElement("td");
    tdNama.textContent = pesanan.pemesan;

    const tdMetode = document.createElement("td");
    tdMetode.textContent = pesanan.pembayaran;

    const tdTotal = document.createElement("td");
    tdTotal.className = "angka-tabular";
    tdTotal.textContent = formatRupiah(pesanan.total);

    tr.append(tdDO, tdTgl, tdNama, tdMetode, tdTotal);
    tbody.appendChild(tr);
  });

  tabel.appendChild(tbody);
  kontainer.appendChild(tabel);
}

/**
 * Merender tabel history transaksi di dalam modal
 * @param {HTMLElement} kontainer
 */
function renderTabelHistoryTransaksi(kontainer) {
  kontainer.textContent = "";
  if (typeof dataPemesanan === "undefined" || dataPemesanan.length === 0) {
    kontainer.textContent = "Belum ada transaksi.";
    return;
  }

  const tabel = document.createElement("table");
  tabel.className = "tabel-ledger";

  const thead = document.createElement("thead");
  const trH = document.createElement("tr");
  ["No. DO", "Pemesan", "Jumlah Buku", "Total"].forEach((teks) => {
    const th = document.createElement("th");
    th.textContent = teks;
    trH.appendChild(th);
  });
  thead.appendChild(trH);
  tabel.appendChild(thead);

  const tbody = document.createElement("tbody");
  dataPemesanan.forEach((trx) => {
    const tr = document.createElement("tr");

    const tdDO = document.createElement("td");
    tdDO.className = "label-kapital";
    tdDO.textContent = trx.nomorDO;

    const tdNama = document.createElement("td");
    tdNama.textContent = trx.pemesan;

    const totalItem = trx.item.reduce((acc, curr) => acc + curr.jumlah, 0);
    const tdItem = document.createElement("td");
    tdItem.className = "angka-tabular";
    tdItem.textContent = `${totalItem} Buku`;

    const tdTotal = document.createElement("td");
    tdTotal.className = "angka-tabular";
    tdTotal.textContent = formatRupiah(trx.total);

    tr.append(tdDO, tdNama, tdItem, tdTotal);
    tbody.appendChild(tr);
  });

  tabel.appendChild(tbody);
  kontainer.appendChild(tabel);
}

/**
 * Inisialisasi logika dashboard
 */
function inisialisasiHalamanDashboard() {
  const pengguna = ambilSesi(KUNCI_SESI_PENGGUNA);
  const namaPengguna = pengguna ? pengguna.nama : "Astian Handal Cahya Putra";

  const elGreeting = ambilElemen("#dashboard-greeting");
  if (elGreeting) {
    const jamSekarang = new Date().getHours();
    const kataSapaan = tentukanSapaanWaktu(jamSekarang);
    elGreeting.textContent = `${kataSapaan}, ${namaPengguna}.`;
  }

  // Tombol modal Laporan Pemesanan
  const btnLaporan = ambilElemen("#btn-menu-laporan");
  if (btnLaporan) {
    btnLaporan.addEventListener("click", () => {
      const kontainer = ambilElemen("#kontainer-tabel-laporan");
      if (kontainer) renderTabelLaporanPemesanan(kontainer);
      bukaModal("modal-laporan");
    });
  }

  // Tombol modal History Transaksi
  const btnHistory = ambilElemen("#btn-menu-history");
  if (btnHistory) {
    btnHistory.addEventListener("click", () => {
      const kontainer = ambilElemen("#kontainer-tabel-history");
      if (kontainer) renderTabelHistoryTransaksi(kontainer);
      bukaModal("modal-history");
    });
  }
}

/* --------------------------------------------------------------------------
   6. Halaman: Stok / Katalog (stok.html)
   -------------------------------------------------------------------------- */

/**
 * Menambahkan buku ke dalam keranjang sessionStorage
 * @param {object} buku
 */
function tambahKeKeranjang(buku) {
  let keranjang = ambilSesi(KUNCI_SESI_KERANJANG) || [];
  const indeksAda = keranjang.findIndex((item) => item.kode === buku.kode);

  if (indeksAda >= 0) {
    keranjang[indeksAda].jumlah += 1;
  } else {
    keranjang.push({
      kode: buku.kode,
      judul: buku.judul,
      harga: buku.harga,
      jumlah: 1,
      gambar: buku.gambar
    });
  }

  simpanSesi(KUNCI_SESI_KERANJANG, keranjang);
  tampilkanToast(`"${buku.judul}" telah ditambahkan ke keranjang pesanan.`);
}

/**
 * Merender baris tabel buku menggunakan DOM createElement
 * @param {object} buku
 * @param {HTMLTableSectionElement} tbody
 * @param {boolean} sorotBaru
 */
function buatBarisTabelBuku(buku, tbody, sorotBaru = false) {
  const tr = document.createElement("tr");
  if (sorotBaru) tr.classList.add("baris-baru-sorot");

  // Kolom Sampul
  const tdSampul = document.createElement("td");
  const img = document.createElement("img");
  img.src = buku.gambar;
  img.alt = `Sampul ${buku.judul}`;
  img.className = "tabel-sampul";
  tdSampul.appendChild(img);

  // Kolom Kode
  const tdKode = document.createElement("td");
  tdKode.className = "label-kapital";
  tdKode.textContent = buku.kode;

  // Kolom Judul
  const tdJudul = document.createElement("td");
  tdJudul.style.fontWeight = "600";
  tdJudul.textContent = buku.judul;

  // Kolom Kategori
  const tdKategori = document.createElement("td");
  tdKategori.textContent = buku.kategori;

  // Kolom Harga
  const tdHarga = document.createElement("td");
  tdHarga.className = "angka-tabular";
  tdHarga.textContent = formatRupiah(buku.harga);

  // Kolom Stok
  const tdStok = document.createElement("td");
  tdStok.className = "angka-tabular";
  if (Number(buku.stok) === 0) {
    const stampHabis = document.createElement("span");
    stampHabis.className = "stempel";
    stampHabis.textContent = "HABIS";
    tdStok.appendChild(stampHabis);
  } else {
    tdStok.textContent = `${buku.stok} eks.`;
  }

  // Kolom Aksi
  const tdAksi = document.createElement("td");
  const pembungkusTombol = document.createElement("div");
  pembungkusTombol.style.display = "flex";
  pembungkusTombol.style.gap = "8px";

  const btnPesan = document.createElement("button");
  btnPesan.type = "button";
  btnPesan.className = "tombol tombol--utama tombol--kecil";
  btnPesan.textContent = "Pesan";
  if (Number(buku.stok) === 0) {
    btnPesan.disabled = true;
    btnPesan.style.opacity = "0.5";
    btnPesan.style.cursor = "not-allowed";
  } else {
    btnPesan.addEventListener("click", () => tambahKeKeranjang(buku));
  }

  const btnHapus = document.createElement("button");
  btnHapus.type = "button";
  btnHapus.className = "tombol tombol--bahaya tombol--kecil";
  btnHapus.textContent = "Hapus";
  btnHapus.addEventListener("click", () => {
    if (confirm(`Yakin ingin menghapus judul "${buku.judul}" (${buku.kode}) dari katalog?`)) {
      hapusBukuDariKatalog(buku.kode, tr);
    }
  });

  pembungkusTombol.append(btnPesan, btnHapus);
  tdAksi.appendChild(pembungkusTombol);

  tr.append(tdSampul, tdKode, tdJudul, tdKategori, tdHarga, tdStok, tdAksi);
  tbody.appendChild(tr);
}

/**
 * Menghapus buku dari dataKatalogBuku dan menghapus elemen dari DOM
 * @param {string} kode
 * @param {HTMLTableRowElement} trElement
 */
function hapusBukuDariKatalog(kode, trElement) {
  if (typeof dataKatalogBuku !== "undefined") {
    const indeks = dataKatalogBuku.findIndex((b) => b.kode === kode);
    if (indeks >= 0) {
      dataKatalogBuku.splice(indeks, 1);
    }
  }
  trElement.remove();
  perbaruiHitunganKatalog();
  tampilkanToast(`Buku ${kode} berhasil dihapus.`);
}

/**
 * Memperbarui teks hitungan jumlah judul di katalog
 */
function perbaruiHitunganKatalog() {
  const elHitungan = ambilElemen("#katalog-jumlah-judul");
  if (elHitungan && typeof dataKatalogBuku !== "undefined") {
    elHitungan.textContent = `${dataKatalogBuku.length} JUDUL TERCATAT`;
  }
}

/**
 * Memuat dan merender seluruh isi dataKatalogBuku ke tabel
 */
function renderTabelKatalogLengkap() {
  const tbody = ambilElemen("#tbody-katalog-buku");
  if (!tbody || typeof dataKatalogBuku === "undefined") return;

  tbody.textContent = "";
  dataKatalogBuku.forEach((buku) => {
    buatBarisTabelBuku(buku, tbody, false);
  });
  perbaruiHitunganKatalog();
}

/**
 * Validasi form tambah buku baru
 * @param {object} input
 * @returns {{valid: boolean, pesan: string}}
 */
function validasiBukuBaru(input) {
  if (!input.kode || !input.judul || !input.kategori || !input.gambar) {
    return { valid: false, pesan: "Semua data buku wajib diisi." };
  }
  if (isNaN(input.harga) || Number(input.harga) < 0) {
    return { valid: false, pesan: "Harga harus berupa angka valid (>= 0)." };
  }
  if (isNaN(input.stok) || Number(input.stok) < 0) {
    return { valid: false, pesan: "Stok harus berupa angka valid (>= 0)." };
  }
  if (typeof dataKatalogBuku !== "undefined") {
    const sudahAda = dataKatalogBuku.some(
      (b) => b.kode.toUpperCase() === input.kode.toUpperCase()
    );
    if (sudahAda) {
      return { valid: false, pesan: `Kode buku "${input.kode}" sudah terdaftar.` };
    }
  }
  return { valid: true, pesan: "" };
}

/**
 * Inisialisasi halaman stok.html
 */
function inisialisasiHalamanStok() {
  renderTabelKatalogLengkap();

  const formTambah = ambilElemen("#form-tambah-buku");
  const pesanError = ambilElemen("#stok-pesan-error");

  if (formTambah) {
    formTambah.addEventListener("submit", (e) => {
      e.preventDefault();

      const inputBuku = {
        kode: ambilElemen("#stok-kode").value.trim().toUpperCase(),
        judul: ambilElemen("#stok-judul").value.trim(),
        kategori: ambilElemen("#stok-kategori").value.trim(),
        harga: Number(ambilElemen("#stok-harga").value),
        stok: Number(ambilElemen("#stok-stok").value),
        gambar: ambilElemen("#stok-gambar").value
      };

      const hasil = validasiBukuBaru(inputBuku);
      if (!hasil.valid) {
        if (pesanError) {
          pesanError.textContent = hasil.pesan;
          pesanError.classList.add("form-pesan-error--tampil");
        }
        return;
      }

      if (pesanError) pesanError.classList.remove("form-pesan-error--tampil");

      // Simpan ke array dataKatalogBuku
      if (typeof dataKatalogBuku !== "undefined") {
        dataKatalogBuku.push(inputBuku);
      }

      // Tambahkan ke DOM secara dinamis dengan efek sorotan
      const tbody = ambilElemen("#tbody-katalog-buku");
      if (tbody) {
        buatBarisTabelBuku(inputBuku, tbody, true);
      }

      perbaruiHitunganKatalog();
      formTambah.reset();
      tampilkanToast(`Buku "${inputBuku.judul}" berhasil ditambahkan.`);
    });
  }
}

/* --------------------------------------------------------------------------
   7. Halaman: Checkout / Pemesanan (checkout.html)
   -------------------------------------------------------------------------- */

/**
 * Mendapatkan keranjang aktif atau menginisialisasi sampel jika kosong
 * @returns {Array}
 */
function ambilKeranjangBelanja() {
  let keranjang = ambilSesi(KUNCI_SESI_KERANJANG);
  if (!keranjang || keranjang.length === 0) {
    if (typeof dataKatalogBuku !== "undefined" && dataKatalogBuku.length >= 2) {
      keranjang = [
        {
          kode: dataKatalogBuku[0].kode,
          judul: dataKatalogBuku[0].judul,
          harga: dataKatalogBuku[0].harga,
          jumlah: 1,
          gambar: dataKatalogBuku[0].gambar
        },
        {
          kode: dataKatalogBuku[4].kode,
          judul: dataKatalogBuku[4].judul,
          harga: dataKatalogBuku[4].harga,
          jumlah: 1,
          gambar: dataKatalogBuku[4].gambar
        }
      ];
      simpanSesi(KUNCI_SESI_KERANJANG, keranjang);
    } else {
      keranjang = [];
    }
  }
  return keranjang;
}

/**
 * Menghitung subtotal pesanan di keranjang
 * @param {Array} keranjang
 * @returns {number}
 */
function hitungTotalPesanan(keranjang) {
  return keranjang.reduce((total, item) => total + item.harga * item.jumlah, 0);
}

/**
 * Merender tabel keranjang di nota checkout
 */
function renderTabelCheckout() {
  const tbody = ambilElemen("#tbody-checkout");
  const elTotal = ambilElemen("#checkout-total-angka");
  if (!tbody) return;

  tbody.textContent = "";
  const keranjang = ambilKeranjangBelanja();

  if (keranjang.length === 0) {
    const trKosong = document.createElement("tr");
    const tdKosong = document.createElement("td");
    tdKosong.colSpan = 5;
    tdKosong.style.textAlign = "center";
    tdKosong.style.padding = "24px";
    tdKosong.textContent = "Keranjang pesanan masih kosong. Silakan tambah buku.";
    trKosong.appendChild(tdKosong);
    tbody.appendChild(trKosong);

    if (elTotal) elTotal.textContent = formatRupiah(0);
    return;
  }

  keranjang.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Judul & Kode
    const tdInfo = document.createElement("td");
    const spanJudul = document.createElement("div");
    spanJudul.style.fontWeight = "600";
    spanJudul.textContent = item.judul;
    const spanKode = document.createElement("span");
    spanKode.className = "label-kapital";
    spanKode.textContent = item.kode;
    tdInfo.append(spanJudul, spanKode);

    // Harga Satuan
    const tdHarga = document.createElement("td");
    tdHarga.className = "angka-tabular";
    tdHarga.textContent = formatRupiah(item.harga);

    // Kuantitas (Ubah Jumlah)
    const tdJumlah = document.createElement("td");
    const pembungkusQty = document.createElement("div");
    pembungkusQty.style.display = "flex";
    pembungkusQty.style.alignItems = "center";
    pembungkusQty.style.gap = "4px";

    const btnMinus = document.createElement("button");
    btnMinus.type = "button";
    btnMinus.className = "tombol tombol--kecil";
    btnMinus.textContent = "-";
    btnMinus.addEventListener("click", () => ubahKuantitasKeranjang(index, -1));

    const spanAngka = document.createElement("span");
    spanAngka.className = "angka-tabular";
    spanAngka.style.minWidth = "24px";
    spanAngka.style.textAlign = "center";
    spanAngka.textContent = item.jumlah;

    const btnPlus = document.createElement("button");
    btnPlus.type = "button";
    btnPlus.className = "tombol tombol--kecil";
    btnPlus.textContent = "+";
    btnPlus.addEventListener("click", () => ubahKuantitasKeranjang(index, 1));

    pembungkusQty.append(btnMinus, spanAngka, btnPlus);
    tdJumlah.appendChild(pembungkusQty);

    // Subtotal
    const tdSubtotal = document.createElement("td");
    tdSubtotal.className = "angka-tabular";
    tdSubtotal.style.fontWeight = "600";
    tdSubtotal.textContent = formatRupiah(item.harga * item.jumlah);

    // Tombol Hapus
    const tdAksi = document.createElement("td");
    const btnHapus = document.createElement("button");
    btnHapus.type = "button";
    btnHapus.className = "tombol tombol--bahaya tombol--kecil";
    btnHapus.textContent = "×";
    btnHapus.title = "Hapus item ini";
    btnHapus.addEventListener("click", () => hapusItemKeranjang(index));
    tdAksi.appendChild(btnHapus);

    tr.append(tdInfo, tdHarga, tdJumlah, tdSubtotal, tdAksi);
    tbody.appendChild(tr);
  });

  const total = hitungTotalPesanan(keranjang);
  if (elTotal) elTotal.textContent = formatRupiah(total);
}

/**
 * Mengubah jumlah kuantitas item di keranjang
 * @param {number} indeks
 * @param {number} delta
 */
function ubahKuantitasKeranjang(indeks, delta) {
  const keranjang = ambilKeranjangBelanja();
  if (!keranjang[indeks]) return;

  keranjang[indeks].jumlah += delta;
  if (keranjang[indeks].jumlah <= 0) {
    keranjang.splice(indeks, 1);
  }

  simpanSesi(KUNCI_SESI_KERANJANG, keranjang);
  renderTabelCheckout();
}

/**
 * Menghapus satu item dari keranjang
 * @param {number} indeks
 */
function hapusItemKeranjang(indeks) {
  const keranjang = ambilKeranjangBelanja();
  keranjang.splice(indeks, 1);
  simpanSesi(KUNCI_SESI_KERANJANG, keranjang);
  renderTabelCheckout();
}

/**
 * Mengisi dropdown pilihan katalog untuk menambah item ke keranjang
 */
function isiDropdownKatalogCheckout() {
  const select = ambilElemen("#pilih-tambah-katalog");
  if (!select || typeof dataKatalogBuku === "undefined") return;

  select.textContent = "";
  const opsiAwal = document.createElement("option");
  opsiAwal.value = "";
  opsiAwal.textContent = "-- Pilih Buku untuk Ditambahkan --";
  select.appendChild(opsiAwal);

  dataKatalogBuku.forEach((buku) => {
    if (buku.stok > 0) {
      const opt = document.createElement("option");
      opt.value = buku.kode;
      opt.textContent = `${buku.kode} — ${buku.judul} (${formatRupiah(buku.harga)})`;
      select.appendChild(opt);
    }
  });
}

/**
 * Validasi form data pemesan dan pembayaran
 * @param {object} data
 * @returns {{valid: boolean, pesan: string, field: string}}
 */
function validasiFormCheckout(data) {
  if (!data.nama) return { valid: false, field: "checkout-nama", pesan: "Nama pemesan wajib diisi." };
  if (!data.email) return { valid: false, field: "checkout-email", pesan: "Email pemesan wajib diisi." };
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!polaEmail.test(data.email)) return { valid: false, field: "checkout-email", pesan: "Format email tidak valid." };
  if (!data.telepon) return { valid: false, field: "checkout-telepon", pesan: "Nomor HP wajib diisi." };
  if (!data.alamat) return { valid: false, field: "checkout-alamat", pesan: "Alamat pengiriman wajib diisi." };
  if (!data.metode) return { valid: false, field: "checkout-metode", pesan: "Pilih metode pembayaran." };
  if (!data.ekspedisi) return { valid: false, field: "checkout-ekspedisi", pesan: "Pilih jasa ekspedisi." };
  return { valid: true, pesan: "", field: "" };
}

/**
 * Membuat nomor Delivery Order unik berurutan
 * @returns {string}
 */
function buatNomorDOBaru() {
  const tahun = new Date().getFullYear();
  let urutan = 1;
  if (typeof dataTracking !== "undefined" && dataTracking.length > 0) {
    urutan = dataTracking.length + 1;
  }
  const urutanPadded = String(urutan).padStart(4, "0");
  return `DO-${tahun}-${urutanPadded}`;
}

/**
 * Inisialisasi halaman checkout.html
 */
function inisialisasiHalamanCheckout() {
  renderTabelCheckout();
  isiDropdownKatalogCheckout();

  // Tombol tambah item katalog ke keranjang
  const btnTambahItem = ambilElemen("#btn-tambah-ke-keranjang");
  if (btnTambahItem) {
    btnTambahItem.addEventListener("click", () => {
      const select = ambilElemen("#pilih-tambah-katalog");
      const kode = select.value;
      if (!kode || typeof dataKatalogBuku === "undefined") return;

      const buku = dataKatalogBuku.find((b) => b.kode === kode);
      if (buku) {
        tambahKeKeranjang(buku);
        renderTabelCheckout();
        select.value = "";
      }
    });
  }

  // Submit pesanan
  const formPemesanan = ambilElemen("#form-pemesanan-checkout");
  if (formPemesanan) {
    // Isi otomatis nama pemesan dari sesi jika ada
    const pengguna = ambilSesi(KUNCI_SESI_PENGGUNA);
    if (pengguna) {
      const inputNama = ambilElemen("#checkout-nama");
      const inputEmail = ambilElemen("#checkout-email");
      if (inputNama && !inputNama.value) inputNama.value = pengguna.nama;
      if (inputEmail && !inputEmail.value) inputEmail.value = pengguna.email;
    }

    formPemesanan.addEventListener("submit", (e) => {
      e.preventDefault();

      const keranjang = ambilKeranjangBelanja();
      if (keranjang.length === 0) {
        alert("Keranjang pesanan masih kosong! Silakan tambahkan minimal 1 buku.");
        return;
      }

      const dataForm = {
        nama: ambilElemen("#checkout-nama").value.trim(),
        email: ambilElemen("#checkout-email").value.trim(),
        telepon: ambilElemen("#checkout-telepon").value.trim(),
        alamat: ambilElemen("#checkout-alamat").value.trim(),
        metode: ambilElemen("#checkout-metode").value,
        ekspedisi: ambilElemen("#checkout-ekspedisi").value,
        paket: ambilElemen("#checkout-paket").value || "Reguler"
      };

      // Reset pesan error form
      document.querySelectorAll(".form-pesan-error").forEach((el) => {
        el.classList.remove("form-pesan-error--tampil");
        el.textContent = "";
      });

      const hasil = validasiFormCheckout(dataForm);
      if (!hasil.valid) {
        const errEl = ambilElemen(`#error-${hasil.field}`);
        if (errEl) {
          errEl.textContent = hasil.pesan;
          errEl.classList.add("form-pesan-error--tampil");
        }
        return;
      }

      // Buat nomor DO & simpan data
      const nomorDO = buatNomorDOBaru();
      const totalHarga = hitungTotalPesanan(keranjang);
      const tanggalSekarang = new Date().toISOString().split("T")[0];

      // Simpan ke dataPemesanan
      if (typeof dataPemesanan !== "undefined") {
        dataPemesanan.unshift({
          nomorDO: nomorDO,
          tanggal: tanggalSekarang,
          pemesan: dataForm.nama,
          item: keranjang.map((k) => ({ kode: k.kode, jumlah: k.jumlah })),
          pembayaran: dataForm.metode,
          total: totalHarga
        });
      }

      // Simpan ke dataTracking
      if (typeof dataTracking !== "undefined") {
        dataTracking.unshift({
          nomorDO: nomorDO,
          nama: dataForm.nama,
          status: 0, // Diproses
          ekspedisi: dataForm.ekspedisi,
          tanggalKirim: tanggalSekarang,
          jenisPaket: dataForm.paket,
          total: totalHarga
        });
      }

      // Tampilkan Modal Konfirmasi dengan Stempel
      const elDO = ambilElemen("#modal-konfirmasi-do");
      const elNama = ambilElemen("#modal-konfirmasi-nama");
      const elTotal = ambilElemen("#modal-konfirmasi-total");
      const linkTracking = ambilElemen("#modal-konfirmasi-link-tracking");

      if (elDO) elDO.textContent = nomorDO;
      if (elNama) elNama.textContent = dataForm.nama;
      if (elTotal) elTotal.textContent = formatRupiah(totalHarga);
      if (linkTracking) linkTracking.href = `tracking.html?do=${nomorDO}`;

      bukaModal("modal-konfirmasi-pesanan");

      // Kosongkan keranjang setelah checkout sukses
      hapusSesi(KUNCI_SESI_KERANJANG);
      renderTabelCheckout();
      formPemesanan.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   8. Halaman: Tracking (tracking.html)
   -------------------------------------------------------------------------- */

/**
 * Mencari data pengiriman berdasarkan Nomor Delivery Order
 * @param {string} nomorDO
 * @returns {object|null}
 */
function cariDataTracking(nomorDO) {
  if (typeof dataTracking === "undefined") return null;
  const kataKunci = nomorDO.trim().toUpperCase();
  return dataTracking.find((t) => t.nomorDO.toUpperCase() === kataKunci) || null;
}

/**
 * Merender progress pengiriman bertahap (tiket)
 * @param {number} statusAktif (0 s.d 4)
 * @param {HTMLElement} kontainer
 */
function renderProgressTiket(statusAktif, kontainer) {
  kontainer.textContent = "";
  const daftarTahap = [
    "Diproses",
    "Dikemas",
    "Dikirim",
    "Dalam Perjalanan",
    "Diterima"
  ];

  daftarTahap.forEach((namaTahap, index) => {
    const item = document.createElement("div");
    item.className = "tiket-step";

    // Titik lingkaran
    const titik = document.createElement("div");
    titik.className = "tiket-step__titik";

    if (index < statusAktif) {
      titik.classList.add("tiket-step__titik--selesai");
      titik.textContent = "✓";
    } else if (index === statusAktif) {
      titik.classList.add("tiket-step__titik--aktif");
      titik.textContent = String(index + 1);
    } else {
      titik.classList.add("tiket-step__titik--belum");
      titik.textContent = String(index + 1);
    }

    // Label tahap
    const label = document.createElement("div");
    label.className = "tiket-step__label";
    label.textContent = namaTahap;

    item.append(titik, label);
    kontainer.appendChild(item);
  });
}

/**
 * Menampilkan rincian data tracking yang ditemukan
 * @param {object} hasil
 */
function tampilkanHasilTracking(hasil) {
  const kontainerHasil = ambilElemen("#kontainer-hasil-tracking");
  const pesanError = ambilElemen("#tracking-pesan-error");

  if (pesanError) pesanError.style.display = "none";
  if (!kontainerHasil) return;

  kontainerHasil.style.display = "block";

  ambilElemen("#hasil-nama-pemesan").textContent = hasil.nama;
  ambilElemen("#hasil-nomor-do").textContent = hasil.nomorDO;
  ambilElemen("#hasil-ekspedisi").textContent = hasil.ekspedisi;
  ambilElemen("#hasil-paket").textContent = hasil.jenisPaket;
  ambilElemen("#hasil-tanggal").textContent = hasil.tanggalKirim;
  ambilElemen("#hasil-total").textContent = formatRupiah(hasil.total);

  // Render Tiket Progress Pengiriman
  const kontainerTiket = ambilElemen("#kontainer-tiket-progress");
  if (kontainerTiket) {
    renderProgressTiket(hasil.status, kontainerTiket);
  }

  // Tampilkan stempel DITERIMA jika status === 4
  const areaStempel = ambilElemen("#area-stempel-diterima");
  if (areaStempel) {
    areaStempel.textContent = "";
    if (hasil.status === 4) {
      const stamp = document.createElement("span");
      stamp.className = "stempel";
      stamp.textContent = "DITERIMA";
      areaStempel.appendChild(stamp);
    }
  }
}

/**
 * Inisialisasi halaman tracking.html
 */
function inisialisasiHalamanTracking() {
  const formTracking = ambilElemen("#form-tracking");
  const inputDO = ambilElemen("#input-nomor-do");
  const pesanError = ambilElemen("#tracking-pesan-error");
  const kontainerHasil = ambilElemen("#kontainer-hasil-tracking");

  function prosesPencarian(nomor) {
    if (!nomor.trim()) {
      if (pesanError) {
        pesanError.textContent = "Silakan masukkan Nomor Delivery Order.";
        pesanError.style.display = "block";
      }
      if (kontainerHasil) kontainerHasil.style.display = "none";
      return;
    }

    const data = cariDataTracking(nomor);
    if (!data) {
      if (pesanError) {
        pesanError.textContent = `Nomor Delivery Order "${nomor}" tidak ditemukan dalam sistem.`;
        pesanError.style.display = "block";
      }
      if (kontainerHasil) kontainerHasil.style.display = "none";
      return;
    }

    tampilkanHasilTracking(data);
  }

  if (formTracking) {
    formTracking.addEventListener("submit", (e) => {
      e.preventDefault();
      prosesPencarian(inputDO.value);
    });
  }

  // Badge nomor DO untuk kemudahan dosen/penguji
  const badges = document.querySelectorAll(".js-klik-do");
  badges.forEach((badge) => {
    badge.addEventListener("click", () => {
      const noDO = badge.getAttribute("data-do");
      if (inputDO) inputDO.value = noDO;
      prosesPencarian(noDO);
    });
  });

  // Periksa apakah ada parameter ?do= di URL
  const urlParams = new URLSearchParams(window.location.search);
  const doDariUrl = urlParams.get("do");
  if (doDariUrl) {
    if (inputDO) inputDO.value = doDariUrl;
    prosesPencarian(doDariUrl);
  }
}

/* --------------------------------------------------------------------------
   9. Inisialisasi Aplikasi Universal (Router Sederhana)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  inisialisasiModalUniversal();

  // Tombol Logout di Header Navigasi
  const btnLogout = ambilElemen("#btn-logout-header");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      hapusSesi(KUNCI_SESI_PENGGUNA);
      alert("Anda telah keluar dari sistem.");
      window.location.href = "index.html";
    });
  }

  const halaman = document.body.dataset.halaman;
  switch (halaman) {
    case "login":
      inisialisasiHalamanLogin();
      break;
    case "dashboard":
      inisialisasiHalamanDashboard();
      break;
    case "stok":
      inisialisasiHalamanStok();
      break;
    case "checkout":
      inisialisasiHalamanCheckout();
      break;
    case "tracking":
      inisialisasiHalamanTracking();
      break;
    default:
      break;
  }
});

