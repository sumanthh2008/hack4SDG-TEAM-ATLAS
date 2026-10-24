import React, { useState, useEffect } from 'react';
import { Bug, X, UploadCloud, CheckCircle2, Monitor, AlertCircle, Clock } from 'lucide-react';
import { InformationService } from '../services/supabase';
import type { ErrorReport } from '../types/database';

interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({ isOpen, onClose, userId }) => {
  const [tab, setTab] = useState<'submit' | 'history'>('submit');
  const [category, setCategory] = useState<string>('Video Consultation');
  const [description, setDescription] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [myReports, setMyReports] = useState<ErrorReport[]>([]);

  const autoPageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const autoDeviceInfo = typeof navigator !== 'undefined' 
    ? `${navigator.userAgent} | Screen: ${window.screen.width}x${window.screen.height}`
    : 'Web Browser';

  useEffect(() => {
    if (isOpen) {
      // Load user error reports
      try {
        const raw = localStorage.getItem('sankalp_health_error_reports');
        if (raw) {
          const list: ErrorReport[] = JSON.parse(raw);
          setMyReports(userId ? list.filter((r) => r.user_id === userId) : list);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, userId, successId]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const report = InformationService.createErrorReport({
        userId,
        category,
        description,
        screenshotUrl: screenshotPreview || undefined,
        pageUrl: autoPageUrl,
        deviceInfo: autoDeviceInfo,
      });

      setIsSubmitting(false);
      setSuccessId(report.id);
      setDescription('');
      setScreenshotPreview(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">Report an Issue or Bug</h2>
              <p className="text-xs text-teal-100">
                Help us improve Sankalp. Diagnostics are captured automatically.
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

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setTab('submit')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all ${
              tab === 'submit'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            New Error Report
          </button>
          <button
            onClick={() => setTab('history')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              tab === 'history'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>My Submitted Reports</span>
            {myReports.length > 0 && (
              <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                {myReports.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'submit' ? (
            successId ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Thank you for reporting!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Your bug report has been logged with ID <strong>{successId}</strong>. Our engineering team investigates every ticket promptly.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setSuccessId(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Submit Another Report
                  </button>
                  <button
                    onClick={() => setTab('history')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    View Status Tracker
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  >
                    <option value="Video Consultation">Video / Audio Consultation Room</option>
                    <option value="Appointment Booking">Appointment Booking & Slots</option>
                    <option value="AI Chatbot & Reminders">AI Follow-up Chatbot & Reminders</option>
                    <option value="Prescription PDF">Prescription Viewer & Download</option>
                    <option value="Recovery Tracker">Recovery Tracker & Gauges</option>
                    <option value="Account & Auth">Login / Role Switching</option>
                    <option value="Other">Other UI or Technical Glitch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Describe what happened <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g., I tapped 'Blur my video' but the video preview took several seconds to update, or button was unresponsive..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Optional Screenshot
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-input"
                    />
                    <label htmlFor="screenshot-input" className="cursor-pointer block">
                      {screenshotPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={screenshotPreview}
                            alt="Screenshot preview"
                            className="max-h-36 rounded-xl border border-slate-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setScreenshotPreview(null);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2 text-slate-500">
                          <UploadCloud className="w-7 h-7 text-teal-600 mb-1" />
                          <span className="text-xs font-medium text-slate-700">
                            Click to upload screenshot (PNG, JPG)
                          </span>
                          <span className="text-[11px] text-slate-400">Up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Auto-Captured Environment Card */}
                <div className="p-3 bg-teal-50/50 rounded-2xl border border-teal-100/60 text-xs text-teal-900 flex items-start gap-2.5">
                  <Monitor className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px]">
                    <div className="font-semibold text-teal-800">Auto-captured Diagnostic Context:</div>
                    <div className="text-teal-700/80 truncate">URL: {autoPageUrl}</div>
                    <div className="text-teal-700/80 truncate">Device: {autoDeviceInfo}</div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !description.trim()}
                    className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {myReports.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">No issue reports submitted yet.</p>
                </div>
              ) : (
                myReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{report.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                          report.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : report.status === 'investigating'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{report.description}</p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>ID: {report.id}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
