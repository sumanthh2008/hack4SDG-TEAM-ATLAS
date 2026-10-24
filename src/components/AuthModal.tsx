import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  UserCheck, 
  X, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Phone,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { AuthService, DoctorService } from '../services/supabase';
import type { CurrentSession } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: CurrentSession) => void;
  initialRole?: 'patient' | 'doctor' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'patient',
}) => {
  const [tab, setTab] = useState<'patient' | 'doctor' | 'guest'>(initialRole);
  const [patientEmail, setPatientEmail] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPassword, setPatientPassword] = useState('');

  // Doctor Form Fields
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('Cardiologist');
  const [doctorLicense, setDoctorLicense] = useState('MCI-2024-99881');
  const [doctorExp, setDoctorExp] = useState(10);
  const [doctorFee, setDoctorFee] = useState(700);
  const [doctorBio, setDoctorBio] = useState('Experienced medical specialist focused on patient recovery.');
  const [doctorPhone, setDoctorPhone] = useState('+91 98765 43210');
  const [doctorLanguages, setDoctorLanguages] = useState('English, Hindi');

  if (!isOpen) return null;

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = AuthService.loginAsPatient(patientEmail || 'aditi@example.com', patientName || 'Aditi Deshmukh');
    onLoginSuccess(session);
    onClose();
  };

  const handleGoogleDemo = () => {
    const session = AuthService.loginAsPatient('google_user@gmail.com', 'Aarav Mehta (Google User)');
    onLoginSuccess(session);
    onClose();
  };

  const handleGuestSubmit = () => {
    const session = AuthService.loginAsGuest();
    onLoginSuccess(session);
    onClose();
  };

  const handleDoctorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const session = AuthService.registerDoctor({
      fullName: doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`,
      specialization: doctorSpecialization,
      licenseNumber: doctorLicense,
      experienceYears: Number(doctorExp),
      bio: doctorBio,
      languages: doctorLanguages.split(',').map((s) => s.trim()),
      consultationFee: Number(doctorFee),
      phone: doctorPhone,
    });
    onLoginSuccess(session);
    onClose();
  };

  const handleQuickDoctorSelect = (docId: string) => {
    const session = AuthService.loginAsDoctor(docId);
    onLoginSuccess(session);
    onClose();
  };

  const existingDoctors = DoctorService.getAllDoctors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading">Welcome to Sankalp</h2>
            <p className="text-xs text-teal-100">
              Sign in or enter as Guest to access consultations and care
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setTab('patient')}
            className={`py-3.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'patient'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient Sign In</span>
          </button>

          <button
            onClick={() => setTab('doctor')}
            className={`py-3.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'doctor'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Portal</span>
          </button>

          <button
            onClick={() => setTab('guest')}
            className={`py-3.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'guest'
                ? 'border-teal-600 text-teal-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Guest Access</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: PATIENT */}
          {tab === 'patient' && (
            <div className="space-y-4">
              <form onSubmit={handlePatientSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Aditi Deshmukh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="aditi@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Continue as Patient
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Google Sign-In Demo */}
              <button
                onClick={handleGoogleDemo}
                className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* TAB 2: DOCTOR */}
          {tab === 'doctor' && (
            <div className="space-y-5">
              {/* Quick Switch to existing Demo Doctors */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quick Demo: Enter as an Existing Verified Doctor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {existingDoctors.slice(0, 4).map((d) => (
                    <button
                      key={d.user_id}
                      onClick={() => handleQuickDoctorSelect(d.user_id)}
                      className="p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center gap-2"
                    >
                      <img
                        src={d.profile.avatar_url}
                        alt={d.profile.full_name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="truncate">
                        <span className="block font-bold text-xs text-slate-800 truncate">
                          {d.profile.full_name}
                        </span>
                        <span className="block text-[10px] text-teal-600 truncate">
                          {d.specialization}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs">or register new doctor</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Register New Doctor Form */}
              <form onSubmit={handleDoctorRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    Doctor Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Dr. Siddharth Rao"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      Specialization
                    </label>
                    <input
                      type="text"
                      required
                      value={doctorSpecialization}
                      onChange={(e) => setDoctorSpecialization(e.target.value)}
                      placeholder="Cardiologist"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                      License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={doctorLicense}
                      onChange={(e) => setDoctorLicense(e.target.value)}
                      placeholder="MCI-2024-XXXX"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    required
                    value={doctorExp}
                    onChange={(e) => setDoctorExp(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                    Languages (comma separated)
                  </label>
                  <input
                    type="text"
                    value={doctorLanguages}
                    onChange={(e) => setDoctorLanguages(e.target.value)}
                    placeholder="English, Hindi, Marathi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Register Doctor & Enter Portal
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: GUEST (ANONYMOUS PATIENT) */}
          {tab === 'guest' && (
            <div className="space-y-4 text-center py-3">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  Continue as Guest (Anonymous Patient)
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  No email or password needed. You can instantly book consultations, attend video visits with blur privacy, and test the AI follow-up chatbot.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 text-left space-y-1">
                <span className="font-bold text-amber-800 block">Gentle Note:</span>
                <p className="leading-relaxed text-[11px] text-amber-900/90">
                  Guest data is tied to your anonymous session ID. You can convert to a full account anytime to permanently save your consultations and prescription history.
                </p>
              </div>

              <button
                onClick={handleGuestSubmit}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Enter as Guest Patient</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
