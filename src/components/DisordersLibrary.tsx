import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Stethoscope, 
  AlertCircle, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { InformationService } from '../services/supabase';
import type { Disorder } from '../types/database';

interface DisordersLibraryProps {
  onSelectSpecialist: (specialization: string) => void;
}

export const DisordersLibrary: React.FC<DisordersLibraryProps> = ({ onSelectSpecialist }) => {
  const disorders = InformationService.getDisorders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(disorders.map((d) => d.category));
    return ['All', ...Array.from(set)];
  }, [disorders]);

  const filteredDisorders = useMemo(() => {
    return disorders
      .filter((d) => {
        const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          d.name.toLowerCase().includes(q) ||
          d.overview.toLowerCase().includes(q) ||
          d.symptoms.some((s) => s.toLowerCase().includes(q)) ||
          d.suggested_specialization.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [disorders, selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/80 rounded-full text-xs font-semibold text-teal-800">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Knowledge & Patient Education</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          A–Z Health Disorders Library
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          Explore evidence-based overviews, red flag warning signs, and book timely consultations with verified specialists.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disorders by name, symptoms (e.g., headache, asthma, rash) or specialty..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1 pl-1 pr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disorders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisorders.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No condition matches your search</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching with another keyword or explore all medical categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 bg-teal-50 text-teal-700 font-bold text-xs rounded-xl hover:bg-teal-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDisorders.map((disorder) => {
            const isExpanded = expandedId === disorder.id;
            return (
              <div
                key={disorder.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-[11px] font-bold">
                      {disorder.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {disorder.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    {disorder.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {disorder.overview}
                  </p>

                  {/* Symptoms Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Common Symptoms:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {disorder.symptoms.slice(0, isExpanded ? undefined : 3).map((sym, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[11px]"
                        >
                          {sym}
                        </span>
                      ))}
                      {!isExpanded && disorder.symptoms.length > 3 && (
                        <button
                          onClick={() => setExpandedId(disorder.id)}
                          className="text-[11px] font-bold text-teal-600 hover:underline pl-1"
                        >
                          +{disorder.symptoms.length - 3} more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* When to see doctor */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-[11px] text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      When to see a doctor:
                    </div>
                    <p className="leading-relaxed text-amber-900/90">{disorder.when_to_see_doctor}</p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    <span className="block font-semibold text-slate-600">
                      {disorder.suggested_specialization}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectSpecialist(disorder.suggested_specialization)}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Book Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
