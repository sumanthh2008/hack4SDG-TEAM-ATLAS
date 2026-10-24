# Sankalp — Online Doctor Consultation & Recovery Care Platform

> **"Your resolve to heal, with care beside you."**  
> Sankalp connects patients with verified doctors for online video consultations, and actively supports patients after the visit with an AI follow-up assistant and a personalized recovery tracker.

---

## 🌟 Key Features

### 1. Multi-Role Authentication & Access
- **Patient**: Email/password and one-click Google Sign-in demo.
- **Doctor**: Medical license verification, specialization, experience years, consultation fee, availability hours, and treated patient history.
- **Guest (Anonymous Patient)**: Immediate 1-click access with anonymous session ID, booking, video calls, and AI follow-up, with gentle prompts to create a full account to preserve history.
- **Fast Role Switcher**: Interactive toggle in the top navigation to seamlessly test the platform from both Patient and Doctor perspectives.

### 2. Patient Experience
- **Doctor Discovery**: Searchable by name, condition, or hospital. Filter by specialization, ratings, languages, and fees.
- **Slot Booking**: Interactive calendar slot selection with strict double-booking prevention and clinical reason entry.
- **Consultation Status**: Live lifecycle (`Pending` → `Confirmed` → `Completed` / `Declined`).
- **Encrypted Video Room**:
  - Patient-controlled **"Blur my video"** toggle for privacy in busy environments.
  - Camera / Microphone toggles, call timer, and in-call messaging.
- **Prescription Center**: Download official, digitally-signed PDF prescriptions (`jspdf`) with clinical diagnosis, medications table, and doctor advice.
- **Notification Center**: Realtime in-app notification center for appointment updates and dose schedules.

### 3. Doctor Portal
- **Dashboard**: Today's schedule, pending requests, completed visits, and active patient count.
- **Request Manager**: One-click **Accept** (automatically generates video room and schedules reminders) or **Decline** (with clinical reason).
- **Availability Manager**: Configure custom working hours, date blocks, and time slots.
- **Digital Prescription Builder**: Rx medications (dosage, frequency, food timing, duration) and advice. Automatically triggers the **AI Follow-up Chatbot Pipeline**.

### 4. AI Follow-up Assistant (Anthropic Claude Engine)
- Automatically scheduled medicine reminders with interactive **Taken**, **Skipped**, and **Snooze** buttons.
- Daily health check-in (Mood: Better / Same / Worse, Symptom Severity 1–10, free-text notes).
- **Escalation Logic**:
  - Escalates to matching specialist with a 1-tap booking button if symptoms worsen.
  - Immediately triggers the **Emergency SOS panel** if red flags (chest pain, breathing distress) are mentioned.
- Strict safety rules: Never diagnoses or alters doses; provides general wellness support with a clear disclaimer.

### 5. Visual Recovery Tracker
- **Health Score Gauge (0–100)**: Soothing SVG circular meter with color transitions (calm teal for good, soft amber for caution, soft coral for concern).
- **Recovery Rate %**: Calculated from check-in scores, symptom trends, and medicine adherence.
- **Estimated Days Remaining**: Progress bar adjusting dynamically to daily check-ins.
- **Symptom Severity Trendline**: Visual chart showing healing over time.
- **Personalized Do's & Don'ts**: AI-tailored recovery guidance for hydration, rest, nutrition, and activities to avoid.

### 6. Information & Emergency Hub
- **A–Z Disorders Library**: Searchable conditions guide (Type 2 Diabetes, Hypertension, Asthma, Anxiety, Depression, Hypothyroidism, Migraines, Eczema, GERD) with warning signs and direct specialist booking.
- **Persistent Emergency & SOS**: Always reachable from every page. Verified Indian helplines:
  - **112** (National Emergency)
  - **108 / 102** (Ambulance & Medical Transit)
  - **14416 / 1800-891-4416** (Tele-MANAS 24x7 Mental Health Helpline)
  - **181** (Women in Distress Helpline)
  - **1098** (Childline)
  - **1800-599-0019** (KIRAN Mental Health)
  - Quick first-aid protocols & Google Maps nearest hospital link.
- **Customer Support & FAQs**: Accordion FAQ guide and live ticket submission.
- **Report an Error**: Bug report form with screenshot upload, auto-captured URL and device diagnostics, and status tracker.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons |
| **PDF Generation** | jsPDF |
| **Delight / Feedback** | Canvas Confetti |
| **Backend & Database** | Supabase (PostgreSQL, Row Level Security, Realtime, Edge Functions) |
| **AI Assistant** | Anthropic Claude 3.5 Sonnet (called via Supabase Edge Function) |
| **Video Calls** | WebRTC video consultation room with Canvas blur filter |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js LTS (v20+ or v24+)
- npm or yarn

### 2. Installation
```bash
# Clone the repository and navigate into the folder
cd sankalp

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
# Supabase Configuration (Optional: runs in rich interactive mock mode if empty)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Anthropic Claude API (Used in Supabase Edge Function)
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 4. Supabase Database Setup
1. Open your Supabase Project Dashboard.
2. Go to the **SQL Editor**.
3. Copy and run the entire SQL script from [`supabase/schema.sql`](./supabase/schema.sql).
   - This creates all 15 tables with foreign keys and triggers.
   - Enables Row Level Security (RLS) policies.
   - Seeds verified doctors, emergency contacts, and disorders library.

### 5. Running Locally
```bash
# Start the Vite development server
npm run dev

# Open in your browser:
# http://127.0.0.1:5173/
```

### 6. Production Build
```bash
npm run build
npm run preview
```

---

## 🎨 Theme & Design System
- **Soft Aqua / Teal**: `#5FB8B0` (Primary calming wellness color)
- **Mint Green**: `#CDEBDD` (Recovery, fresh healing)
- **Sky Blue**: `#BFE3F2` (Clarity, calm communication)
- **Warm Off-White**: `#F7FBFA` (Page background)
- **Soft Coral**: `#F07167` (SOS Emergency & Alerts only)
- **Typography**: Nunito & Plus Jakarta Sans (Headings), Inter (Body)
- **Rounded Corners**: 16px–24px with soft diffused glassmorphic shadows.
