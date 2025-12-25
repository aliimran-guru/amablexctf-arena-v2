# AmablexCTF - Capture The Flag Platform

![AmablexCTF Logo](src/assets/logo.gif)

A modern, real-time Capture The Flag (CTF) competition platform built with React, TypeScript, and Supabase. AmablexCTF provides a complete solution for hosting cybersecurity competitions with team support, real-time scoring, and comprehensive challenge management.

## 🚀 Features

### For Players
- **Multi-Category Challenges**: Web, Crypto, Pwn, Forensics, OSINT, and Misc categories
- **Dynamic Scoring**: Points decrease as more players solve challenges
- **Real-time Scoreboard**: Live updates with competition timer
- **Team System**: Create or join teams, collaborate via built-in chat
- **Hint System**: Unlock hints by spending points
- **First Blood Bonus**: Extra points for first solver
- **User Profiles**: Track your progress and achievements

### For Administrators
- **Challenge Management**: Create, edit, and manage challenges with hints and files
- **Competition Settings**: Configure start/end times, scoring rules, and team sizes
- **User Management**: Manage player roles and permissions
- **Announcement System**: Broadcast messages to all participants

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- A Supabase project (or use Lovable Cloud)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Visit `http://localhost:5173` to see the application.

## 🗄️ Database Schema

The platform uses the following main tables:

- `profiles` - User profiles and scores
- `challenges` - CTF challenges with flags
- `categories` - Challenge categories (web, crypto, etc.)
- `challenge_hints` - Hints for challenges
- `challenge_files` - Downloadable files for challenges
- `solves` - User/team solve records
- `submissions` - All flag submission attempts
- `teams` - Team information
- `team_members` - Team membership
- `team_chat_messages` - Team chat messages
- `competition_settings` - Competition configuration
- `announcements` - Admin announcements
- `user_roles` - Admin/moderator roles
- `unlocked_hints` - Track unlocked hints per user

## 🚢 Deployment

### Deploy with Lovable (Recommended)

1. Open your project at [Lovable](https://lovable.dev)
2. Click **Share** → **Publish**
3. Your app will be deployed automatically

### Deploy with Docker

1. **Build the Docker image**
   ```bash
   docker build -t amablexctf .
   ```

2. **Run the container**
   ```bash
   docker run -p 80:80 \
     -e VITE_SUPABASE_URL=your_supabase_url \
     -e VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key \
     amablexctf
   ```

### Deploy with Docker Compose

```bash
docker-compose up -d
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Site Settings
6. Deploy!

## 👤 Admin Setup

To create an admin user:

1. Register a new account through the app
2. In your Supabase dashboard, run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('your-user-uuid', 'admin');
   ```
3. Log out and log back in to see the Admin Panel

## 🔧 Configuration

### Competition Settings

Access the admin panel to configure:
- Competition name and description
- Start and end times
- Maximum team size
- First blood bonus points
- Scoreboard freeze time

### Challenge Categories

Default categories:
- **Web**: Web application security
- **Crypto**: Cryptography challenges
- **Pwn**: Binary exploitation
- **Forensics**: Digital forensics
- **OSINT**: Open source intelligence
- **Misc**: Miscellaneous puzzles

## 📱 Screenshots

The platform includes:
- Beautiful landing page with animated hero section
- Dashboard with personal statistics
- Challenge grid with filtering and search
- Real-time team chat
- Live scoreboard with rankings
- Admin panel for management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

- Create an issue for bug reports or feature requests
- Check the documentation in Supabase for backend configuration
- Visit [Lovable Docs](https://docs.lovable.dev) for platform-specific help

---

Built with ❤️ using [Lovable](https://lovable.dev)
