import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DoctorDiscovery } from './components/DoctorDiscovery';
import { PatientAppointments } from './components/PatientAppointments';
import { DoctorDashboard } from './components/DoctorDashboard';
import { VideoConsultationRoom } from './components/VideoConsultationRoom';
import { RecoveryTracker } from './components/RecoveryTracker';
import { AIFollowupChat } from './components/AIFollowupChat';
import { DisordersLibrary } from './components/DisordersLibrary';
import { SupportHelpCenter } from './components/SupportHelpCenter';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { ReportErrorModal } from './components/ReportErrorModal';
import { AuthModal } from './components/AuthModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { 
  AuthService, 
  DoctorService, 
  AppointmentService 
} from './services/supabase';
import type { CurrentSession } from './services/supabase';
import type { Appointment } from './types/database';
import { ShieldAlert, Activity, Sparkles, MessageSquare } from 'lucide-react';

export function App() {
  const [session, setSession] = useState<CurrentSession | null>(null);
  const [activeView, setActiveView] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<'patient' | 'doctor' | 'guest'>('patient');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isReportErrorOpen, setIsReportErrorOpen] = useState(false);
  const [activeVideoApp, setActiveVideoApp] = useState<Appointment | null>(null);
  const [prescriptionTargetApp, setPrescriptionTargetApp] = useState<Appointment | null>(null);
  const [recoverySubTab, setRecoverySubTab] = useState<'tracker' | 'chat'>('tracker');
  const [filterSpecialization, setFilterSpecialization] = useState<string | null>(null);

  useEffect(() => {
    const current = AuthService.getCurrentSession();
    setSession(current);
  }, []);

  const handleFastRoleSwitch = (targetRole: 'patient' | 'doctor') => {
    if (targetRole === 'doctor') {
      const doc = DoctorService.getAllDoctors()[0];
      const newSession = AuthService.loginAsDoctor(doc.user_id);
      setSession(newSession);
      setActiveView('doctor-portal');
    } else {
      const newSession = AuthService.loginAsPatient('aditi@example.com', 'Aditi Deshmukh');
      setSession(newSession);
      setActiveView('appointments');
    }
  };

  const handleJoinVideo = (app: Appointment) => {
    setActiveVideoApp(app);
  };

  const handleEndCall = () => {
    setActiveVideoApp(null);
  };

  const handleOpenAuth = (role: 'patient' | 'doctor' | 'guest' = 'patient') => {
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setSession(null);
    setActiveView('home');
  };

  const handleSelectDisorderSpecialist = (specialization: string) => {
    setFilterSpecialization(specialization);
    setActiveView('doctors');
  };

  const currentUserId = session?.user?.id || 'patient-demo';
  const isDoctor = session?.user?.role === 'doctor';
  const currentDoctorProfile = session?.doctorProfile || DoctorService.getAllDoctors()[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FBFA] text-slate-800 antialiased">
      {/* Navigation Header */}
      <Navbar
        currentSession={session}
        activeView={activeView}
        onNavigate={(view) => {
          setFilterSpecialization(null);
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenReportError={() => setIsReportErrorOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onFastRoleSwitch={handleFastRoleSwitch}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW: HOME / LANDING */}
        {activeView === 'home' && (
          <LandingPage
            onNavigate={(view) => {
              setFilterSpecialization(null);
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={handleOpenAuth}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {/* VIEW: DOCTOR DISCOVERY & BOOKING */}
        {activeView === 'doctors' && (
          <DoctorDiscovery
            currentUserId={currentUserId}
            patientName={session?.user?.full_name}
            initialSpecialization={filterSpecialization}
            onAppointmentBooked={() => setActiveView('appointments')}
          />
        )}

        {/* VIEW: PATIENT APPOINTMENTS & PRESCRIPTIONS */}
        {activeView === 'appointments' && (
          <PatientAppointments
            patientId={currentUserId}
            onJoinVideo={handleJoinVideo}
            onGoToRecovery={() => setActiveView('recovery')}
          />
        )}

        {/* VIEW: DOCTOR PORTAL DASHBOARD */}
        {activeView === 'doctor-portal' && (
          <DoctorDashboard
            currentDoctor={currentDoctorProfile as any}
            onJoinVideo={handleJoinVideo}
          />
        )}

        {/* VIEW: RECOVERY TRACKER & AI CHATBOT TAB */}
        {activeView === 'recovery' && (
          <div className="space-y-6">
            {/* Sub-navigation pill between Visual Tracker and AI Follow-up Chat */}
            <div className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-center">
              <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold shadow-inner">
                <button
                  onClick={() => setRecoverySubTab('tracker')}
                  className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    recoverySubTab === 'tracker'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Visual Health Gauge & Trends</span>
                </button>
                <button
                  onClick={() => setRecoverySubTab('chat')}
                  className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    recoverySubTab === 'chat'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>AI Companion & Medicine Schedule</span>
                </button>
              </div>
            </div>

            {recoverySubTab === 'tracker' ? (
              <RecoveryTracker
                patientId={currentUserId}
                onOpenConsultDoctor={() => setActiveView('doctors')}
              />
            ) : (
              <AIFollowupChat
                patientId={currentUserId}
                onBookRecommendedDoctor={(docId) => {
                  setActiveView('doctors');
                }}
                onOpenSOSModal={() => setIsSOSOpen(true)}
                onGoToRecoveryTracker={() => setRecoverySubTab('tracker')}
              />
            )}
          </div>
        )}

        {/* VIEW: DISORDERS LIBRARY */}
        {activeView === 'disorders' && (
          <DisordersLibrary onSelectSpecialist={handleSelectDisorderSpecialist} />
        )}

        {/* VIEW: SUPPORT & HELP CENTER */}
        {activeView === 'support' && (
          <SupportHelpCenter userId={currentUserId} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setFilterSpecialization(null);
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenReportError={() => setIsReportErrorOpen(true)}
      />

      {/* Floating Quick Action SOS Button (Mobile persistent accessibility) */}
      <div className="fixed bottom-5 right-5 sm:hidden z-30">
        <button
          onClick={() => setIsSOSOpen(true)}
          className="p-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full shadow-2xl sankalp-coral-glow flex items-center gap-2 animate-bounce font-bold text-xs"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>SOS 112</span>
        </button>
      </div>

      {/* FULL-SCREEN WEBRTC VIDEO CONSULTATION ROOM WITH BLUR TOGGLE */}
      {activeVideoApp && session && (
        <VideoConsultationRoom
          appointment={activeVideoApp}
          currentUser={session.user}
          onEndCall={handleEndCall}
          onWritePrescription={
            isDoctor ? () => setPrescriptionTargetApp(activeVideoApp) : undefined
          }
        />
      )}

      {/* Prescription Builder Modal */}
      {prescriptionTargetApp && (
        <PrescriptionModal
          isOpen={true}
          onClose={() => setPrescriptionTargetApp(null)}
          doctorId={currentDoctorProfile.user_id}
          patientId={prescriptionTargetApp.patient_id}
          appointmentId={prescriptionTargetApp.id}
          patientName={prescriptionTargetApp.patient_id}
        />
      )}

      {/* Global Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      {/* Global Report Bug / Error Modal */}
      <ReportErrorModal
        isOpen={isReportErrorOpen}
        onClose={() => setIsReportErrorOpen(false)}
        userId={currentUserId}
      />

      {/* Authentication & Role Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={authInitialRole}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          if (newSession.user.role === 'doctor') {
            setActiveView('doctor-portal');
          } else {
            setActiveView('appointments');
          }
        }}
      />
    </div>
  );
}

export default App;
