<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Phase 1 → Setup Next.js + Tailwind + copy semua assets
          Buat layout (Header, Footer) + Homepage
          
Phase 2 → Migrasi semua halaman static (produk, artikel, galeri, dll)
          Komponen reusable (ProductCard, BlogCard, Breadcrumb)

Phase 3 → Tambahkan database (Prisma + PostgreSQL)
          Data produk & artikel dari DB, bukan hardcoded

Phase 4 → Fitur dinamis (form kontak, search, filter produk)
          API routes untuk backend logic

Phase 5 → CMS admin panel (optional), auth, deployment

Phase 5A — Core UX Upgrade
Rich Text Editor — TipTap/CKEditor untuk konten artikel
Image Upload — Upload ke /public/uploads/ atau cloud (Cloudinary/S3)
Media Library — Browse, upload, pilih gambar dari library
Client-side Form Validation — Real-time error feedback
Slug Auto-generate — Otomatis dari title/name
Toast Notifications — Feedback setelah create/update/delete (react-hot-toast)

Phase 5B — Content Management
Draft/Publish Status — Artikel & produk punya status (draft/published/archived)
Search & Filter — Di semua list pages (by name, category, status, date)
Pagination — Server-side pagination di semua list
Bulk Actions — Select multiple → delete, change status
Sorting — Klik header kolom untuk sort
Content Preview — Preview artikel/produk sebelum publish    

Phase 5C — Advanced Features
Dashboard Charts — Grafik produk per kategori, artikel per bulan, pesan trend
Activity Log — Catat siapa edit/create/delete apa
SEO Fields — Meta title, meta description, OG image per halaman
User Roles — Admin, Editor, Viewer dengan permission berbeda
Settings Page — Site name, logo, contact info, social media (editable)
Trash/Soft Delete — Hapus masuk ke tempat sampah, bisa restore

Phase 5D — Polish
Responsive Admin — Mobile-friendly sidebar (collapse/drawer)
Dark Mode — Toggle light/dark
Keyboard Shortcuts — Ctrl+S untuk save, dll
Export Data — Export produk/artikel ke CSV

Phase 6 → Full CMS — Semua konten halaman bisa dikelola dari admin panel

Phase 6A — Global: Header & Footer dari Database
SiteSetting → Public — Hubungkan SiteSetting (sudah ada) ke Header & Footer
  Kontak (telepon, email, alamat), deskripsi perusahaan, copyright
  Social media links (Instagram, Facebook, Twitter, LinkedIn, WhatsApp)
  Marketplace links (Tokopedia, Shopee)
  Logo path
Navigation Dinamis — Submenu Produk dari ProductCategory DB, Submenu Artikel dari BlogCategory DB
Recent Posts — Sidebar recent posts dari BlogPost DB (bukan hardcoded)
Admin Settings — Pastikan semua field di atas bisa diedit dari /admin/settings

Phase 6B — Homepage dari Database
Hero Slider — Model HeroSlide baru (subtitle, title, background image, CTA, sortOrder, active)
Product Slider — Tarik dari Product DB (isBestSeller/isNew atau featured flag)
Blog Slider — Tarik dari BlogPost DB (4 artikel terbaru)
Brand Partners — Model BrandPartner baru (name, logo image, url, sortOrder, active)
Feature Cards — Simpan di SiteSetting sebagai JSON atau model PageSection
About Section — Simpan di SiteSetting sebagai JSON (heading, paragraf, checklist, gambar)
Service List — Simpan di SiteSetting sebagai JSON atau model PageSection
Admin UI — CRUD untuk HeroSlide & BrandPartner di admin panel

Phase 6C — Halaman Statis dari Database
Tentang — Konten halaman About dari DB (heading, paragraf, checklist, feature cards, project items)
Galeri — Model GalleryItem baru (image, caption, social platform, url, sortOrder, active)
Promo & Event — Model PromoItem & EventItem baru (title, description, image, date, CTA, active)
Hubungi Kami — Social media & marketplace links dari SiteSetting (sudah di Phase 6A)
Admin UI — CRUD untuk Gallery, Promo, Event di admin panel

Phase 6D — Seed Data & Testing
Migrasi Data — Pindahkan semua konten hardcoded ke DB via seed script
Fallback — Jika data DB kosong, tampilkan default/placeholder
Hapus Hardcode — Bersihkan data statis dari komponen & file data/
Full Test — Test semua halaman public + admin, build verification