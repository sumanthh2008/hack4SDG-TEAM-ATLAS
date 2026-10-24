import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  X,
  Stethoscope,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DoctorService, AppointmentService } from '../services/supabase';
import type { DoctorProfile, UserProfile, AvailabilitySlot } from '../types/database';

interface DoctorDiscoveryProps {
  currentUserId: string;
  patientName?: string;
  onAppointmentBooked?: () => void;
  initialSpecialization?: string | null;
}

export const DoctorDiscovery: React.FC<DoctorDiscoveryProps> = ({
  currentUserId,
  patientName,
  onAppointmentBooked,
  initialSpecialization,
}) => {
  const doctors = DoctorService.getAllDoctors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    initialSpecialization || 'All'
  );
  const [selectedDoctor, setSelectedDoctor] = useState<(DoctorProfile & { profile: UserProfile }) | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [reason, setReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const specialties = useMemo(() => {
    const list = Array.from(new Set(doctors.map((d) => d.specialization)));
    return ['All', ...list];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpec =
        selectedSpecialty === 'All' ||
        doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const q = searchQuery.toLowerCase();
      const matchQuery =
        doc.profile.full_name.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.bio.toLowerCase().includes(q) ||
        doc.languages.some((l) => l.toLowerCase().includes(q));
      return matchSpec && matchQuery;
    });
  }, [doctors, selectedSpecialty, searchQuery]);

  const doctorSlots = useMemo(() => {
    if (!selectedDoctor) return [];
    return DoctorService.getDoctorSlots(selectedDoctor.user_id).filter((s) => !s.is_booked);
  }, [selectedDoctor, bookingSuccess]);

  const handleOpenBooking = (doc: DoctorProfile & { profile: UserProfile }) => {
    setSelectedDoctor(doc);
    setSelectedSlot(null);
    setReason('');
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedSlot || !reason.trim()) return;

    setIsBooking(true);
    setBookingError(null);

    try {
      AppointmentService.bookAppointment({
        patientId: currentUserId,
        doctorId: selectedDoctor.user_id,
        slotId: selectedSlot.id,
        scheduledAt: selectedSlot.start_time,
        reason: reason.trim(),
        patientName,
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5FB8B0', '#CDEBDD', '#BFE3F2'],
      });

      setIsBooking(false);
      setBookingSuccess(true);
      onAppointmentBooked?.();
    } catch (err: any) {
      setIsBooking(false);
      setBookingError(err.message || 'Failed to book slot. Please try another slot.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800">
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
          <span>Verified Specialists & Practitioners</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Find Your Doctor & Schedule Care
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Choose from top-tier verified physicians. Select a preferred time slot, connect over HD WebRTC video, and continue with AI follow-up support.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty (e.g. Cardiologist, Diabetologist), or language..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
          />
        </div>

        {/* Specialty Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 pl-1 pr-2">
            <Filter className="w-3.5 h-3.5" /> Specialties:
          </span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.user_id}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg border border-slate-200/80 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Doctor Avatar & Badges */}
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={doc.profile.avatar_url}
                    alt={doc.profile.full_name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shadow-sm"
                  />
                  {doc.verified && (
                    <span
                      className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-full shadow"
                      title="Verified Doctor"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors font-heading">
                    {doc.profile.full_name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600">{doc.specialization}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                      {doc.rating}
                    </span>
                    <span>•</span>
                    <span>{doc.experience_years} yrs exp</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {doc.bio}
              </p>

              {/* Hospital Affiliation & Languages */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {doc.hospital_affiliation && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doc.hospital_affiliation}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{doc.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleOpenBooking(doc)}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slot Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.profile.avatar_url}
                  alt={selectedDoctor.profile.full_name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white/30"
                />
                <div>
                  <h3 className="font-bold text-lg font-heading">
                    Book Consultation with {selectedDoctor.profile.full_name}
                  </h3>
                  <p className="text-xs text-teal-100">
                    {selectedDoctor.specialization} • Online Video Visit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {bookingSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading">
                      Consultation Request Sent! 🎉
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                      Your booking request has been forwarded to{' '}
                      <strong>{selectedDoctor.profile.full_name}</strong>. Once approved, your encrypted WebRTC video link will activate 5 minutes before consultation time.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      View in My Appointments
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-5">
                  {bookingError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Available Time Slots */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Available Time Slot <span className="text-red-500">*</span>
                    </label>

                    {doctorSlots.length === 0 ? (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                        No upcoming open slots currently. Please check back soon or consult another specialist.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {doctorSlots.slice(0, 9).map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          const dateObj = new Date(slot.start_time);
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20'
                                  : 'bg-slate-50 border-slate-200 hover:border-teal-300 text-slate-700'
                              }`}
                            >
                              <span className="block text-[10px] font-bold text-slate-400">
                                {dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                              </span>
                              <span className="block text-xs font-extrabold mt-0.5">
                                {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Reason for Visit / Symptoms */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Reason for Visit / Symptoms <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe what symptoms you are experiencing (e.g. sore throat for 3 days, mild fever at night, chest tightness)..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                    />
                  </div>

                  {/* Health Data Consent Checkbox (Quality/Compliance) */}
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-start gap-2 text-xs text-teal-900">
                    <input
                      type="checkbox"
                      required
                      id="consent-check"
                      defaultChecked
                      className="mt-0.5 accent-teal-600"
                    />
                    <label htmlFor="consent-check" className="cursor-pointer text-[11px] leading-relaxed">
                      I consent to sharing my reported symptoms and consultation notes with the doctor and the post-visit AI care assistant for recovery monitoring.
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isBooking || !selectedSlot || !reason.trim()}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isBooking ? 'Securing Slot...' : 'Confirm Appointment Request'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
