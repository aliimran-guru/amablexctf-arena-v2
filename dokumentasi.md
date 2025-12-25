# 📖 Dokumentasi AmablexCTF

## 🏴 Apa itu AmablexCTF?

**AmablexCTF** adalah platform kompetisi **Capture The Flag (CTF)** modern yang dirancang untuk pembelajaran dan kompetisi keamanan siber (cybersecurity). Platform ini menyediakan lingkungan yang aman dan interaktif untuk:

- 🎯 Belajar keamanan siber melalui tantangan praktis
- 🏆 Berkompetisi dengan hacker lain secara real-time
- 👥 Berkolaborasi dalam tim untuk menyelesaikan challenge
- 📊 Melacak progress dan statistik pembelajaran

---

## 🎮 Apa itu CTF (Capture The Flag)?

CTF adalah kompetisi keamanan siber dimana peserta harus menemukan "flag" tersembunyi dengan mengeksploitasi kerentanan atau memecahkan puzzle. Flag biasanya berbentuk string seperti:

```
AmablexCTF{ini_adalah_flag_rahasia}
```

Setiap flag yang ditemukan memberikan poin, dan pemain/tim dengan poin tertinggi menjadi pemenang.

---

## 📋 Fitur-Fitur Platform

### 🎯 Untuk Pemain (Player)

| Fitur | Deskripsi |
|-------|-----------|
| **Multi-Kategori Challenge** | 6 kategori: Web, Crypto, Pwn, Forensics, OSINT, dan Misc |
| **Dynamic Scoring** | Poin berkurang seiring bertambahnya solver (lebih adil!) |
| **Real-time Scoreboard** | Update skor secara langsung dengan timer kompetisi |
| **Sistem Tim** | Buat atau gabung tim, chat dengan anggota tim |
| **Sistem Hint** | Buka hint dengan mengorbankan sebagian poin |
| **First Blood Bonus** | Poin ekstra untuk solver pertama setiap challenge |
| **Profil User** | Pantau progress, statistik, dan upload avatar |
| **Solve History** | Lihat semua challenge yang sudah diselesaikan |

### 👑 Untuk Admin

| Fitur | Deskripsi |
|-------|-----------|
| **Manajemen Challenge** | Buat, edit, dan kelola challenge dengan mudah |
| **Pengaturan Kompetisi** | Atur waktu mulai/selesai, aturan scoring, ukuran tim |
| **Manajemen User** | Kelola role dan permission pengguna |
| **Sistem Pengumuman** | Broadcast pesan ke semua peserta |
| **Dashboard Admin** | Statistik lengkap platform |

---

## 🏷️ Kategori Challenge

### 1. 🌐 Web
Eksploitasi kerentanan aplikasi web seperti:
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Authentication bypass
- Server-Side Request Forgery (SSRF)

### 2. 🔐 Crypto (Kriptografi)
Memecahkan enkripsi dan cipher:
- Cipher klasik (Caesar, Vigenere, dll)
- RSA, AES, DES
- Hash cracking
- Protokol kriptografi modern

### 3. 💀 Pwn (Binary Exploitation)
Eksploitasi program biner:
- Buffer overflow
- Format string vulnerability
- Return-Oriented Programming (ROP)
- Heap exploitation

### 4. 🔍 Forensics
Analisis digital forensik:
- File analysis
- Memory forensics
- Network packet analysis
- Disk imaging

### 5. 🕵️ OSINT (Open Source Intelligence)
Investigasi menggunakan sumber terbuka:
- Social media investigation
- Image metadata analysis
- Domain/IP reconnaissance
- Geolocation

### 6. 🎲 Misc (Miscellaneous)
Challenge lain-lain:
- Steganografi
- Puzzle logika
- Programming challenges
- Esoteric languages

---

## 👥 Sistem Role

Platform ini memiliki 3 level role:

### 1. 👤 User (Pemain)
- Akses ke semua challenge
- Dapat membuat/bergabung tim
- Melihat scoreboard
- Submit flag dan dapatkan poin
- Edit profil sendiri

### 2. 🛡️ Moderator
- Semua hak User
- Moderasi chat tim
- Melihat laporan

### 3. 👑 Admin
- Semua hak Moderator
- Akses panel admin
- Kelola challenge (CRUD)
- Kelola pengaturan kompetisi
- Kelola user dan role
- Buat pengumuman

---

## 📊 Sistem Poin

### Dynamic Scoring Formula
```
current_points = max(min_points, max_points - (decay_rate * solve_count))
```

Contoh:
- **Max Points**: 500
- **Min Points**: 100
- **Decay Rate**: 20
- **Jika 10 orang sudah solve**: 500 - (20 × 10) = 300 poin

### First Blood Bonus
Solver pertama mendapat bonus poin tambahan (default: 50 poin)

---

## 🎯 Tingkat Kesulitan

| Level | Warna | Deskripsi |
|-------|-------|-----------|
| 🟢 **Easy** | Hijau | Untuk pemula, konsep dasar |
| 🟡 **Medium** | Kuning | Membutuhkan pemahaman menengah |
| 🔴 **Hard** | Merah | Membutuhkan skill advanced |
| 🟣 **Insane** | Ungu | Level expert, sangat menantang |

---

## 🏆 Tim

### Membuat Tim
1. Buka halaman **Teams**
2. Klik **Create Team**
3. Isi nama dan deskripsi tim
4. Bagikan kode undangan ke anggota

### Bergabung ke Tim
1. Buka halaman **Teams**
2. Klik **Join Team**
3. Masukkan kode undangan dari captain
4. Konfirmasi untuk bergabung

### Fitur Tim
- **Team Chat**: Komunikasi real-time antar anggota
- **Shared Score**: Poin dari semua anggota dijumlahkan
- **Team Leaderboard**: Ranking khusus tim

---

## 📱 Cara Menggunakan Platform

### 1. Registrasi
1. Buka halaman utama
2. Klik **Get Started** atau **Sign In**
3. Pilih **Sign Up**
4. Isi email dan password
5. Verifikasi email (jika diperlukan)

### 2. Menyelesaikan Challenge
1. Buka halaman **Challenges**
2. Pilih challenge berdasarkan kategori/kesulitan
3. Baca deskripsi dan download file (jika ada)
4. Temukan flag tersembunyi
5. Submit flag dengan format: `AmablexCTF{flag_disini}`
6. Dapatkan poin!

### 3. Menggunakan Hint
1. Buka detail challenge
2. Lihat hints yang tersedia
3. Klik **Unlock Hint**
4. Konfirmasi pengurangan poin
5. Baca hint untuk bantuan

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **State Management** | TanStack Query |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |

---

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:
- Buat issue di repository
- Hubungi admin melalui pengumuman
- Bergabung dengan komunitas Discord (jika tersedia)

---

## 📄 Lisensi

Project ini open source dengan lisensi MIT.

---

**Dibuat dengan ❤️ untuk komunitas cybersecurity Indonesia**
