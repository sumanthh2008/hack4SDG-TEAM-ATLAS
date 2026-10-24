import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Video, 
  FileText, 
  PlusCircle, 
  Lock, 
  AlertCircle,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  AppointmentService, 
  DoctorService, 
  PrescriptionService 
} from '../services/supabase';
import { PrescriptionModal } from './PrescriptionModal';
import type { 
  Appointment, 
  DoctorProfile, 
  UserProfile, 
  AvailabilitySlot 
} from '../types/database';

interface DoctorDashboardProps {
  currentDoctor: DoctorProfile & { profile: UserProfile };
  onJoinVideo: (appointment: Appointment) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentDoctor,
  onJoinVideo,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'schedule' | 'availability' | 'patients'>('requests');
  const [declineModalApp, setDeclineModalApp] = useState<Appointment | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [prescriptionApp, setPrescriptionApp] = useState<Appointment | null>(null);
  const [newSlotStart, setNewSlotStart] = useState('16:00');
  const [newSlotEnd, setNewSlotEnd] = useState('16:30');
  const [newSlotDate, setNewSlotDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = () => {
    const apps = AppointmentService.getAppointments('doctor', currentDoctor.user_id);
    setAppointments(apps);
    const slts = DoctorService.getDoctorSlots(currentDoctor.user_id);
    setSlots(slts);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sankalp_state_change', loadData);
    return () => window.removeEventListener('sankalp_state_change', loadData);
  }, [currentDoctor.user_id]);

  const pendingRequests = appointments.filter((a) => a.status === 'pending');
  const upcomingAppointments = appointments.filter((a) => a.status === 'accepted');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  const handleAccept = (appointmentId: string) => {
    AppointmentService.acceptAppointment(appointmentId);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#5FB8B0', '#CDEBDD'],
    });
    loadData();
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineModalApp) return;

    AppointmentService.declineAppointment(declineModalApp.id, declineReason);
    setDeclineModalApp(null);
    setDeclineReason('');
    loadData();
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const startIso = `${newSlotDate}T${newSlotStart}:00+05:30`;
    const endIso = `${newSlotDate}T${newSlotEnd}:00+05:30`;
    DoctorService.addAvailabilitySlot(currentDoctor.user_id, startIso, endIso);
    loadData();
  };

  const handleBlockSlot = (slotId: string) => {
    DoctorService.blockSlot(slotId);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Doctor Portal
            </span>
            <span className="text-xs text-slate-300">Reg: {currentDoctor.license_number}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Namaste, {currentDoctor.profile.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            {currentDoctor.specialization} • {currentDoctor.experience_years} Years Experience • Rating {currentDoctor.rating} ★
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('requests')}
            className="px-4 py-2 bg-white text-teal-900 font-bold text-xs rounded-xl shadow-md hover:bg-teal-50 transition-colors"
          >
            Review Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className="px-4 py-2 bg-teal-600/80 hover:bg-teal-600 text-white font-bold text-xs rounded-xl border border-teal-400/30 transition-colors"
          >
            Manage Working Hours
          </button>
        </div>

        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {pendingRequests.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Pending Requests</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {upcomingAppointments.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Scheduled Visits</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {completedAppointments.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Completed Visits</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-heading">
              {slots.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Total Slots Configured</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pending Booking Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Accepted Consultations ({upcomingAppointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'availability'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Availability & Slot Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'patients'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Treated Patient History</span>
        </button>
      </div>

      {/* Tab 1: Pending Booking Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">All caught up!</h3>
              <p className="text-xs text-slate-400">
                You have no pending consultation requests. Newly booked slots will show up here in real time.
              </p>
            </div>
          ) : (
            pendingRequests.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                      Pending Approval
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(app.scheduled_at).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Consultation Request (ID: {app.patient_id})
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-0.5">Reported Symptoms / Reason:</span>
                    "{app.reason}"
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setDeclineModalApp(app)}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleAccept(app.id)}
                    className="flex-1 md:flex-initial px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept & Schedule Video Meet</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Accepted / Scheduled Consultations */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No scheduled visits right now</h3>
              <p className="text-xs text-slate-400">Accepted bookings ready for consultation will appear here.</p>
            </div>
          ) : (
            upcomingAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-3xl border border-teal-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                      Confirmed & Scheduled
                    </span>
                    <span className="text-slate-500">
                      {new Date(app.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Patient Consultation: {app.patient_id}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Chief Complaint: <span className="font-semibold text-slate-800">"{app.reason}"</span>
                  </p>
                  {app.video_link && (
                    <div className="text-[11px] text-teal-700 font-mono bg-teal-50 px-2.5 py-1 rounded-lg inline-block">
                      Room: {app.video_link}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setPrescriptionApp(app)}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Write Prescription</span>
                  </button>
                  <button
                    onClick={() => onJoinVideo(app)}
                    className="flex-1 md:flex-initial px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Room</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Availability & Slot Manager */}
      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Slot Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base font-heading flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-teal-600" />
              <span>Add New Consultation Slot</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure slots for patients to discover and book on your calendar.
            </p>

            <form onSubmit={handleAddSlot} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Publish Available Slot
              </button>
            </form>
          </div>

          {/* Existing Slots Table */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-heading">Configured Slots</h3>
              <span className="text-xs text-slate-400">{slots.length} slots</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {slots.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">
                      {new Date(s.start_time).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-500 block">
                      {new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.is_booked
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.is_booked ? 'Booked / Blocked' : 'Open'}
                    </span>

                    {!s.is_booked && (
                      <button
                        onClick={() => handleBlockSlot(s.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors"
                        title="Block this slot"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Treated Patient History */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          {completedAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No completed consultations yet</h3>
              <p className="text-xs text-slate-400">Past patient visits and written prescriptions will appear here.</p>
            </div>
          ) : (
            completedAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Consultation Completed
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">Patient: {app.patient_id}</h4>
                  <p className="text-xs text-slate-500">Reason: "{app.reason}"</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  {new Date(app.scheduled_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Decline Reason Modal */}
      {declineModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Decline Consultation Request
              </h3>
              <button
                onClick={() => setDeclineModalApp(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide an optional clinical reason or schedule conflict. The patient will be politely notified and guided to alternative slots.
            </p>

            <form onSubmit={handleDeclineSubmit} className="space-y-4">
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="E.g., Emergency OT procedure scheduled. Please book tomorrow afternoon slot or see another colleague."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-red-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeclineModalApp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Builder Modal */}
      {prescriptionApp && (
        <PrescriptionModal
          isOpen={true}
          onClose={() => setPrescriptionApp(null)}
          doctorId={currentDoctor.user_id}
          patientId={prescriptionApp.patient_id}
          appointmentId={prescriptionApp.id}
          onPrescriptionCreated={loadData}
        />
      )}
    </div>
  );
};
