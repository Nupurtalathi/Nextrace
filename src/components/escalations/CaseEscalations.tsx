import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EscalationRecord } from '../../types';
import {
  ArrowUpRight,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Network,
  Users,
  ChevronRight,
  FileText
} from 'lucide-react';

export const CaseEscalations: React.FC = () => {
  const {
    escalations,
    updateEscalationStatus,
    cases,
    setSelectedCaseId,
    setActivePage,
    currentUser
  } = useApp();

  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const isSupervisor = ['DISTRICT_ADMIN', 'STATE_ADMIN', 'GOV_ADMIN'].includes(currentUser.role);

  const getLevelBadge = (level: EscalationRecord['targetLevel']) => {
    switch (level) {
      case 'DISTRICT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">DISTRICT HQ</span>;
      case 'STATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">STATE CID / AHTU</span>;
      case 'CENTRAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">NATIONAL COORDINATION CELL</span>;
      default:
        return null;
    }
  };

  const handleDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    const notes = decisionNotes[id] || `Action authorized by ${currentUser.name}`;
    updateEscalationStatus(id, status, notes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-red-100 text-red-700">
              <ArrowUpRight className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Hierarchical Case Escalation & Jurisdiction Transfer Queue
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory escalation workflow: Local Station → District HQ → State CID/AHTU → National Authority.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Building className="w-4 h-4 text-blue-600" />
          <span>Active Authority: <strong>{currentUser.designation}</strong></span>
        </div>
      </div>

      {/* Escalation Queue Cards */}
      <div className="space-y-4">
        {escalations.map(esc => {
          const isPending = esc.status === 'PENDING';
          const targetCase = cases.find(c => c.id === esc.caseId);

          return (
            <div
              key={esc.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isPending ? 'border-amber-200 hover:border-amber-300' : 'border-slate-200'
              }`}
            >
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {esc.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                      <span>{esc.caseTitle}</span>
                      <span className="text-slate-400 font-mono text-xs">({esc.caseId})</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{esc.currentLevel}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>{getLevelBadge(esc.targetLevel)}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    esc.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : esc.status === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {esc.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5 text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Escalation Trigger Factors & Complexity Indicators:</span>
                  </span>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                    {esc.triggerReason}
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Requested By</span>
                    <div className="font-bold text-slate-800">{esc.requestedBy}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Reviewing Authority</span>
                    <div className="font-semibold text-blue-700">{esc.assignedAuthority}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Review Deadline</span>
                    <div className="font-mono text-red-600 font-bold">
                      ⏱ {new Date(esc.reviewDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inter-District Coordination Stations */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Network className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-slate-700">Joint Investigation Coordination Team:</span>
                  <span className="text-slate-600">{esc.coordinationStations.join(' • ')}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCaseId(esc.caseId);
                    setActivePage('cases');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                >
                  Inspect Case Dossier →
                </button>
              </div>

              {/* Decision Section */}
              {isPending && isSupervisor && (
                <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                  <input
                    type="text"
                    value={decisionNotes[esc.id] || ''}
                    onChange={e => setDecisionNotes({ ...decisionNotes, [esc.id]: e.target.value })}
                    placeholder="Enter supervisory instructions / joint team constitution terms..."
                    className="flex-1 w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleDecision(esc.id, 'REJECTED')}
                      className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors"
                    >
                      Reject Escalation
                    </button>
                    <button
                      onClick={() => handleDecision(esc.id, 'APPROVED')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                    >
                      Authorize Escalation to {esc.targetLevel}
                    </button>
                  </div>
                </div>
              )}

              {/* Decision Notes Display */}
              {esc.decisionNotes && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                  <strong>Authority Decision Note:</strong> "{esc.decisionNotes}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
