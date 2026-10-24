import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  X, 
  HeartPulse, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { InformationService } from '../services/supabase';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'helplines' | 'firstaid' | 'hospitals'>('helplines');
  const contacts = InformationService.getEmergencyContacts();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-title"
      >
        {/* Header with High-Visibility Emergency Theme */}
        <div className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-bold tracking-wider uppercase bg-white text-red-600 rounded-full">
                  Urgent Care
                </span>
                <span className="text-xs text-red-100">Pan-India Support</span>
              </div>
              <h2 id="sos-title" className="text-xl sm:text-2xl font-bold font-heading mt-1">
                Emergency & SOS Helplines
              </h2>
              <p className="text-xs sm:text-sm text-red-100 mt-0.5">
                Immediate response contacts and emergency protocols. 24x7 toll-free assistance.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close emergency modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'helplines'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            Direct Call Numbers
          </button>
          <button
            onClick={() => setActiveTab('firstaid')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'firstaid'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Quick First-Aid Tips
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`pb-3 px-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hospitals'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Nearby Hospitals
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'helplines' && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center gap-3 text-red-800 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <span>
                  Tap any card to instantly dial the verified helpline. In case of serious chest pain, breathlessness, or trauma, call <strong>112</strong> or <strong>108</strong> without delay.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {contacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.number.split('/')[0].replace(/\s+/g, '')}`}
                    className="group p-4 bg-white hover:bg-red-50/50 rounded-2xl border border-slate-200 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md group-hover:bg-red-100 group-hover:text-red-700 transition-colors">
                          {contact.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{contact.region}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{contact.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {contact.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-red-600 font-extrabold text-base">
                      <span>{contact.number}</span>
                      <div className="p-1.5 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'firstaid' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-red-600">
                  <Activity className="w-4 h-4" /> Suspected Heart Attack / Chest Pain
                </h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Keep the patient in a comfortable seated position (W-position on floor with knees bent).</li>
                  <li>Loosen tight clothing around neck and chest.</li>
                  <li>Call <strong>112</strong> or <strong>108</strong> immediately.</li>
                  <li>Do not leave the patient unattended or give food/water.</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-amber-600">
                  <Activity className="w-4 h-4" /> Severe Asthma / Breathing Distress
                </h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Help the person sit upright and stay calm. Avoid lying down.</li>
                  <li>Administer 2–4 puffs of their rescue inhaler (Salbutamol) via spacer if available.</li>
                  <li>Repeat inhaler puffs after 5 minutes if no improvement. Call ambulance.</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-purple-600">
                  <Activity className="w-4 h-4" /> Suspected Overdose / Severe Alcohol Withdrawal
                </h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Place the person in the recovery position (on their side) to keep airways clear and prevent choking.</li>
                  <li>Check for slow/shallow breathing or blue lips; dial <strong>108</strong> / <strong>112</strong> immediately.</li>
                  <li>For alcohol withdrawal tremors, seizures, or confusion (delirium tremens), hospital detox is vital. Call <strong>1800-11-0031</strong>.</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm text-rose-600">
                  <Activity className="w-4 h-4" /> Acute TB Hemoptysis (Coughing Large Amounts of Blood)
                </h4>
                <ul className="text-xs text-slate-600 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Sit the patient upright or position them leaning toward the bleeding side to protect the healthy lung.</li>
                  <li>Instruct the patient to gently cough and not swallow blood. Avoid warm beverages.</li>
                  <li>Rush to the nearest emergency hospital or call <strong>108</strong>. National TB support: <strong>1800-11-6666</strong>.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl mx-auto flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Locate Emergency Hospitals Near You</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Instantly open Google Maps with your current GPS coordinates to view the nearest 24x7 emergency casualty wards, trauma centers, and ICU facilities.
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/hospital+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-500/25 transition-all text-sm"
              >
                <span>Open Emergency Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-slate-400">
                Tip: If driving is risky, call <strong>108</strong> for emergency medical transit.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Disclaimer: Sankalp SOS facilitates emergency contacts; not a replacement for 112 services.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
