# AmablexCTF - Platform Capture The Flag

![AmablexCTF Logo](src/assets/logo.gif)

Platform kompetisi Capture The Flag (CTF) modern dengan fitur real-time, dibangun menggunakan React, TypeScript, dan Supabase.

## 🚀 Fitur Utama

### Untuk Pemain
- **Multi-Kategori Challenge**: Web, Crypto, Pwn, Forensics, OSINT, dan Misc
- **Dynamic Scoring**: Poin berkurang seiring bertambahnya solver
- **Real-time Scoreboard**: Update skor secara langsung dengan timer kompetisi
- **Sistem Tim**: Buat atau gabung tim, chat dengan anggota tim
- **Sistem Hint**: Buka hint dengan mengorbankan poin
- **First Blood Bonus**: Poin ekstra untuk solver pertama
- **Profil User**: Pantau progress dan statistik

### Untuk Admin
- **Manajemen Challenge**: Buat, edit, dan kelola challenge
- **Pengaturan Kompetisi**: Atur waktu mulai/selesai, aturan scoring, ukuran tim
- **Manajemen User**: Kelola role dan permission pengguna
- **Sistem Pengumuman**: Broadcast pesan ke semua peserta

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: TanStack Query
- **Routing**: React Router v6

## 📦 Instalasi

### Prasyarat
- Node.js 18+ dan npm
- Project Supabase (atau gunakan Lovable Cloud)

### Development Lokal

1. **Clone repository**
   ```bash
   git clone <URL_GIT_ANDA>
   cd <NAMA_PROJECT>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env` di root directory:
   ```env
   VITE_SUPABASE_URL=url_supabase_anda
   VITE_SUPABASE_PUBLISHABLE_KEY=anon_key_supabase_anda
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   
   Kunjungi `http://localhost:5173`

## 🚢 Cara Deploy

### Deploy dengan Lovable (Paling Mudah)

1. Buka project di [Lovable](https://lovable.dev)
2. Klik **Share** → **Publish**
3. Selesai! App akan ter-deploy otomatis

### Deploy dengan Docker

1. **Build Docker image**
   ```bash
   docker build -t amablexctf .
   ```

2. **Jalankan container**
   ```bash
   docker run -p 80:80 \
     -e VITE_SUPABASE_URL=url_supabase_anda \
     -e VITE_SUPABASE_PUBLISHABLE_KEY=anon_key_anda \
     amablexctf
   ```

### Deploy ke Vercel

1. Push code ke GitHub
2. Import repository di Vercel
3. Tambahkan environment variables
4. Deploy!

### Deploy ke Netlify

1. Push code ke GitHub
2. Connect repository di Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Tambahkan environment variables
6. Deploy!

## 👤 Setup Admin

Untuk membuat user admin:

1. Register akun baru melalui aplikasi
2. Jalankan SQL berikut di database:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('uuid-user-anda', 'admin');
   ```
3. Logout dan login kembali

## 📄 Lisensi

Project ini open source dengan lisensi MIT.

---

Dibuat dengan ❤️ menggunakan [Lovable](https://lovable.dev)
