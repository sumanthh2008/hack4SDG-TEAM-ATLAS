import { createClient } from '@supabase/supabase-js';
import type {
  UserProfile,
  DoctorProfile,
  AvailabilitySlot,
  Appointment,
  Prescription,
  PrescriptionItem,
  MedicineReminder,
  Checkin,
  ChatMessage,
  RecoveryMetrics,
  NotificationItem,
  Disorder,
  EmergencyContact,
  SupportTicket,
  ErrorReport,
  UserRole,
} from '../types/database';
import {
  INITIAL_DOCTORS,
  generateSampleSlots,
  INITIAL_DISORDERS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_SAMPLE_PRESCRIPTION,
  INITIAL_SAMPLE_REMINDERS,
  INITIAL_SAMPLE_CHECKINS,
  INITIAL_RECOVERY_METRICS,
  INITIAL_SAMPLE_APPOINTMENT,
  INITIAL_SAMPLE_CHAT_MESSAGES,
} from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// LOCAL STORAGE KEYS & EVENT SYSTEM
// ============================================================================
const STORAGE_PREFIX = 'sankalp_health_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('sankalp_state_change', { detail: { key, value } }));
  } catch (e) {
    console.error(`Error saving ${key}`, e);
  }
}

// Notification listeners for in-app realtime simulation
type NotificationListener = (notification: NotificationItem) => void;
const notificationListeners: Set<NotificationListener> = new Set();

export function subscribeToNotifications(listener: NotificationListener) {
  notificationListeners.add(listener);
  return () => {
    notificationListeners.delete(listener);
  };
}

function broadcastNotification(notification: NotificationItem) {
  notificationListeners.forEach((fn) => fn(notification));
}

// ============================================================================
// DATA STORE INITIALIZATION
// ============================================================================
function initStorageIfEmpty() {
  const existingDocs = getStorage<(DoctorProfile & { profile: UserProfile })[]>('doctors', []);
  if (!existingDocs || existingDocs.length < INITIAL_DOCTORS.length) {
    setStorage('doctors', INITIAL_DOCTORS);
    const docIds = INITIAL_DOCTORS.map((d) => d.user_id);
    setStorage('slots', generateSampleSlots(docIds));
  } else if (!localStorage.getItem(STORAGE_PREFIX + 'slots')) {
    const docIds = INITIAL_DOCTORS.map((d) => d.user_id);
    setStorage('slots', generateSampleSlots(docIds));
  }

  const existingDisorders = getStorage<Disorder[]>('disorders', []);
  if (!existingDisorders || existingDisorders.length < INITIAL_DISORDERS.length) {
    setStorage('disorders', INITIAL_DISORDERS);
  }

  const existingContacts = getStorage<EmergencyContact[]>('emergency_contacts', []);
  if (!existingContacts || existingContacts.length < INITIAL_EMERGENCY_CONTACTS.length) {
    setStorage('emergency_contacts', INITIAL_EMERGENCY_CONTACTS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'appointments')) {
    setStorage('appointments', [INITIAL_SAMPLE_APPOINTMENT]);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'prescriptions')) {
    setStorage('prescriptions', [INITIAL_SAMPLE_PRESCRIPTION]);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'reminders')) {
    setStorage('reminders', INITIAL_SAMPLE_REMINDERS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'checkins')) {
    setStorage('checkins', INITIAL_SAMPLE_CHECKINS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'recovery_metrics')) {
    setStorage('recovery_metrics', [INITIAL_RECOVERY_METRICS]);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'chat_messages')) {
    setStorage('chat_messages', INITIAL_SAMPLE_CHAT_MESSAGES);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'notifications')) {
    const initialNotification: NotificationItem = {
      id: 'notif-welcome',
      user_id: 'patient-demo',
      type: 'system',
      title: 'Welcome to Sankalp Care',
      body: 'Your doctor appointment summary and follow-up plan are ready. Tap to view your prescription.',
      read: false,
      created_at: new Date().toISOString(),
    };
    setStorage('notifications', [initialNotification]);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'support_tickets')) {
    setStorage('support_tickets', []);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'error_reports')) {
    setStorage('error_reports', []);
  }
}

initStorageIfEmpty();

// ============================================================================
// AUTH & SESSION SERVICE
// ============================================================================
export interface CurrentSession {
  user: UserProfile;
  doctorProfile?: DoctorProfile;
}

const DEFAULT_PATIENT_USER: UserProfile = {
  id: 'patient-demo',
  role: 'patient',
  full_name: 'Aditi Deshmukh',
  avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  phone: '+91 98201 12345',
  is_anonymous: false,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const AuthService = {
  getCurrentSession(): CurrentSession | null {
    const stored = getStorage<CurrentSession | null>('current_session', null);
    if (!stored) {
      // Default to patient demo for instant exploration
      const defSession: CurrentSession = { user: DEFAULT_PATIENT_USER };
      setStorage('current_session', defSession);
      return defSession;
    }
    return stored;
  },

  setCurrentSession(session: CurrentSession | null) {
    setStorage('current_session', session);
  },

  loginAsGuest(): CurrentSession {
    const guestId = 'guest-' + Math.random().toString(36).substring(2, 9);
    const guestUser: UserProfile = {
      id: guestId,
      role: 'guest',
      full_name: 'Guest Patient',
      is_anonymous: true,
      created_at: new Date().toISOString(),
    };
    const session: CurrentSession = { user: guestUser };
    setStorage('current_session', session);
    return session;
  },

  loginAsPatient(email: string, fullName?: string): CurrentSession {
    const user: UserProfile = {
      id: 'patient-' + (email ? email.split('@')[0] : 'demo'),
      role: 'patient',
      full_name: fullName || (email ? email.split('@')[0] : 'Aditi Deshmukh'),
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      phone: '+91 98201 12345',
      is_anonymous: false,
      created_at: new Date().toISOString(),
    };
    const session: CurrentSession = { user };
    setStorage('current_session', session);
    return session;
  },

  loginAsDoctor(doctorId: string): CurrentSession {
    const doctors = getStorage<(DoctorProfile & { profile: UserProfile })[]>('doctors', INITIAL_DOCTORS);
    const doc = doctors.find((d) => d.user_id === doctorId) || doctors[0];
    const session: CurrentSession = {
      user: doc.profile || {
        id: doc.user_id,
        role: 'doctor',
        full_name: 'Dr. Specialist',
        is_anonymous: false,
        created_at: new Date().toISOString(),
      },
      doctorProfile: doc,
    };
    setStorage('current_session', session);
    return session;
  },

  registerDoctor(data: {
    fullName: string;
    specialization: string;
    licenseNumber: string;
    experienceYears: number;
    bio: string;
    languages: string[];
    consultationFee: number;
    phone: string;
    avatarUrl?: string;
  }): CurrentSession {
    const newDocId = 'doc-' + Math.random().toString(36).substring(2, 9);
    const user: UserProfile = {
      id: newDocId,
      role: 'doctor',
      full_name: data.fullName,
      avatar_url: data.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      phone: data.phone,
      is_anonymous: false,
      created_at: new Date().toISOString(),
    };

    const docProfile: DoctorProfile & { profile: UserProfile } = {
      user_id: newDocId,
      specialization: data.specialization,
      license_number: data.licenseNumber,
      experience_years: data.experienceYears,
      bio: data.bio,
      languages: data.languages,
      consultation_fee: data.consultationFee,
      verified: true, // Auto-verified for delightful demo exploration
      rating: 5.0,
      profile: user,
    };

    const doctors = getStorage<(DoctorProfile & { profile: UserProfile })[]>('doctors', INITIAL_DOCTORS);
    doctors.push(docProfile);
    setStorage('doctors', doctors);

    // Generate availability slots for the new doctor
    const slots = getStorage<AvailabilitySlot[]>('slots', []);
    const newSlots = generateSampleSlots([newDocId]);
    setStorage('slots', [...slots, ...newSlots]);

    const session: CurrentSession = { user, doctorProfile: docProfile };
    setStorage('current_session', session);
    return session;
  },

  logout() {
    setStorage('current_session', null);
  },
};

// ============================================================================
// DOCTOR & APPOINTMENT DATA SERVICE
// ============================================================================
export const DoctorService = {
  getAllDoctors(): (DoctorProfile & { profile: UserProfile })[] {
    return getStorage<(DoctorProfile & { profile: UserProfile })[]>('doctors', INITIAL_DOCTORS);
  },

  getDoctorById(id: string): (DoctorProfile & { profile: UserProfile }) | undefined {
    const doctors = this.getAllDoctors();
    return doctors.find((d) => d.user_id === id);
  },

  getDoctorSlots(doctorId: string): AvailabilitySlot[] {
    const slots = getStorage<AvailabilitySlot[]>('slots', []);
    return slots.filter((s) => s.doctor_id === doctorId);
  },

  addAvailabilitySlot(doctorId: string, startTime: string, endTime: string): AvailabilitySlot {
    const slots = getStorage<AvailabilitySlot[]>('slots', []);
    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      doctor_id: doctorId,
      start_time: startTime,
      end_time: endTime,
      is_booked: false,
      created_at: new Date().toISOString(),
    };
    setStorage('slots', [newSlot, ...slots]);
    return newSlot;
  },

  blockSlot(slotId: string) {
    const slots = getStorage<AvailabilitySlot[]>('slots', []);
    const updated = slots.map((s) => (s.id === slotId ? { ...s, is_booked: true } : s));
    setStorage('slots', updated);
  },
};

export const AppointmentService = {
  getAppointments(role: UserRole, userId: string): Appointment[] {
    const all = getStorage<Appointment[]>('appointments', [INITIAL_SAMPLE_APPOINTMENT]);
    const doctors = DoctorService.getAllDoctors();

    return all
      .filter((app) => (role === 'doctor' ? app.doctor_id === userId : app.patient_id === userId))
      .map((app) => ({
        ...app,
        doctor: doctors.find((d) => d.user_id === app.doctor_id),
      }))
      .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  },

  getAppointmentById(id: string): Appointment | undefined {
    const all = getStorage<Appointment[]>('appointments', []);
    const app = all.find((a) => a.id === id);
    if (!app) return undefined;
    const doc = DoctorService.getDoctorById(app.doctor_id);
    return { ...app, doctor: doc };
  },

  bookAppointment(data: {
    patientId: string;
    doctorId: string;
    slotId: string;
    scheduledAt: string;
    reason: string;
    patientName?: string;
  }): Appointment {
    const slots = getStorage<AvailabilitySlot[]>('slots', []);
    const targetSlot = slots.find((s) => s.id === data.slotId);

    if (targetSlot && targetSlot.is_booked) {
      throw new Error('This time slot is already booked. Please choose another slot.');
    }

    // Mark slot as booked (double booking prevention)
    const updatedSlots = slots.map((s) =>
      s.id === data.slotId ? { ...s, is_booked: true } : s
    );
    setStorage('slots', updatedSlots);

    const appointments = getStorage<Appointment[]>('appointments', []);
    const newAppointment: Appointment = {
      id: 'app-' + Date.now(),
      patient_id: data.patientId,
      doctor_id: data.doctorId,
      slot_id: data.slotId,
      reason: data.reason,
      status: 'pending',
      scheduled_at: data.scheduledAt,
      created_at: new Date().toISOString(),
    };

    setStorage('appointments', [newAppointment, ...appointments]);

    // Send Notification to Doctor
    NotificationService.createNotification({
      user_id: data.doctorId,
      type: 'appointment_pending',
      title: 'New Consultation Request',
      body: `You have received a booking request for ${new Date(data.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Reason: "${data.reason}".`,
      action_url: `/doctor/appointments`,
    });

    return newAppointment;
  },

  acceptAppointment(appointmentId: string): Appointment {
    const appointments = getStorage<Appointment[]>('appointments', []);
    const appIndex = appointments.findIndex((a) => a.id === appointmentId);
    if (appIndex === -1) throw new Error('Appointment not found');

    const app = appointments[appIndex];
    // Generate unique video consultation room
    const roomCode = 'sankalp-care-' + appointmentId.slice(-6);
    const videoLink = `https://meet.jit.si/${roomCode}`;

    const updated: Appointment = {
      ...app,
      status: 'accepted',
      video_link: videoLink,
    };
    appointments[appIndex] = updated;
    setStorage('appointments', appointments);

    // Notify patient
    NotificationService.createNotification({
      user_id: app.patient_id,
      type: 'appointment_accepted',
      title: 'Consultation Confirmed! 🎉',
      body: `Your doctor has accepted your appointment for ${new Date(app.scheduled_at).toLocaleString()}. The video room link is ready.`,
      action_url: `/consultation/${app.id}`,
    });

    return updated;
  },

  declineAppointment(appointmentId: string, reason?: string): Appointment {
    const appointments = getStorage<Appointment[]>('appointments', []);
    const appIndex = appointments.findIndex((a) => a.id === appointmentId);
    if (appIndex === -1) throw new Error('Appointment not found');

    const app = appointments[appIndex];
    const updated: Appointment = {
      ...app,
      status: 'declined',
      decline_reason: reason || 'Doctor unavailable due to an emergency procedure.',
    };
    appointments[appIndex] = updated;
    setStorage('appointments', appointments);

    // Unblock the slot if needed
    if (app.slot_id) {
      const slots = getStorage<AvailabilitySlot[]>('slots', []);
      setStorage(
        'slots',
        slots.map((s) => (s.id === app.slot_id ? { ...s, is_booked: false } : s))
      );
    }

    // Notify patient with suggestion
    NotificationService.createNotification({
      user_id: app.patient_id,
      type: 'appointment_declined',
      title: 'Appointment Request Declined',
      body: `Doctor noted: "${updated.decline_reason}". We recommend choosing an alternate slot or exploring other available specialists.`,
      action_url: `/doctors`,
    });

    return updated;
  },

  completeAppointment(appointmentId: string): Appointment {
    const appointments = getStorage<Appointment[]>('appointments', []);
    const appIndex = appointments.findIndex((a) => a.id === appointmentId);
    if (appIndex === -1) throw new Error('Appointment not found');

    const updated: Appointment = {
      ...appointments[appIndex],
      status: 'completed',
    };
    appointments[appIndex] = updated;
    setStorage('appointments', appointments);
    return updated;
  },
};

// ============================================================================
// PRESCRIPTION & MEDICINE REMINDERS SERVICE
// ============================================================================
export const PrescriptionService = {
  getPrescriptionsForPatient(patientId: string): Prescription[] {
    const list = getStorage<Prescription[]>('prescriptions', [INITIAL_SAMPLE_PRESCRIPTION]);
    const doctors = DoctorService.getAllDoctors();
    return list
      .filter((p) => p.patient_id === patientId)
      .map((p) => ({
        ...p,
        doctor: doctors.find((d) => d.user_id === p.doctor_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  createPrescription(data: {
    appointmentId?: string;
    doctorId: string;
    patientId: string;
    diagnosis: string;
    advice: string;
    followUpDate?: string;
    items: Omit<PrescriptionItem, 'id' | 'prescription_id'>[];
  }): Prescription {
    const prescriptions = getStorage<Prescription[]>('prescriptions', []);
    const prescId = 'pres-' + Date.now();

    const items: PrescriptionItem[] = data.items.map((it, idx) => ({
      ...it,
      id: `item-${Date.now()}-${idx}`,
      prescription_id: prescId,
    }));

    const newPrescription: Prescription = {
      id: prescId,
      appointment_id: data.appointmentId,
      doctor_id: data.doctorId,
      patient_id: data.patientId,
      diagnosis: data.diagnosis,
      advice: data.advice,
      follow_up_date: data.followUpDate,
      created_at: new Date().toISOString(),
      items,
      doctor: DoctorService.getDoctorById(data.doctorId),
    };

    setStorage('prescriptions', [newPrescription, ...prescriptions]);

    // If linked to appointment, mark it completed
    if (data.appointmentId) {
      AppointmentService.completeAppointment(data.appointmentId);
    }

    // AUTOMATED PIPELINE: Generate Medicine Reminders & Feed AI Chatbot
    this.generateRemindersFromPrescription(newPrescription);

    // Initial Recovery Metrics for this prescription
    const metricsList = getStorage<RecoveryMetrics[]>('recovery_metrics', []);
    const initialMetric: RecoveryMetrics = {
      id: 'metric-' + Date.now(),
      patient_id: data.patientId,
      prescription_id: prescId,
      recovery_rate: 15,
      health_score: 65,
      estimated_days_left: Math.max(...items.map((i) => i.duration_days), 5),
      updated_at: new Date().toISOString(),
    };
    setStorage('recovery_metrics', [initialMetric, ...metricsList]);

    // Push Notification
    NotificationService.createNotification({
      user_id: data.patientId,
      type: 'medicine_reminder',
      title: 'New Prescription & Care Plan Added',
      body: `Your doctor has prescribed a treatment plan for "${data.diagnosis}". Your medicine reminders and daily check-ins have been scheduled.`,
      action_url: `/recovery`,
    });

    // Seed welcoming AI Chatbot Message
    ChatService.addBotMessage(
      data.patientId,
      `Namaste! Your doctor just submitted your prescription for "${data.diagnosis}". I have set up your medicine reminder schedule. Remember: take your doses with food as directed, and feel free to tell me how you are feeling each day.`
    );

    return newPrescription;
  },

  generateRemindersFromPrescription(prescription: Prescription) {
    const existingReminders = getStorage<MedicineReminder[]>('reminders', []);
    const newReminders: MedicineReminder[] = [];

    prescription.items.forEach((item) => {
      // Create time of day reminders based on frequency
      const freq = item.frequency.toLowerCase();
      if (freq.includes('twice') || freq.includes('1-0-1')) {
        newReminders.push(
          {
            id: `rem-${item.id}-am`,
            prescription_item_id: item.id,
            patient_id: prescription.patient_id,
            medicine_name: item.medicine_name,
            dosage: `${item.dosage} (Morning)`,
            remind_at: '08:30 AM',
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
          {
            id: `rem-${item.id}-pm`,
            prescription_item_id: item.id,
            patient_id: prescription.patient_id,
            medicine_name: item.medicine_name,
            dosage: `${item.dosage} (Night)`,
            remind_at: '08:30 PM',
            status: 'pending',
            updated_at: new Date().toISOString(),
          }
        );
      } else if (freq.includes('thrice') || freq.includes('1-1-1')) {
        newReminders.push(
          {
            id: `rem-${item.id}-morn`,
            prescription_item_id: item.id,
            patient_id: prescription.patient_id,
            medicine_name: item.medicine_name,
            dosage: `${item.dosage} (Morning)`,
            remind_at: '08:30 AM',
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
          {
            id: `rem-${item.id}-aft`,
            prescription_item_id: item.id,
            patient_id: prescription.patient_id,
            medicine_name: item.medicine_name,
            dosage: `${item.dosage} (Afternoon)`,
            remind_at: '01:30 PM',
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
          {
            id: `rem-${item.id}-eve`,
            prescription_item_id: item.id,
            patient_id: prescription.patient_id,
            medicine_name: item.medicine_name,
            dosage: `${item.dosage} (Night)`,
            remind_at: '08:30 PM',
            status: 'pending',
            updated_at: new Date().toISOString(),
          }
        );
      } else {
        // Once a day
        newReminders.push({
          id: `rem-${item.id}-daily`,
          prescription_item_id: item.id,
          patient_id: prescription.patient_id,
          medicine_name: item.medicine_name,
          dosage: item.dosage,
          remind_at: item.timing.toLowerCase().includes('bed') ? '10:00 PM' : '09:00 AM',
          status: 'pending',
          updated_at: new Date().toISOString(),
        });
      }
    });

    setStorage('reminders', [...newReminders, ...existingReminders]);
  },

  getRemindersForPatient(patientId: string): MedicineReminder[] {
    const list = getStorage<MedicineReminder[]>('reminders', INITIAL_SAMPLE_REMINDERS);
    return list.filter((r) => r.patient_id === patientId);
  },

  updateReminderStatus(reminderId: string, status: 'taken' | 'skipped' | 'snoozed') {
    const list = getStorage<MedicineReminder[]>('reminders', []);
    const updated = list.map((r) =>
      r.id === reminderId ? { ...r, status, updated_at: new Date().toISOString() } : r
    );
    setStorage('reminders', updated);

    // If taken, trigger celebratory micro-notification
    if (status === 'taken') {
      const rem = list.find((r) => r.id === reminderId);
      if (rem) {
        NotificationService.createNotification({
          user_id: rem.patient_id,
          type: 'medicine_reminder',
          title: 'Dose Recorded ✅',
          body: `Great job! You logged ${rem.medicine_name} as taken. Your adherence score is improving.`,
        });
      }
    }
  },
};

// ============================================================================
// CHECK-IN & RECOVERY TRACKER SERVICE
// ============================================================================
export const RecoveryService = {
  getCheckinsForPatient(patientId: string): Checkin[] {
    const checkins = getStorage<Checkin[]>('checkins', INITIAL_SAMPLE_CHECKINS);
    return checkins
      .filter((c) => c.patient_id === patientId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  getMetricsForPatient(patientId: string): RecoveryMetrics {
    const metricsList = getStorage<RecoveryMetrics[]>('recovery_metrics', [INITIAL_RECOVERY_METRICS]);
    const metric = metricsList.find((m) => m.patient_id === patientId);
    return (
      metric || {
        id: 'metric-default',
        patient_id: patientId,
        prescription_id: 'pres-demo',
        recovery_rate: 65,
        health_score: 75,
        estimated_days_left: 4,
        updated_at: new Date().toISOString(),
      }
    );
  },

  submitCheckin(data: {
    patientId: string;
    mood: 'Better' | 'Same' | 'Worse';
    severity: number;
    notes: string;
  }): { checkin: Checkin; metrics: RecoveryMetrics } {
    const checkins = getStorage<Checkin[]>('checkins', []);
    const newCheckin: Checkin = {
      id: 'chk-' + Date.now(),
      patient_id: data.patientId,
      mood: data.mood,
      severity: data.severity,
      notes: data.notes,
      created_at: new Date().toISOString(),
    };

    const updatedCheckins = [...checkins, newCheckin];
    setStorage('checkins', updatedCheckins);

    // Recalculate Recovery Metrics based on adherence and symptom trend
    const reminders = PrescriptionService.getRemindersForPatient(data.patientId);
    const takenCount = reminders.filter((r) => r.status === 'taken').length;
    const adherenceRate = reminders.length > 0 ? (takenCount / reminders.length) * 100 : 70;

    // Severity inverse (10 is worst, 1 is best)
    const severityScore = (10 - data.severity) * 10;
    const moodMultiplier = data.mood === 'Better' ? 1.15 : data.mood === 'Same' ? 0.95 : 0.75;

    const healthScore = Math.min(100, Math.max(10, Math.round((severityScore * 0.6 + adherenceRate * 0.4) * (moodMultiplier / 1.1))));
    const recoveryRate = Math.min(100, Math.max(5, Math.round(100 - data.severity * 8 + (adherenceRate > 70 ? 10 : 0))));
    const daysLeft = Math.max(1, Math.round(data.severity * 0.7));

    const metricsList = getStorage<RecoveryMetrics[]>('recovery_metrics', []);
    const updatedMetric: RecoveryMetrics = {
      id: 'metric-' + Date.now(),
      patient_id: data.patientId,
      prescription_id: 'pres-active',
      recovery_rate: recoveryRate,
      health_score: healthScore,
      estimated_days_left: daysLeft,
      updated_at: new Date().toISOString(),
    };

    const nextMetricsList = [
      updatedMetric,
      ...metricsList.filter((m) => m.patient_id !== data.patientId),
    ];
    setStorage('recovery_metrics', nextMetricsList);

    // Trigger AI Chat response & potential escalation
    ChatService.processCheckinWithAI(data.patientId, newCheckin);

    return { checkin: newCheckin, metrics: updatedMetric };
  },
};

// ============================================================================
// AI CHATBOT & ESCALATION SERVICE
// ============================================================================
export const ChatService = {
  getMessages(patientId: string): ChatMessage[] {
    const list = getStorage<ChatMessage[]>('chat_messages', INITIAL_SAMPLE_CHAT_MESSAGES);
    return list.filter((m) => m.patient_id === patientId);
  },

  addUserMessage(patientId: string, message: string): ChatMessage {
    const list = getStorage<ChatMessage[]>('chat_messages', []);
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      patient_id: patientId,
      sender: 'user',
      message,
      created_at: new Date().toISOString(),
    };
    setStorage('chat_messages', [...list, newMsg]);

    // Process AI response with safety & escalation logic
    setTimeout(() => {
      this.generateAIResponse(patientId, message);
    }, 700);

    return newMsg;
  },

  addBotMessage(
    patientId: string,
    message: string,
    metadata?: ChatMessage['metadata']
  ): ChatMessage {
    const list = getStorage<ChatMessage[]>('chat_messages', []);
    const botMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      patient_id: patientId,
      sender: 'bot',
      message,
      metadata,
      created_at: new Date().toISOString(),
    };
    setStorage('chat_messages', [...list, botMsg]);
    return botMsg;
  },

  processCheckinWithAI(patientId: string, checkin: Checkin) {
    if (checkin.severity >= 8 || checkin.mood === 'Worse') {
      // Escalation trigger: recommend doctor
      const doctors = DoctorService.getAllDoctors();
      const recommendedDoc = doctors[0]; // best match

      this.addBotMessage(
        patientId,
        `I am concerned to hear that your symptoms are worsening (severity ${checkin.severity}/10). Your comfort and safety come first. Because your condition is not improving as expected, I strongly recommend scheduling an immediate follow-up consultation with ${recommendedDoc.profile.full_name} (${recommendedDoc.specialization}).`,
        {
          shouldEscalate: true,
          recommendedDoctorId: recommendedDoc.user_id,
        }
      );

      NotificationService.createNotification({
        user_id: patientId,
        type: 'escalation',
        title: 'Doctor Follow-Up Recommended',
        body: `Based on your check-in report, we suggest booking a follow-up consultation with ${recommendedDoc.profile.full_name}.`,
        action_url: `/doctors`,
      });
    } else {
      this.addBotMessage(
        patientId,
        `Thank you for checking in. Logging a severity of ${checkin.severity}/10 and mood "${checkin.mood}". Keep taking your doses on time, drink warm water or soothing herbal tea, and get plenty of restorative sleep tonight.`
      );
    }
  },

  generateAIResponse(patientId: string, userText: string) {
    const lower = userText.toLowerCase();

    // 1. EMERGENCY KEYWORD DETECTION
    const emergencyTriggers = [
      'chest pain',
      'cannot breathe',
      'cant breathe',
      'difficulty breathing',
      'severe bleeding',
      'suicide',
      'kill myself',
      'heart attack',
      'unconscious',
      'stroke',
    ];

    const isEmergency = emergencyTriggers.some((kw) => lower.includes(kw));

    if (isEmergency) {
      this.addBotMessage(
        patientId,
        '🚨 EMERGENCY ALERT: The symptoms you described require IMMEDIATE clinical attention. Please do not wait. Call 112 (National Emergency) or 108 (Ambulance) right away, or tap the Emergency SOS panel below.',
        {
          isEmergency: true,
        }
      );
      return;
    }

    // 2. WORSENING / RE-CONSULTATION INQUIRY
    if (
      lower.includes('worse') ||
      lower.includes('pain increase') ||
      lower.includes('fever high') ||
      lower.includes('not getting better')
    ) {
      const doc = DoctorService.getAllDoctors()[0];
      this.addBotMessage(
        patientId,
        `I hear you, and it is very important not to overlook persistent or increasing symptoms. As an AI assistant, I cannot modify medications or diagnose new issues. I recommend connecting with a doctor today to review your treatment plan.`,
        {
          shouldEscalate: true,
          recommendedDoctorId: doc.user_id,
        }
      );
      return;
    }

    // 3. MEDICINE TIMING & ROUTINE QUESTIONS
    if (lower.includes('food') || lower.includes('when to take') || lower.includes('empty stomach')) {
      this.addBotMessage(
        patientId,
        'Most prescribed antibiotics and pain relievers should be taken after meals with a full glass of water to minimize stomach irritation. Please refer to your prescription details tab for exact dosage instructions provided by your doctor.'
      );
      return;
    }

    // 4. GENERAL WELLNESS & REASSURANCE
    const responses = [
      'Your dedication to recovery is wonderful. Be sure to stay well hydrated and avoid exertion today. How is your energy level holding up?',
      'Consistent rest is one of the most powerful healing tools. Make sure to sleep 7–8 hours and keep your sleeping space calm and airy.',
      'Thank you for sharing. Remember to complete the full course of your prescribed medication even if your symptoms begin to subside early.',
    ];
    const picked = responses[Math.floor(Math.random() * responses.length)];
    this.addBotMessage(patientId, picked);
  },
};

// ============================================================================
// NOTIFICATIONS SERVICE
// ============================================================================
export const NotificationService = {
  getNotifications(userId: string): NotificationItem[] {
    const list = getStorage<NotificationItem[]>('notifications', []);
    return list
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  markAsRead(notificationId: string) {
    const list = getStorage<NotificationItem[]>('notifications', []);
    const updated = list.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    setStorage('notifications', updated);
  },

  markAllAsRead(userId: string) {
    const list = getStorage<NotificationItem[]>('notifications', []);
    const updated = list.map((n) => (n.user_id === userId ? { ...n, read: true } : n));
    setStorage('notifications', updated);
  },

  createNotification(data: Omit<NotificationItem, 'id' | 'created_at' | 'read'>): NotificationItem {
    const list = getStorage<NotificationItem[]>('notifications', []);
    const newNotif: NotificationItem = {
      ...data,
      id: 'notif-' + Date.now(),
      read: false,
      created_at: new Date().toISOString(),
    };
    setStorage('notifications', [newNotif, ...list]);
    broadcastNotification(newNotif);
    return newNotif;
  },
};

// ============================================================================
// DISORDERS & EMERGENCY & TICKETS SERVICE
// ============================================================================
export const InformationService = {
  getDisorders(): Disorder[] {
    return getStorage<Disorder[]>('disorders', INITIAL_DISORDERS);
  },

  getEmergencyContacts(): EmergencyContact[] {
    return getStorage<EmergencyContact[]>('emergency_contacts', INITIAL_EMERGENCY_CONTACTS);
  },

  createSupportTicket(data: { userId?: string; subject: string; category: string; message: string }): SupportTicket {
    const list = getStorage<SupportTicket[]>('support_tickets', []);
    const newTicket: SupportTicket = {
      ...data,
      id: 'ticket-' + Date.now(),
      status: 'open',
      created_at: new Date().toISOString(),
    };
    setStorage('support_tickets', [newTicket, ...list]);
    return newTicket;
  },

  createErrorReport(data: {
    userId?: string;
    category: string;
    description: string;
    screenshotUrl?: string;
    pageUrl: string;
    deviceInfo: string;
  }): ErrorReport {
    const list = getStorage<ErrorReport[]>('error_reports', []);
    const newReport: ErrorReport = {
      id: 'err-' + Date.now(),
      user_id: data.userId,
      category: data.category,
      description: data.description,
      screenshot_url: data.screenshotUrl,
      page_url: data.pageUrl,
      device_info: data.deviceInfo,
      status: 'received',
      created_at: new Date().toISOString(),
    };
    setStorage('error_reports', [newReport, ...list]);
    return newReport;
  },
};
