import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatternMatch } from '../../types';
import {
  Network,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building
} from 'lucide-react';

export const PatternDiscovery: React.FC = () => {
  const {
    patternMatches,
    updatePatternReview,
    cases,
    setSelectedCaseId,
    setActivePage,
    currentUser
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(patternMatches[0]?.id || '');
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredMatches = patternMatches.filter(m => {
    if (filterType !== 'ALL' && m.patternType !== filterType) return false;
    if (filterStatus !== 'ALL' && m.reviewStatus !== filterStatus) return false;
    return true;
  });

  const selectedMatch = patternMatches.find(m => m.id === selectedMatchId) || patternMatches[0];

  const sourceCase = cases.find(c => c.id === selectedMatch?.sourceCaseId);
  const matchedCase = cases.find(c => c.id === selectedMatch?.matchedCaseId);

  const handleVerify = () => {
    if (!selectedMatch) return;
    updatePatternReview(selectedMatch.id, 'VERIFIED_LINK', reviewNotes);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!selectedMatch) return;
    updatePatternReview(selectedMatch.id, 'REJECTED_FALSE_POSITIVE', reviewNotes);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Network className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Pattern Discovery & Cross-District Matcher
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Explainable case matching comparing shared identifiers, recruitment modus operandi, and transit routes.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All MO Patterns</option>
            <option value="RECRUITMENT_SCAM">Recruitment Scam</option>
            <option value="SHARED_AGENT">Shared Intermediary / Broker</option>
            <option value="TRANSIT_CORRIDOR">Transit Corridor</option>
            <option value="SHARED_PHONE">Shared Phone / Burner</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All Review Statuses</option>
            <option value="PENDING_REVIEW">Pending Officer Review</option>
            <option value="VERIFIED_LINK">Verified Case Link</option>
            <option value="REJECTED_FALSE_POSITIVE">Rejected False Positive</option>
          </select>
        </div>
      </div>

      {/* Prominent Legal Disclaimer Strip */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <strong className="font-bold">Explainable AI Safeguard & Standards Notice:</strong>
          <span className="ml-1 text-amber-800">
            A statistical similarity score represents correlation of synthetic circumstantial factors, NOT legal proof of criminality. All algorithmic links require independent human investigation before judicial action.
          </span>
        </div>
      </div>

      {/* Main Pattern Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Match Candidates List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Identified Case Correlations ({filteredMatches.length})
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[600px]">
            {filteredMatches.map(m => {
              const src = cases.find(c => c.id === m.sourceCaseId);
              const tgt = cases.find(c => c.id === m.matchedCaseId);
              const isSelected = m.id === selectedMatchId;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatchId(m.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.patternType.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                      m.similarityScore >= 90 ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {m.similarityScore}% Similarity
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-800 font-bold mb-1">
                    <span>{src?.fullName || m.sourceCaseId}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
                    <span>{tgt?.fullName || m.matchedCaseId}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {src?.district} ⇄ {tgt?.district}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className={`font-bold ${
                      m.reviewStatus === 'VERIFIED_LINK'
                        ? 'text-emerald-700'
                        : m.reviewStatus === 'REJECTED_FALSE_POSITIVE'
                        ? 'text-red-700'
                        : 'text-amber-700'
                    }`}>
                      ● {m.reviewStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">Inspect Breakdown →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 cols): Explainable Match Breakdown */}
        {selectedMatch && (
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header: Cases Comparison Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Cross-Case Comparative Intelligence
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Case */}
                <div
                  onClick={() => {
                    setSelectedCaseId(sourceCase?.id || '');
                    setActivePage('cases');
                  }}
                  className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-center space-x-3"
                >
                  <img
                    src={sourceCase?.photoUrl}
                    alt={sourceCase?.fullName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{sourceCase?.fullName}</div>
                    <div className="text-[11px] text-slate-500">{sourceCase?.id} • {sourceCase?.age} yrs</div>
                    <div className="text-[10px] text-blue-600 font-semibold">{sourceCase?.policeStation}</div>
                  </div>
                </div>

                {/* Matched Case */}
                <div
                  onClick={() => {
                    setSelectedCaseId(matchedCase?.id || '');
                    setActivePage('cases');
                  }}
                  className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-center space-x-3"
                >
                  <img
                    src={matchedCase?.photoUrl}
                    alt={matchedCase?.fullName}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{matchedCase?.fullName}</div>
                    <div className="text-[11px] text-slate-500">{matchedCase?.id} • {matchedCase?.age} yrs</div>
                    <div className="text-[10px] text-blue-600 font-semibold">{matchedCase?.policeStation}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable Shared Indicators */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5 pb-1 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Shared Circumstantial Indicators (Explainability Breakdown)</span>
              </h3>

              <div className="space-y-2">
                {selectedMatch.sharedIndicators.map((ind, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-950 flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conflicting Info & Missing Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-200 space-y-2">
                <span className="font-bold text-red-900 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Conflicting Information</span>
                </span>
                <ul className="space-y-1 text-red-800 text-[11px]">
                  {selectedMatch.conflictingInformation.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Missing Verification Data</span>
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {selectedMatch.missingDataNotes.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Investigative Next Steps */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 text-xs">
              <span className="font-bold text-blue-900">Recommended Supervisory Actions:</span>
              <ul className="space-y-1 text-blue-800">
                {selectedMatch.recommendedSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="font-bold text-blue-600">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Officer Review & Action Panel */}
            {currentUser.role !== 'FAMILY_MEMBER' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800">
                  Officer Review & Judicial Admissibility Decision:
                </div>

                <textarea
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Record investigative reasoning (e.g., CDR confirmed subscriber overlap, verified with UP STF)..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors"
                  >
                    Reject as False Positive
                  </button>
                  <button
                    onClick={handleVerify}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                  >
                    Authorize as Verified Cross-District Link
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
