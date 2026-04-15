# Vercel PostgreSQL Database Setup - Complete Guide

## Quick Start (5 Menit)

### Step 1: Buat Database (Pilih Salah Satu)

#### **OPSI A: Neon (Rekomendasi - Paling Mudah)**
```
1. Buka: https://console.neon.tech
2. Klik "Sign Up" → Gunakan GitHub atau Email
3. Klik "New Project"
4. Beri nama: seaquill
5. Klik "Create project" → Tunggu 1-2 menit selesai
6. Di dashboard, cari "Connection string"
7. Copy URI (format: postgresql://...)
   → SIMPAN URl INI
```

#### **OPSI B: Supabase**
```
1. Buka: https://supabase.com
2. Klik "Start your project" → Sign up
3. Buat project:
   - Nama: seaquill
   - Password: (catat baik-baik!)
   - Region: Singapore (ap-southeast-1)
4. Tunggu project created
5. Settings → Database → Connection string
6. Copy URI
   → SIMPAN URL INI
```

---

### Step 2: Setup Vercel Database

Jalankan di terminal (PowerShell):

```powershell
cd d:\Ravhael\Project\Seaquill\seaquill-next
.\scripts\setup-vercel-db.ps1 "postgresql://user:password@host/database"
```

Ganti `postgresql://...` dengan connection string dari Step 1.

**Contoh:**
```powershell
.\scripts\setup-vercel-db.ps1 "postgresql://neondb_owner:abcXYZ@ep-xyz.neon.tech/neondb?sslmode=require"
```

---

### Step 3: Verifikasi Deployment

Script akan otomatis:
- ✅ Set DATABASE_URL di Vercel
- ✅ Deploy ke production
- ✅ Run Prisma migrations (create tables)
- ✅ Seed data (admin user, products, etc.)

Tunggu sampai muncul pesan sukses.

---

## Manual Setup (Jika Script Tidak Bekerja)

### 1. Add DATABASE_URL ke Vercel
```bash
vercel env add DATABASE_URL
# Paste connection string saat diminta
# Pilih: Production, Preview, Development
```

### 2. Deploy ke Vercel
```bash
vercel deploy --prod
```

### 3. Cek Logs di Vercel Dashboard
- https://vercel.com/seaquillabad21-1471s-projects/sea-quill
- Buka tab "Deployments"
- Klik yang paling baru
- Baca log untuk verifikasi

---

## Troubleshooting

### Connection Failed / Database Error
- Pastikan connection string benar (copy-paste)
- Cek format: `postgresql://user:password@host:port/database`
- Neon: Jangan lupa `?sslmode=require` di akhir

### Prisma Migration Failed
- Pastikan database kosong (baru dibuat)
- Jika perlu reset: buat project database baru di Neon/Supabase

### Vercel Deployment Timeout
- Tunggu 3-5 menit (seed process berjalan lama pertama kali)
- Cek di Vercel dashboard untuk live logs

---

## Hasil Akhir

Setelah selesai, Anda akan punya:

✅ **Production URL:**
- https://sea-quill-7tq60gl78-seaquillabad21-1471s-projects.vercel.app

✅ **Database:**
- PostgreSQL di Neon atau Supabase
- Sudah berisi: Products, Articles, Admin Users, Settings

✅ **Admin CMS:**
- URL: [production-url]/admin
- Email: admin@seaquill.com
- Password: seaquill2025

✅ **Live Features:**
- Public website (product page, articles, gallery, etc.)
- Admin panel (full CMS)
- Email notifications (sudah configured di Railway, bisa diupdate ke Vercel Postgres)
- Form submission (simpan ke database)

---

## Next Steps (Opsional)

1. **Update Email Notifications** (opsional)
   - Admin → Settings → Email SMTP
   - Configure ulang ke SMTP pribadi jika ingin

2. **Custom Domain** 
   - Vercel dashboard → Settings → Domains
   - Add custom domain Anda

3. **Analytics & Monitoring**
   - Vercel dashboard → Analytics tab

---

## Support

Jika ada error, copy log dari Vercel dashboard dan tanyakan.
