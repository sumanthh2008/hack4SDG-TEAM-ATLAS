export type UserRole = 'patient' | 'doctor' | 'guest' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at?: string;
}

export interface DoctorProfile {
  user_id: string;
  specialization: string;
  license_number: string;
  experience_years: number;
  bio: string;
  languages: string[];
  consultation_fee: number;
  verified: boolean;
  rating: number;
  hospital_affiliation?: string;
  profile?: UserProfile;
}

export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  is_booked: boolean;
  created_at?: string;
}

export type AppointmentStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id?: string;
  reason: string;
  status: AppointmentStatus;
  decline_reason?: string;
  video_link?: string;
  scheduled_at: string;
  created_at: string;
  doctor?: DoctorProfile;
  patient?: UserProfile;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  timing: string; // e.g. "After Breakfast", "Before Bed"
  duration_days: number;
}

export interface Prescription {
  id: string;
  appointment_id?: string;
  doctor_id: string;
  patient_id: string;
  diagnosis: string;
  advice: string;
  follow_up_date?: string;
  created_at: string;
  items: PrescriptionItem[];
  doctor?: DoctorProfile;
}

export type ReminderStatus = 'pending' | 'taken' | 'skipped' | 'snoozed';

export interface MedicineReminder {
  id: string;
  prescription_item_id?: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  remind_at: string; // e.g. "08:30 AM", "02:00 PM", "09:00 PM"
  status: ReminderStatus;
  updated_at: string;
}

export interface Checkin {
  id: string;
  patient_id: string;
  prescription_id?: string;
  mood: 'Better' | 'Same' | 'Worse';
  severity: number; // 1 to 10
  notes: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  patient_id: string;
  sender: 'user' | 'bot';
  message: string;
  metadata?: {
    shouldEscalate?: boolean;
    isEmergency?: boolean;
    recommendedDoctorId?: string;
    quickOptions?: string[];
  };
  created_at: string;
}

export interface RecoveryMetrics {
  id: string;
  patient_id: string;
  prescription_id: string;
  recovery_rate: number; // percentage 0-100
  health_score: number;  // 0 to 100
  estimated_days_left: number;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'appointment_pending' | 'appointment_accepted' | 'appointment_declined' | 'medicine_reminder' | 'checkin_request' | 'escalation' | 'system';
  title: string;
  body: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Disorder {
  id: string;
  name: string;
  category: string;
  overview: string;
  symptoms: string[];
  when_to_see_doctor: string;
  suggested_specialization: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: string;
  region: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface ErrorReport {
  id: string;
  user_id?: string;
  category: string;
  description: string;
  screenshot_url?: string;
  page_url: string;
  device_info: string;
  status: 'received' | 'investigating' | 'resolved';
  created_at: string;
}
