import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Pill, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  User, 
  HeartPulse, 
  ShieldAlert,
  ArrowRight,
  Info,
  Calendar,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ChatService, 
  PrescriptionService, 
  RecoveryService, 
  DoctorService 
} from '../services/supabase';
import type { 
  ChatMessage, 
  MedicineReminder, 
  Checkin 
} from '../types/database';

interface AIFollowupChatProps {
  patientId: string;
  onBookRecommendedDoctor: (doctorId: string) => void;
  onOpenSOSModal: () => void;
  onGoToRecoveryTracker: () => void;
}

export const AIFollowupChat: React.FC<AIFollowupChatProps> = ({
  patientId,
  onBookRecommendedDoctor,
  onOpenSOSModal,
  onGoToRecoveryTracker,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinMood, setCheckinMood] = useState<'Better' | 'Same' | 'Worse'>('Better');
  const [checkinSeverity, setCheckinSeverity] = useState<number>(3);
  const [checkinNotes, setCheckinNotes] = useState('');
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const loadData = () => {
    const msgs = ChatService.getMessages(patientId);
    setMessages(msgs);
    const rems = PrescriptionService.getRemindersForPatient(patientId);
    setReminders(rems);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sankalp_state_change', loadData);
    return () => window.removeEventListener('sankalp_state_change', loadData);
  }, [patientId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    ChatService.addUserMessage(patientId, inputText.trim());
    setInputText('');
  };

  const handleQuickOption = (option: string) => {
    ChatService.addUserMessage(patientId, option);
  };

  const handleReminderAction = (reminderId: string, status: 'taken' | 'skipped' | 'snoozed') => {
    PrescriptionService.updateReminderStatus(reminderId, status);
    if (status === 'taken') {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#5FB8B0', '#CDEBDD'],
      });
    }
    loadData();
  };

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCheckin(true);

    setTimeout(() => {
      RecoveryService.submitCheckin({
        patientId,
        mood: checkinMood,
        severity: checkinSeverity,
        notes: checkinNotes,
      });

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5FB8B0', '#CDEBDD', '#BFE3F2'],
      });

      setIsSubmittingCheckin(false);
      setShowCheckinModal(false);
      setCheckinNotes('');
      loadData();
    }, 500);
  };

  const pendingReminders = reminders.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Care Assistant • Claude Powered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Post-Consultation Follow-Up & Medicine Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log your doses, complete your daily recovery check-in, and receive guided health reassurance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCheckinModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Daily Health Check-in</span>
          </button>
          <button
            onClick={onGoToRecoveryTracker}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            View Tracker Gauge
          </button>
        </div>
      </div>

      {/* Main 2-Column: Left = Medicine Reminders Schedule, Right = AI Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Dose Reminders & Adherence */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    Today's Medicine Schedule
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {pendingReminders.length} doses pending today
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                Active Routine
              </span>
            </div>

            {reminders.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                <Pill className="w-8 h-8 mx-auto text-slate-300" />
                <p>No active prescription reminders scheduled.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((rem) => {
                  const isTaken = rem.status === 'taken';
                  const isSkipped = rem.status === 'skipped';
                  const isPending = rem.status === 'pending';

                  return (
                    <div
                      key={rem.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isTaken
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : isSkipped
                          ? 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-white border-slate-200 shadow-sm hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {rem.remind_at}
                            </span>
                            {isTaken && (
                              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Taken
                              </span>
                            )}
                            {isSkipped && (
                              <span className="text-[10px] font-bold text-slate-400">Skipped</span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                            {rem.medicine_name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{rem.dosage}</p>
                        </div>

                        {/* Interactive Dose Action Buttons */}
                        {isPending && (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleReminderAction(rem.id, 'taken')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1"
                              title="Mark as Taken"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Taken</span>
                            </button>
                            <button
                              onClick={() => handleReminderAction(rem.id, 'skipped')}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                              title="Skip Dose"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleReminderAction(rem.id, 'snoozed')}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                              title="Snooze 30 mins"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick check-in prompt card */}
            <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 text-xs text-teal-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span>Daily Recovery Routine:</span>
              </div>
              <p className="leading-relaxed text-teal-900/90 text-[11px]">
                Checking in once each day helps calculate your health score gauge and lets our assistant adapt your recovery timeline.
              </p>
              <button
                onClick={() => setShowCheckinModal(true)}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                Log Today's Health Score
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Chatbot Interface */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200/80 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base font-heading">Sankalp Care Assistant</h3>
                <p className="text-[11px] text-teal-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  Follow-Up & Wellness Companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
              <Info className="w-3 h-3 text-teal-200" />
              <span className="text-teal-50 hidden sm:inline">Non-Diagnostic Guidance</span>
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Safety Note:</strong> Sankalp AI guides routine wellness and reminders. It never diagnoses or alters prescriptions. In emergency, tap Emergency SOS.
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              const isEmergency = msg.metadata?.isEmergency;
              const shouldEscalate = msg.metadata?.shouldEscalate;
              const recommendedDocId = msg.metadata?.recommendedDoctorId;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isBot
                        ? isEmergency
                          ? 'bg-red-500 text-white'
                          : 'bg-teal-100 text-teal-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2 max-w-[85%]">
                    <div
                      className={`p-4 rounded-3xl leading-relaxed text-xs sm:text-sm ${
                        isBot
                          ? isEmergency
                            ? 'bg-red-50 border border-red-300 text-red-950 font-medium'
                            : shouldEscalate
                            ? 'bg-amber-50/80 border border-amber-200 text-amber-950'
                            : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                          : 'bg-teal-600 text-white rounded-br-none shadow-sm'
                      }`}
                    >
                      {msg.message}
                    </div>

                    {/* ESCALATION ACTION: Book Recommended Doctor Button */}
                    {shouldEscalate && recommendedDocId && (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
                        <span className="text-[11px] font-bold text-teal-900">
                          Recommended Next Step:
                        </span>
                        <button
                          onClick={() => onBookRecommendedDoctor(recommendedDocId)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1"
                        >
                          <span>Book Follow-up Doctor</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* EMERGENCY TRIGGER: Emergency SOS Panel Button */}
                    {isEmergency && (
                      <div className="p-3 bg-red-100 border border-red-300 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
                        <span className="text-xs font-extrabold text-red-900 flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                          Emergency Response:
                        </span>
                        <button
                          onClick={onOpenSOSModal}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all animate-pulse"
                        >
                          Open Emergency SOS Numbers
                        </button>
                      </div>
                    )}

                    {/* Quick Options Chips */}
                    {msg.metadata?.quickOptions && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.metadata.quickOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickOption(opt)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about your routine, or tell me how you feel today..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-md shadow-teal-600/20 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Daily Health Check-in Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base font-heading">Daily Health Check-in</h3>
              </div>
              <button
                onClick={() => setShowCheckinModal(false)}
                className="p-1 text-white/80 hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckinSubmit} className="p-6 space-y-5 text-xs text-slate-800">
              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Compared to yesterday, are you feeling:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckinMood('Better')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      checkinMood === 'Better'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Smile className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    <span className="font-bold text-xs">Better</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckinMood('Same')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      checkinMood === 'Same'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Meh className="w-6 h-6 mx-auto mb-1 text-amber-600" />
                    <span className="font-bold text-xs">About Same</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckinMood('Worse')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      checkinMood === 'Worse'
                        ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Frown className="w-6 h-6 mx-auto mb-1 text-red-600" />
                    <span className="font-bold text-xs">Worse</span>
                  </button>
                </div>
              </div>

              {/* Symptom Severity Slider 1 to 10 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="uppercase tracking-wider">Symptom Severity (1–10)</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                      checkinSeverity <= 3
                        ? 'bg-emerald-100 text-emerald-800'
                        : checkinSeverity <= 6
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Level {checkinSeverity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={checkinSeverity}
                  onChange={(e) => setCheckinSeverity(parseInt(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>1 (Mild / Minimal)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe distress)</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  placeholder="E.g., Fever went down, sore throat feels better after warm soup..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCheckinModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCheckin}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  {isSubmittingCheckin ? 'Recording...' : 'Submit Health Check-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
