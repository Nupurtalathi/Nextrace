import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Archive,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { CaseDetailModal } from '../cases/CaseDetailModal';

export const HistoricalCaseRepository: React.FC = () => {
  const { cases, setSelectedCaseId, setActivePage } = useApp();

  const [search, setSearch] = useState('');
  const [selectedMo, setSelectedMo] = useState<string>('ALL');
  const [inspectCaseId, setInspectCaseId] = useState<string | null>(null);

  // Closed or historical cases
  const historicalCases = cases.filter(c => c.status === 'CLOSED' || c.recoveryDetails?.closureStatus === 'CLOSED');

  const filteredCases = historicalCases.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.fullName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.fir.firNumber.toLowerCase().includes(q) ||
        c.policeStation.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Archive className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Historical Case Repository & Closed Precedents
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Archived cases retained under statutory custody rules (10–25 years) searchable for continuous cross-district AI pattern discovery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold border border-slate-200">
            {historicalCases.length} Sealed Records Indexed
          </span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search archived dossiers by victim name, FIR, MO, vehicle plate, transit node..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <select
          value={selectedMo}
          onChange={e => setSelectedMo(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium"
        >
          <option value="ALL">All Modus Operandi (MO)</option>
          <option value="RECRUITMENT">Youth Recruitment / Employment Scam</option>
          <option value="DOMESTIC">Domestic Conflict / Runaway</option>
          <option value="RAILWAY">Railway Junction Interception</option>
        </select>
      </div>

      {/* Grid of Archived Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map(c => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4 text-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={c.photoUrl}
                  alt={c.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 filter grayscale hover:grayscale-0 transition-all"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <span>{c.fullName}</span>
                    <span className="font-mono text-xs text-slate-500">({c.id})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {c.age} yrs • {c.gender} • {c.policeStation}
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>ARCHIVED</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
              <div>
                <strong>FIR Record:</strong> <span className="font-mono">{c.fir.firNumber}</span>
              </div>
              <div>
                <strong>Recovery Location:</strong> {c.recoveryDetails?.recoveryLocation || 'Traced safely'}
              </div>
              <div>
                <strong>Statutory Retention:</strong> {c.recoveryDetails?.statutoryRetentionYears || 25} Years (Mandatory under JJ Act)
              </div>
              {c.recoveryDetails?.approvedByAuthority && (
                <div>
                  <strong>Approved by Authority:</strong> {c.recoveryDetails.approvedByAuthority}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-emerald-700 font-bold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Safely Recovered & Solved</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActivePage('patterns');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors"
                >
                  Cross-Compare Patterns
                </button>
                <button
                  onClick={() => setInspectCaseId(c.id)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                >
                  View Closed Dossier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inspectCaseId && (
        <CaseDetailModal
          caseId={inspectCaseId}
          onClose={() => setInspectCaseId(null)}
        />
      )}
    </div>
  );
};
