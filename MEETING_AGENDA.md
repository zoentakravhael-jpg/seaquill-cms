# 📋 Agenda Meeting — Presentasi Website Sea-Quill

**Tanggal:** 9 April 2026  
**Topik:** Presentasi & Review Website Sea-Quill  
**Durasi:** ± 90-120 menit  
**URL:** https://seaquill-cms-production.up.railway.app/

---

## 1. Opening & Perkenalan (5 menit)

- Salam & perkenalan tim
- Tujuan meeting: review website yang sudah dibangun, diskusi konten, dan rencana go-live

---

## 2. Overview Teknologi & Arsitektur (5 menit)

- **Framework:** Next.js 16 (React, server-side rendering)
- **Database:** PostgreSQL (semua konten dari database, bisa dikelola via admin)
- **Hosting:** Railway (cloud hosting)
- **Keamanan:** JWT authentication, XSS protection, rate limiting, security headers
- **SEO:** Sitemap otomatis, structured data Google, meta tags per halaman
- **Performa:** Image optimization (AVIF/WebP), caching 60 detik, font optimization

---

## 3. Demo Halaman Publik (40 menit)

### 3.1 Global Layout (semua halaman)

Setiap halaman memiliki:

- **Preloader** — Animasi loading saat halaman dibuka
- **Header** (sticky saat scroll):
  - Logo + badge info (bisa diganti dari admin)
  - Navigasi utama: Beranda, Tentang, Produk (submenu kategori otomatis dari DB), Artikel (submenu kategori otomatis dari DB), Promo & Event, Galeri, Hubungi Kami
  - Tombol marketplace (Tokopedia & Shopee)
  - Menu hamburger untuk mobile
  - Side drawer: logo, deskripsi, recent posts, social media
  - Search popup (fullscreen)
- **Footer** (4 kolom):
  - Kolom 1: Logo + deskripsi perusahaan
  - Kolom 2: Link produk per kategori (otomatis dari DB)
  - Kolom 3: Link artikel per kategori (otomatis dari DB)
  - Kolom 4: Bantuan & Support (FAQ, Kontak, Privasi, S&K)
  - Info kontak: telepon, email, alamat
  - Tagline + tombol marketplace (Tokopedia & Shopee)
  - Copyright + ikon social media (Facebook, Twitter, LinkedIn, Instagram, WhatsApp)
- **Scroll to Top** button
- **Animasi** scroll (fade-in, slide effects)

---

### 3.2 Homepage `/`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Hero Slider** | Slider full-width dengan efek fade. Setiap slide: subtitle, judul utama, 2 tombol CTA ("Jelajahi Produk" & "Cek Manfaat Suplemen"), gambar background. Autoplay + pagination dots. Link social media di sisi kiri. Tombol scroll-down. |
| 2 | **Feature Cards** | 3 kartu: "Tips & Edukasi Kesehatan", "Terstandar BPOM & Halal", "100% Original & Promo Menarik". Masing-masing punya judul, deskripsi, tombol CTA. |
| 3 | **About Section** | Judul "Pilihan Tepat, untuk Hidup Sehat dan Berkualitas". Paragraf deskripsi perusahaan. Checklist 5 poin (BPOM, rekomendasi ahli, formula Indonesia, gaya hidup sehat, pilihan lengkap). Tombol "Selengkapnya Tentang Sea-Quill". 3 gambar dekoratif. |
| 4 | **Service List** | Judul "Manfaat Utama Produk Sea-Quill". 4 layanan: Imunitas & Daya Tahan Tubuh, Kesehatan Jantung & Pembuluh Darah, Nutrisi Anak & Keluarga, Vitalitas & Energi. Masing-masing: ikon, judul, deskripsi, gambar, tombol link. |
| 5 | **Produk Unggulan** | Slider produk (maks 12 produk dengan badge "Best Seller" atau "New"). Setiap kartu: gambar, badge, judul, deskripsi. Navigasi panah kiri/kanan. Autoplay. |
| 6 | **Brand Partners** | Slider logo partner resmi: Kimia Farma, Watsons, Guardian, Wellings, Boston, Century, Boots. Grayscale → berwarna saat hover. Autoplay. |
| 7 | **Blog & Berita** | Slider 6 artikel terbaru. Setiap kartu: gambar, nama penulis, judul, link "Selengkapnya". Navigasi panah. |

---

### 3.3 Halaman Produk `/produk`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner dengan judul halaman |
| 2 | **Kategori Produk** | 8 kartu kategori (ikon, judul, deskripsi, tombol "Selengkapnya"): Beauty & Health, Mom & Kids, Multivitamin, Vitamin & Mineral, Kesehatan Jantung, Kesehatan Kulit, Kesehatan Sendi, Vitamin Kolesterol |
| 3 | **Grid Produk** | Semua produk dalam grid. Filter pencarian client-side (ketik nama/tag). Setiap kartu: gambar + badge Best Seller/New, nama, tombol "LIHAT DETAIL", ikon aksi (eye/cart/heart) |
| 4 | **Pagination** | Tombol halaman 1-4 + Next (UI only, belum fungsional) |

---

### 3.4 Halaman Kategori Produk `/produk/[kategori]`

- Sama seperti halaman produk, tapi terfilter per kategori
- Mendukung kategori virtual: "Best Seller" dan "Produk Baru"
- Judul halaman otomatis sesuai nama kategori

---

### 3.5 Detail Produk `/produk/detail/[slug]`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Galeri Gambar** | Gambar utama besar + strip thumbnail di bawah. Klik thumbnail untuk ganti gambar utama. Navigasi panah. |
| 3 | **Info Produk** | Nama produk, rating bintang, jumlah review, deskripsi singkat, checklist fitur, tombol marketplace (Tokopedia & Shopee), SKU, kategori, tags, status stok |
| 4 | **Tab Konten** | **Tab 1: Deskripsi** — Konten HTML lengkap. **Tab 2: Informasi Tambahan** — Komposisi, dosis, kategori, SKU. **Tab 3: Ulasan** — Review produk dengan rating bintang. |
| 5 | **Produk Terkait** | Slider maks 6 produk dari kategori sama. Panah navigasi. |

---

### 3.6 Halaman Artikel `/artikel`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Grid Artikel** (kolom 8/12) | Kartu artikel: gambar, nama penulis, judul, tombol "Read More" |
| 3 | **Sidebar** (kolom 4/12) | **Search** — Kotak pencarian → ke halaman `/search`. **Recent Posts** — 4 artikel terbaru (gambar, tanggal, judul). **Form Konsultasi Gratis** — Input nama, email, telepon, pesan → kirim ke server. **Banner CTA** — Tombol "Hubungi Kami" |
| 4 | **Pagination** | UI only, belum fungsional |

---

### 3.7 Halaman Kategori Artikel `/artikel/[kategori]`

- Sama seperti halaman artikel, terfilter per kategori
- 5 kategori: Tips Sehat, Imun & Daya Tahan Tubuh, Nutrisi & Gizi, Panduan Suplemen, Kecantikan

---

### 3.8 Detail Artikel `/artikel/detail/[slug]`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Konten Artikel** (8/12) | Gambar utama, meta (penulis, tanggal, kategori), judul, konten HTML lengkap, tags, link share social media (Facebook, Twitter, LinkedIn, Instagram) |
| 3 | **Komentar** | 3 komentar sample (Rina, Budi, Siti) dengan balasan bersarang |
| 4 | **Form Komentar** | Input nama, email, website, komentar + checkbox simpan data (UI only, belum terhubung) |
| 5 | **Sidebar** (4/12) | Sama seperti halaman artikel listing |

---

### 3.9 Tentang Sea-Quill `/tentang`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **About Area** | Gambar, subtitle, heading, paragraf deskripsi, checklist poin-poin, gambar/video (mendukung mp4/webm), tombol play video |
| 3 | **Feature Cards** | 3 kartu dengan judul, deskripsi, tombol CTA |
| 4 | **Project Slider** | Slider dengan konten tentang perusahaan. Masing-masing: gambar, judul, teks. Autoplay + navigasi panah. |

---

### 3.10 Galeri `/galeri`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Slider per Platform** | Satu slider per platform social media (Instagram, Facebook, TikTok). 1-4 item per view. Setiap item: gambar dengan overlay ikon platform, link ke posting di platform tersebut. Hanya platform yang punya item yang ditampilkan. |

---

### 3.11 Hubungi Kami `/hubungi-kami`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Social Media** | Tab interface — klik platform (Instagram, Facebook, TikTok) untuk lihat deskripsi + tombol kunjungi. Animasi dekoratif. |
| 3 | **Marketplace** | Tab interface — klik marketplace (Tokopedia, Shopee, dll) untuk lihat deskripsi + tombol beli. |
| 4 | **Form Kontak** | Form lengkap: Nama, Email, Subject, Telepon, Pesan → kirim ke server. Mendukung custom form dari Form Builder. Loading state + pesan sukses/error. Opsi redirect ke WhatsApp setelah kirim. |

---

### 3.12 Promo & Event `/promo`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | Banner judul halaman |
| 2 | **Promo** | Grid kartu promo: gambar, judul, deskripsi, ikon panah |
| 3 | **Event** | Event pertama tampil besar, selebihnya format kecil. Setiap event: tanggal, lokasi, judul, deskripsi, tombol CTA. Animasi dekoratif. |

---

### 3.13 Pencarian `/search?q=...`

| # | Section | Isi |
|---|---------|-----|
| 1 | **Breadcrumb** | "Hasil Pencarian" |
| 2 | **Judul** | "Hasil pencarian untuk '{query}' (X ditemukan)" |
| 3 | **Hasil Produk** | Grid kartu produk yang cocok (maks 20 hasil) |
| 4 | **Hasil Artikel** | Grid kartu artikel yang cocok (maks 20 hasil) |
| 5 | **Tidak Ada Hasil** | Pesan "Tidak ada hasil" jika kosong |

Pencarian mencari di: nama produk, deskripsi, tags + judul artikel, excerpt, tags. Minimal 2 karakter.

---

## 4. Demo Admin Panel / CMS (20 menit)

| # | Menu | Fitur |
|---|------|-------|
| 1 | **Dashboard** | Kartu statistik (produk, artikel, kategori, pesan). 3 chart (bar: produk per kategori, line: artikel per bulan, donut: pesan per bulan). Daftar pesan terbaru. Daftar produk terbaru. |
| 2 | **Produk** | List + Create + Edit. Field: nama, slug, SKU, deskripsi singkat & lengkap (rich text), gambar, kategori, tags, harga, stok, badge (Best Seller/New), SEO fields, status draft/publish. |
| 3 | **Artikel** | List + Create + Edit. Rich text editor untuk konten. Field: judul, slug, excerpt, author, kategori, tags, gambar, SEO fields, status draft/publish. |
| 4 | **Kategori Produk** | CRUD 8 kategori dengan ikon, deskripsi, slug |
| 5 | **Kategori Artikel** | CRUD 5 kategori blog |
| 6 | **Hero Slides** | CRUD slider homepage (subtitle, judul, gambar background, CTA, urutan, aktif/nonaktif, group) |
| 7 | **Brand Partners** | CRUD logo partner (nama, gambar, URL, urutan, aktif/nonaktif) |
| 8 | **Galeri** | CRUD item galeri (gambar, caption, platform, URL, urutan) |
| 9 | **Promo** | CRUD item promo (judul, deskripsi, gambar, aktif/nonaktif) |
| 10 | **Event** | CRUD item event (judul, deskripsi, gambar, tanggal, lokasi, CTA) |
| 11 | **Pesan Masuk** | Lihat & kelola pesan dari form kontak & konsultasi |
| 12 | **Users** | Kelola akun admin (create/edit/delete) |
| 13 | **Media Library** | Upload & browse semua file gambar/media |
| 14 | **Form Builder** | Buat form custom dengan field bebas (text, email, select, radio, checkbox, dll). Preview form. Lihat submissions. |
| 15 | **Layout Pages** | Editor per-halaman: Homepage, Tentang, Produk, Artikel, Galeri, Promo, Hubungi Kami — edit section tanpa coding |
| 16 | **Settings** | Semua pengaturan situs: kontak, social media, deskripsi, copyright, tagline, footer navigasi, dll |
| 17 | **Activity Log** | Histori semua perubahan (siapa edit/create/delete apa) |
| 18 | **Trash** | Item yang sudah dihapus — bisa restore atau hapus permanen |

---

## 5. Yang Perlu Disiapkan oleh Client (15 menit)

### 🔴 Prioritas Tinggi (harus ada sebelum go-live)

| # | Item | Status Saat Ini | Yang Dibutuhkan |
|---|------|-----------------|-----------------|
| 1 | Artikel blog | 8 artikel placeholder Bahasa Inggris | **Min 8-10 artikel Bahasa Indonesia** tentang suplemen/kesehatan |
| 2 | Nama penulis | Fiktif (Jane Doe, John Smith dll) | **Nama Indonesia** atau "Tim Redaksi Sea-Quill" |
| 3 | Nomor telepon | Placeholder `021-1234-5678` | **Nomor asli** |
| 4 | WhatsApp | Placeholder `6281234567890` | **Nomor WhatsApp asli** |
| 5 | Email | `info.seaquill@gmail.com` | Konfirmasi atau ganti ke **email resmi** |
| 6 | Alamat | Jl. Harmoni Plaza Blok A No. 8 | **Verifikasi alamat** |

### 🟡 Prioritas Sedang

| # | Item | Status Saat Ini | Yang Dibutuhkan |
|---|------|-----------------|-----------------|
| 7 | Handle social media | Tidak konsisten antar halaman | **Konfirmasi handle resmi** (Instagram, Facebook, TikTok, YouTube, LinkedIn) |
| 8 | Foto detail produk | 3 foto sama untuk semua produk | **3-4 foto unik per produk** |
| 9 | Halaman FAQ | Belum ada (404) | **Konten FAQ** |
| 10 | Kebijakan Privasi | Belum ada (404) | **Konten kebijakan privasi** |
| 11 | Syarat & Ketentuan | Belum ada (404) | **Konten S&K** |
| 12 | Link Lazada & TikTok Shop | Kosong | **URL toko resmi** |

### 🟢 Opsional

| # | Item | Keterangan |
|---|------|------------|
| 13 | Foto blog | Saat ini stock/template, bisa diganti foto branded |
| 14 | Video profil | Halaman Tentang mendukung video (mp4/webm) |
| 15 | Event & promo aktif | Jika ada promo/event berjalan |

---

## 6. Feedback & Diskusi (15 menit)

- Review desain & layout — ada yang ingin diubah?
- Warna, font, atau branding — sudah sesuai?
- Apakah ada halaman/fitur tambahan yang dibutuhkan?
- Prioritas revisi dari client

---

## 7. Timeline & Next Steps (10 menit)

- Deadline konten dari client
- Timeline revisi & testing
- Custom domain (pengganti subdomain Railway)
- Target tanggal go-live
- Rencana maintenance & update berkala

---

## 8. Penutup & Q&A (5 menit)

- Pertanyaan dari client
- Rangkuman action items
- Jadwal meeting berikutnya
