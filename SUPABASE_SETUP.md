# AmablexCTF - Supabase Integration Guide

## Quick Start

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Copy **Project URL** and **anon public key** from Settings > API

### 2. Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Migration
Go to SQL Editor in Supabase Dashboard and run the migration SQL (provided separately).

### 4. Configure OAuth (Optional)
- **Google**: Settings > Authentication > Providers > Google
- **GitHub**: Settings > Authentication > Providers > GitHub

### 5. Deploy with Docker
```bash
docker-compose up -d
```
Access at: http://localhost:3684

## Create Admin User
After signing up, run this SQL to make yourself admin:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'your@email.com';
```