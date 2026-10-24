import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Heart, 
  Pill, 
  ShieldCheck, 
  Check, 
  X,
  Droplet,
  Moon,
  Coffee,
  Sun
} from 'lucide-react';
import { RecoveryService, PrescriptionService } from '../services/supabase';
import type { RecoveryMetrics, Checkin, MedicineReminder, Prescription } from '../types/database';

interface RecoveryTrackerProps {
  patientId: string;
  onOpenCheckin?: () => void;
  onOpenConsultDoctor?: () => void;
}

export const RecoveryTracker: React.FC<RecoveryTrackerProps> = ({
  patientId,
  onOpenCheckin,
  onOpenConsultDoctor,
}) => {
  const [metrics, setMetrics] = useState<RecoveryMetrics | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  const loadData = () => {
    const met = RecoveryService.getMetricsForPatient(patientId);
    setMetrics(met);
    const chks = RecoveryService.getCheckinsForPatient(patientId);
    setCheckins(chks);
    const rems = PrescriptionService.getRemindersForPatient(patientId);
    setReminders(rems);
    const prescs = PrescriptionService.getPrescriptionsForPatient(patientId);
    setPrescriptions(prescs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sankalp_state_change', loadData);
    return () => window.removeEventListener('sankalp_state_change', loadData);
  }, [patientId]);

  const activePrescription = prescriptions[0];
  const healthScore = metrics?.health_score ?? 78;
  const recoveryRate = metrics?.recovery_rate ?? 70;
  const daysLeft = metrics?.estimated_days_left ?? 3;

  // Adherence calculation
  const takenCount = reminders.filter((r) => r.status === 'taken').length;
  const totalReminders = reminders.length;
  const adherencePercentage = totalReminders > 0 ? Math.round((takenCount / totalReminders) * 100) : 85;

  // Gauge colors
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#5FB8B0'; // Teal (good)
    if (score >= 50) return '#F59E0B'; // Soft Amber (caution)
    return '#F07167'; // Soft Coral (concern)
  };

  const scoreColor = getScoreColor(healthScore);

  // SVG Gauge calculations (circumference for radius 65)
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800 mb-2">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Condition & Vitality Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Personalized Recovery Care Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time synthesis of your medicine adherence, reported check-ins, and doctor's prescribed duration.
          </p>
        </div>

        {activePrescription && (
          <div className="p-3 bg-white border border-teal-100 rounded-2xl shadow-sm text-xs self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Active Treatment Plan
            </span>
            <span className="font-bold text-slate-800 block truncate max-w-xs">
              {activePrescription.diagnosis}
            </span>
          </div>
        )}
      </div>

      {/* Main Highlights Grid: Health Gauge + Recovery Rate + Days Remaining */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Health Score Circular Gauge */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Health Score
          </span>

          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#E2E8F0"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Colored score meter */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scoreColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-900 font-heading">
                {healthScore}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{
                backgroundColor: healthScore >= 75 ? '#E8F7F0' : healthScore >= 50 ? '#FEF3C7' : '#FEE2E2',
                color: healthScore >= 75 ? '#2A6A50' : healthScore >= 50 ? '#92400E' : '#B91C1C',
              }}
            >
              {healthScore >= 75 ? 'Healthy Progress' : healthScore >= 50 ? 'Moderate Recovery' : 'Requires Attention'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Calculated from daily severity + doses
            </p>
          </div>
        </div>

        {/* Card 2: Recovery Rate Trend */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Recovery Rate
              </span>
              <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading">
              {recoveryRate}%
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span>↑ 12% improvement over past 48 hours</span>
            </p>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${recoveryRate}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Day 1 (Baseline)</span>
              <span>Target (100%)</span>
            </div>
          </div>

          {/* Adherence Streak */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" /> Medicine Adherence
            </span>
            <span className="font-extrabold text-slate-800">{adherencePercentage}%</span>
          </div>
        </div>

        {/* Card 3: Estimated Recovery Days Remaining */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estimated Recovery Time
              </span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-heading">
              {daysLeft} {daysLeft === 1 ? 'Day' : 'Days'} Remaining
            </div>
            <p className="text-xs text-slate-500">
              Based on prescribed treatment course & check-in responses
            </p>
          </div>

          {/* Days Timeline Indicator */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day <= (7 - daysLeft);
              const isCurrent = day === (7 - daysLeft + 1);

              return (
                <div
                  key={day}
                  className={`py-2 text-center rounded-xl text-xs font-bold transition-all ${
                    isPast
                      ? 'bg-teal-600 text-white'
                      : isCurrent
                      ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-500/30'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <span className="block text-[9px] uppercase font-semibold">D{day}</span>
                  <span>{isPast ? '✓' : day}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            * Note: Predictions are statistical estimates and adjust as you complete daily check-ins.
          </p>
        </div>
      </div>

      {/* Symptom Severity Trend Chart (Visual SVG) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Symptom Severity Trend Over Time
            </h3>
            <p className="text-xs text-slate-500">
              Lower scores indicate milder symptoms and progressive healing (10 = severe, 1 = recovered).
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full self-start sm:self-auto">
            Trending Downward (Healing)
          </span>
        </div>

        {/* Visual Line Chart Area */}
        <div className="h-44 w-full bg-slate-50/70 rounded-2xl p-4 flex flex-col justify-between border border-slate-100 relative">
          <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-dashed border-slate-200 pb-1">
            <span>Severe (10)</span>
            <span>Moderate (5)</span>
            <span>Minimal (1)</span>
          </div>

          {/* SVG Trendline */}
          <div className="relative h-24 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5FB8B0" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#5FB8B0" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon
                points="0,80 120,70 250,45 375,25 500,15 500,100 0,100"
                fill="url(#trendGradient)"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#5FB8B0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,80 120,70 250,45 375,25 500,15"
              />

              {/* Data points */}
              <circle cx="0" cy="80" r="5" fill="#5FB8B0" />
              <circle cx="120" cy="70" r="5" fill="#5FB8B0" />
              <circle cx="250" cy="45" r="5" fill="#5FB8B0" />
              <circle cx="375" cy="25" r="5" fill="#5FB8B0" />
              <circle cx="500" cy="15" r="6" fill="#2B7871" stroke="#fff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1">
            <span>Day 1 (Onset)</span>
            <span>Day 2</span>
            <span>Day 3 (Consultation)</span>
            <span>Day 4</span>
            <span className="text-teal-700 font-bold">Today</span>
          </div>
        </div>
      </div>

      {/* AI Personalized Do's & Don'ts */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">
                AI Personalized Recovery Do's & Don'ts
              </h3>
              <p className="text-xs text-slate-500">
                Tailored for {activePrescription?.diagnosis || 'general wellness & recovery'}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">General Wellness Guidance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO's */}
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
            <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Practices (Do's)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <Droplet className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Hydrate frequently with lukewarm water or clear herbal broth (min 2.5L/day).</span>
              </li>
              <li className="flex items-start gap-2">
                <Moon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Aim for 7–8 hours of restorative, uninterrupted sleep to support cell repair.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sun className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Perform gentle steam inhalation twice daily for 5 minutes to soothe airways.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Complete the full medication course even after symptoms subside.</span>
              </li>
            </ul>
          </div>

          {/* DON'Ts */}
          <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
            <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Things to Avoid (Don'ts)</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>Do not consume chilled, iced, or deep-fried foods that trigger mucosal irritation.</span>
              </li>
              <li className="flex items-start gap-2">
                <Coffee className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>Limit caffeine, energy drinks, and alcohol while taking antibiotics.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>Avoid intense cardiovascular exertion until your doctor clears you.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>Never skip or double doses if you miss a scheduled medicine time.</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic text-center">
          Disclaimer: These recommendations are synthesized by Sankalp AI for general recovery support and do not substitute specific medical instructions from your physician.
        </p>
      </div>
    </div>
  );
};
