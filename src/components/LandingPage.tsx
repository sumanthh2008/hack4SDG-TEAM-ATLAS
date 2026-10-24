import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Video, 
  Pill, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Lock, 
  EyeOff, 
  Users,
  Clock,
  BookOpen,
  PhoneCall
} from 'lucide-react';
import { DoctorService } from '../services/supabase';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (role?: 'patient' | 'doctor' | 'guest') => void;
  onOpenSOS: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
  onOpenSOS,
}) => {
  const doctors = DoctorService.getAllDoctors().slice(0, 3);

  const steps = [
    {
      step: '01',
      title: 'Find & Schedule in Seconds',
      description: 'Search top verified physicians across cardiology, mental health, diabetes, and chest medicine. Pick an open slot with no double-booking.',
      icon: Calendar,
      tag: 'Doctor Discovery',
    },
    {
      step: '02',
      title: 'Encrypted Video Consultation',
      description: 'Connect securely over WebRTC. Switch on the patient-controlled "Blur My Video" toggle anytime for complete privacy in busy rooms.',
      icon: EyeOff,
      tag: 'Patient Privacy',
    },
    {
      step: '03',
      title: 'Digital Rx & Auto-Reminders',
      description: 'Your doctor submits a certified digital prescription, which instantly schedules morning, afternoon, and night reminders with Taken/Skipped logging.',
      icon: Pill,
      tag: 'Care Automation',
    },
    {
      step: '04',
      title: 'AI Companion & Recovery Gauge',
      description: 'Check in daily with your mood and severity (1–10). Our AI monitors recovery, recalculates health scores, and escalates to a doctor if needed.',
      icon: Activity,
      tag: 'Holistic Recovery',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-full text-xs font-bold text-teal-800 shadow-sm">
                <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                <span>Next-Generation Telemedicine & AI Recovery</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight">
                  Your resolve to heal,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B7871] via-[#5FB8B0] to-[#256E96]">
                    with care beside you.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                  Connect with verified specialists for online video consultations with a one-tap <strong>patient blur toggle</strong>. After your visit, our Claude AI follow-up assistant schedules medicine reminders and tracks your daily recovery score.
                </p>
              </div>

              {/* Call-To-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('doctors')}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-600/25 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>

                <button
                  onClick={() => onOpenAuth('guest')}
                  className="px-6 py-3.5 bg-white hover:bg-teal-50 border-2 border-teal-200 text-teal-800 font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Continue as Guest</span>
                </button>

                <button
                  onClick={() => onOpenAuth('doctor')}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
                >
                  Doctor Sign In
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>100% Verified Physicians</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-teal-600" />
                  <span>Patient Blur Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Continuous AI Recovery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-teal-100 sankalp-glass-card space-y-5">
                {/* Simulated Live Consultation Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Dr. Rajesh Varma
                      </span>
                      <span className="text-[10px] text-teal-600 font-semibold block">
                        Diabetologist & Physician
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                    HD Video Ready
                  </span>
                </div>

                {/* Simulated Patient Video Feed with Blur toggle demo */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
                    alt="Patient preview"
                    className="w-full h-full object-cover video-blur-patient opacity-90"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-teal-600/90 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow">
                    <EyeOff className="w-3 h-3" />
                    <span>Blur My Video Active</span>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-white/90 font-semibold drop-shadow bg-black/40 px-2 py-0.5 rounded">
                    Patient Control: Privacy Preserved
                  </div>
                </div>

                {/* AI Assistant Recovery Gauge Preview */}
                <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Recovery Health Gauge
                    </span>
                    <span className="text-xs font-black text-teal-800">84 / 100</span>
                  </div>
                  <div className="h-2 w-full bg-teal-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full w-[84%]" />
                  </div>
                  <p className="text-[10px] text-teal-800/80 leading-relaxed">
                    "Fever subsided, adherence 100%. Estimated 3 days remaining."
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('recovery')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore Recovery Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Decorative background glow behind preview card */}
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-teal-200 to-sky-200 rounded-full blur-3xl opacity-40 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW SANKALP WORKS (4 Clear Steps) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Care Continuum
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            How Sankalp Heals You, Step by Step
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From the initial symptom search to post-visit adherence and daily recovery tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-teal-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-teal-600/40 font-heading">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700">
                      {s.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DOCTORS PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Verified Medical Panel
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-2">
              Featured Specialists Available Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Schedule your appointment or view open slots immediately.
            </p>
          </div>

          <button
            onClick={() => onNavigate('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.user_id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.profile.avatar_url}
                    alt={doc.profile.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-heading">
                      {doc.profile.full_name}
                    </h3>
                    <p className="text-xs text-teal-600 font-medium">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.experience_years} yrs)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('doctors')}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISORDERS & SOS PROMPT BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Disorders Library */}
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                A–Z Medical Directory
              </span>
              <h3 className="text-2xl font-bold font-heading">
                Disorders & Symptom Library
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed max-w-md">
                Browse clinically approved guides for diabetes, asthma, hypertension, migraines, and mental health conditions. Learn red-flag symptoms and book matching doctors.
              </p>
            </div>

            <button
              onClick={() => onNavigate('disorders')}
              className="px-5 py-3 bg-white text-teal-900 font-bold text-xs rounded-2xl shadow hover:bg-teal-50 transition-colors flex items-center gap-2 self-start"
            >
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>Explore Disorders Library</span>
            </button>
          </div>

          {/* Card 2: 24x7 India Emergency SOS */}
          <div className="bg-gradient-to-br from-rose-600 to-red-800 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                24x7 Pan-India Assistance
              </span>
              <h3 className="text-2xl font-bold font-heading">
                Emergency & SOS Helplines
              </h3>
              <p className="text-xs text-rose-100 leading-relaxed max-w-md">
                Always reachable from every page. Access one-tap calling for 112, 108 ambulance, Tele-MANAS mental health, 181 women helpline, and GPS nearest hospital locator.
              </p>
            </div>

            <button
              onClick={onOpenSOS}
              className="px-5 py-3 bg-white text-red-700 font-extrabold text-xs rounded-2xl shadow hover:bg-red-50 transition-colors flex items-center gap-2 self-start"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Open Emergency SOS Dialers</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
