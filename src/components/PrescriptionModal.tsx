import React, { useState } from 'react';
import { 
  FilePlus, 
  X, 
  Plus, 
  Trash2, 
  Pill, 
  Calendar, 
  Sparkles, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrescriptionService } from '../services/supabase';
import type { PrescriptionItem } from '../types/database';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  patientId: string;
  appointmentId?: string;
  patientName?: string;
  onPrescriptionCreated?: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  doctorId,
  patientId,
  appointmentId,
  patientName,
  onPrescriptionCreated,
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [items, setItems] = useState<Array<Omit<PrescriptionItem, 'id' | 'prescription_id'>>>([
    {
      medicine_name: 'Amoxicillin 500mg',
      dosage: '1 Capsule',
      frequency: 'Twice a day (1-0-1)',
      timing: 'After Food',
      duration_days: 5,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        medicine_name: '',
        dosage: '1 Tablet',
        frequency: 'Twice a day (1-0-1)',
        timing: 'After Food',
        duration_days: 5,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      PrescriptionService.createPrescription({
        appointmentId,
        doctorId,
        patientId,
        diagnosis,
        advice: advice || 'Rest well, complete full antibiotic course, and drink plenty of fluids.',
        followUpDate,
        items,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#5FB8B0', '#CDEBDD', '#BFE3F2'],
      });

      setIsSubmitting(false);
      onPrescriptionCreated?.();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <FilePlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">Write Digital Prescription</h2>
              <p className="text-xs text-teal-100">
                Patient: <span className="font-semibold text-white">{patientName || patientId}</span> • Automatically syncs with AI follow-up reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Diagnosis & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinical Diagnosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="E.g. Acute Pharyngitis & Bronchial Cough"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Medicines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Prescribed Medications (Rx)</span>
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Medicine Name</label>
                    <input
                      type="text"
                      required
                      value={item.medicine_name}
                      onChange={(e) => handleItemChange(idx, 'medicine_name', e.target.value)}
                      placeholder="e.g. Paracetamol 650mg"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Dosage</label>
                    <input
                      type="text"
                      value={item.dosage}
                      onChange={(e) => handleItemChange(idx, 'dosage', e.target.value)}
                      placeholder="1 Tab / 5ml"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Frequency</label>
                    <select
                      value={item.frequency}
                      onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-600"
                    >
                      <option value="Once a day (0-0-1)">Once a day</option>
                      <option value="Twice a day (1-0-1)">Twice a day (1-0-1)</option>
                      <option value="Thrice a day (1-1-1)">Thrice a day (1-1-1)</option>
                      <option value="SOS (As needed)">SOS (As needed)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Timing</label>
                    <select
                      value={item.timing}
                      onChange={(e) => handleItemChange(idx, 'timing', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-600"
                    >
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food</option>
                      <option value="Before Bedtime">Before Bedtime</option>
                      <option value="With Warm Water">With Warm Water</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Days</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={item.duration_days}
                      onChange={(e) => handleItemChange(idx, 'duration_days', parseInt(e.target.value) || 5)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                    <button
                      type="button"
                      disabled={items.length === 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-md transition-colors disabled:opacity-30"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Lifestyle Guidance */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Doctor's Advice & Patient Instructions
            </label>
            <textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="E.g., Steam inhalation twice daily, drink lukewarm water, avoid dusty areas, rest voice..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
            />
          </div>

          {/* AI Follow-Up Pipeline Banner */}
          <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-start gap-3 text-xs text-teal-900">
            <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-800">Automated Post-Visit Pipeline:</span>
              <p className="text-teal-700 mt-0.5 leading-relaxed">
                Saving this prescription will automatically construct an in-app reminder schedule (Morning / Evening / Night) and prompt the patient with daily check-ins for their recovery tracking.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !diagnosis.trim()}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving & Syncing...' : 'Submit & Activate AI Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
