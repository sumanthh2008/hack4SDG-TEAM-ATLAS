import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  Download, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Pill,
  Sparkles
} from 'lucide-react';
import { AppointmentService, PrescriptionService } from '../services/supabase';
import { generatePrescriptionPDF } from '../utils/pdfGenerator';
import type { Appointment, Prescription } from '../types/database';

interface PatientAppointmentsProps {
  patientId: string;
  onJoinVideo: (appointment: Appointment) => void;
  onGoToRecovery?: () => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  patientId,
  onJoinVideo,
  onGoToRecovery,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions'>('appointments');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const loadData = () => {
    const apps = AppointmentService.getAppointments('patient', patientId);
    setAppointments(apps);
    const prescs = PrescriptionService.getPrescriptionsForPatient(patientId);
    setPrescriptions(prescs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sankalp_state_change', loadData);
    return () => window.removeEventListener('sankalp_state_change', loadData);
  }, [patientId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            My Appointments & Medical Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track consultation approvals, join secure video rooms, and download official prescriptions.
          </p>
        </div>

        {prescriptions.length > 0 && onGoToRecovery && (
          <button
            onClick={onGoToRecovery}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-teal-700 hover:to-emerald-700 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Recovery Tracker</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 gap-3 font-bold text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'appointments'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Consultations ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'prescriptions'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prescriptions & Rx ({prescriptions.length})</span>
        </button>
      </div>

      {/* Tab 1: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No appointments booked yet</h3>
              <p className="text-xs text-slate-400">Discover doctors and choose a time slot that suits you.</p>
            </div>
          ) : (
            appointments.map((app) => {
              const docName = app.doctor?.profile?.full_name || 'Dr. Specialist';
              const isAccepted = app.status === 'accepted';
              const isPending = app.status === 'pending';
              const isDeclined = app.status === 'declined';
              const isCompleted = app.status === 'completed';

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {isPending && (
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                          Pending Doctor Confirmation
                        </span>
                      )}
                      {isAccepted && (
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed & Scheduled
                        </span>
                      )}
                      {isDeclined && (
                        <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Declined
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold">
                          Completed
                        </span>
                      )}

                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(app.scheduled_at).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.doctor?.profile?.avatar_url && (
                        <img
                          src={app.doctor.profile.avatar_url}
                          alt={docName}
                          className="w-12 h-12 rounded-2xl object-cover border border-teal-100 flex-shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 text-base font-heading">
                          {docName}
                        </h3>
                        <p className="text-xs text-teal-600 font-medium">
                          {app.doctor?.specialization} • Online Video Visit
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-800 block mb-0.5">Reported Symptoms:</span>
                      "{app.reason}"
                    </p>

                    {isDeclined && app.decline_reason && (
                      <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-100">
                        Doctor Note: "{app.decline_reason}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {isAccepted && (
                      <button
                        onClick={() => onJoinVideo(app)}
                        className="w-full md:w-auto px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 animate-pulse-subtle"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Video Room (Blur Ready)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Prescriptions List */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No prescriptions issued yet</h3>
              <p className="text-xs text-slate-400">
                Prescriptions written by your doctor will show here and automatically create medicine reminders.
              </p>
            </div>
          ) : (
            prescriptions.map((presc) => {
              const docName = presc.doctor?.profile?.full_name || 'Dr. Medical Specialist';

              return (
                <div
                  key={presc.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          Digital Prescription
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {presc.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        Diagnosis: {presc.diagnosis}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Prescribed by {docName} ({presc.doctor?.specialization}) on{' '}
                        {new Date(presc.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => setSelectedPrescription(presc)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => generatePrescriptionPDF(presc)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Medicines Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600" /> Prescribed Medicines:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {presc.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1"
                        >
                          <span className="font-bold text-slate-900 block">{item.medicine_name}</span>
                          <span className="text-slate-500 block">
                            {item.dosage} • {item.frequency}
                          </span>
                          <span className="text-[11px] text-teal-700 block font-medium">
                            {item.timing} • {item.duration_days} days
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice */}
                  <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-100/70 text-xs text-slate-700">
                    <span className="font-bold text-teal-900 block mb-0.5">Doctor's Advice:</span>
                    <p className="leading-relaxed">{presc.advice}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Full Prescription View Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg font-heading">Prescription Review</h3>
                <p className="text-xs text-teal-100">
                  {selectedPrescription.doctor?.profile?.full_name} • {selectedPrescription.doctor?.specialization}
                </p>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm flex-1">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">Diagnosis</span>
                <p className="font-extrabold text-slate-900 text-base">{selectedPrescription.diagnosis}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                  Medication Plan (Rx)
                </span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">Medicine</th>
                        <th className="p-3">Dosage</th>
                        <th className="p-3">Frequency</th>
                        <th className="p-3">Timing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPrescription.items.map((it) => (
                        <tr key={it.id}>
                          <td className="p-3 font-semibold text-slate-900">{it.medicine_name}</td>
                          <td className="p-3 text-slate-600">{it.dosage}</td>
                          <td className="p-3 text-slate-600">{it.frequency}</td>
                          <td className="p-3 text-teal-700">{it.timing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">Instructions & Advice</span>
                <p className="text-slate-700 leading-relaxed">{selectedPrescription.advice}</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => generatePrescriptionPDF(selectedPrescription)}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
