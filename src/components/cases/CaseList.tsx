import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MissingPersonCase, CaseStatus, PriorityLevel } from '../../types';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  BrainCircuit,
  Share2,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle,
  XCircle,
  Trash2,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { CaseDetailModal } from './CaseDetailModal';

export const CaseList: React.FC = () => {
  const {
    cases,
    selectedDistrict,
    setSelectedDistrict,
    setActivePage,
    selectedCaseId,
    setSelectedCaseId,
    currentUser,
    submitDeletionRequest
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'name'>('risk');

  const [dossierCaseId, setDossierCaseId] = useState<string | null>(null);
  const [showDeletionModal, setShowDeletionModal] = useState<MissingPersonCase | null>(null);
  const [deletionReason, setDeletionReason] = useState('');

  // Filter logic
  const filteredCases = cases.filter(c => {
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
    if (selectedDistrict !== 'ALL' && c.district !== selectedDistrict) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (ageGroupFilter === 'MINOR' && c.age >= 18) return false;
    if (ageGroupFilter === 'ADULT' && c.age < 18) return false;
    return true;
  });

  // Sort logic
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === 'risk') return b.aiRiskScore - a.aiRiskScore;
    if (sortBy === 'date') return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
    if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
    return 0;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">Investigating</span>;
      case 'NEW_REGISTERED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-700">New Registered</span>;
      case 'AWAITING_VERIFICATION':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">Verification Pending</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">Escalated</span>;
      case 'RECOVERY_REPORTED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">Recovery Reported</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700">Closed (Archived)</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500 text-white">LOW</span>;
    }
  };

  const handleOpenDossier = (caseId: string) => {
    setSelectedCaseId(caseId);
    setDossierCaseId(caseId);
  };

  const handleLaunchScenario = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActivePage('scenario-builder');
  };

  const handleLaunchGraph = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActivePage('connections-graph');
  };

  const handleRequestDeletion = (c: MissingPersonCase) => {
    setShowDeletionModal(c);
    setDeletionReason('');
  };

  const submitDeletion = () => {
    if (!showDeletionModal || !deletionReason.trim()) return;
    submitDeletionRequest(showDeletionModal.id, deletionReason.trim());
    setShowDeletionModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Missing Persons Case Dossiers & Register
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {sortedCases.length} of {cases.length} records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified case records, FIR documents, forensic evidence, and AI-scored risk profiles.
          </p>
        </div>

        {currentUser.role !== 'FAMILY_MEMBER' && (
          <button
            onClick={() => setActivePage('register-case')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Case</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by name, ID, FIR, station..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="NEW_REGISTERED">New Registered</option>
          <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RECOVERY_REPORTED">Recovery Reported</option>
          <option value="CLOSED">Closed (Archived)</option>
        </select>

        {/* Priority */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
        >
          <option value="ALL">All Categories</option>
          <option value="Minor">Minor (&lt;18)</option>
          <option value="Trafficking Suspected">Trafficking Suspected</option>
          <option value="Vulnerable Adult">Vulnerable Adult</option>
          <option value="Runaway">Runaway</option>
        </select>

        {/* Age Group */}
        <select
          value={ageGroupFilter}
          onChange={e => setAgeGroupFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
        >
          <option value="ALL">All Ages</option>
          <option value="MINOR">Minors Only (&lt;18 yrs)</option>
          <option value="ADULT">Adults (18+ yrs)</option>
        </select>

        {/* Sort */}
        <div className="flex items-center space-x-1 text-slate-500">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-medium"
          >
            <option value="risk">Sort by AI Risk Score</option>
            <option value="date">Sort by Date Registered</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Case Table / Cards View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Missing Person</th>
                <th className="px-4 py-3">Case ID & FIR</th>
                <th className="px-4 py-3">Jurisdiction & Station</th>
                <th className="px-4 py-3">Incident Timeline</th>
                <th className="px-4 py-3">AI Risk Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedCases.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDossier(c.id)}
                >
                  {/* Photo & Profile */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.photoUrl}
                        alt={c.fullName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                          <span>{c.fullName}</span>
                          {c.age < 18 && (
                            <span className="px-1.5 py-0.2 rounded bg-pink-100 text-pink-700 text-[10px] font-bold">
                              Minor
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {c.age} yrs • {c.gender} • {c.identifyingFeatures.complexion}
                        </div>
                        <div className="text-[10px] text-blue-600 font-medium">
                          {c.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Case ID & FIR */}
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-xs text-slate-800">{c.id}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">{c.fir.firNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      IO: {c.assignedOfficer}
                    </div>
                  </td>

                  {/* Jurisdiction & Station */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-xs text-slate-800">{c.policeStation}</div>
                    <div className="text-[11px] text-slate-500">{c.district}, {c.state}</div>
                    {c.crossDistrictAlert && (
                      <div className="inline-flex items-center space-x-1 mt-1 text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-semibold border border-purple-200">
                        <span>Inter-District Alert</span>
                      </div>
                    )}
                  </td>

                  {/* Incident Timeline */}
                  <td className="px-4 py-3.5">
                    <div className="text-[11px] text-slate-800 font-semibold">
                      Missing: {new Date(c.fir.dateTimeLastSeen).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      📍 {c.fir.lastSeenLocation}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Registered: {new Date(c.registeredDate).toLocaleDateString()}
                    </div>
                  </td>

                  {/* AI Risk Score */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.aiRiskScore > 75 ? 'bg-red-600' : c.aiRiskScore > 50 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${c.aiRiskScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-extrabold font-mono ${
                        c.aiRiskScore > 75 ? 'text-red-600' : c.aiRiskScore > 50 ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {c.aiRiskScore}%
                      </span>
                    </div>
                    <div className="mt-1">{getPriorityBadge(c.priority)}</div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>

                  {/* Actions */}
                  <td
                    className="px-4 py-3.5 text-right whitespace-nowrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => handleOpenDossier(c.id)}
                        className="p-1.5 rounded-md hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        title="View Case Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {currentUser.role !== 'FAMILY_MEMBER' && (
                        <>
                          <button
                            onClick={() => handleLaunchScenario(c.id)}
                            className="p-1.5 rounded-md hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 transition-colors"
                            title="Open AI Scenario Builder"
                          >
                            <BrainCircuit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleLaunchGraph(c.id)}
                            className="p-1.5 rounded-md hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors"
                            title="View Suspect & Entity Graph"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleRequestDeletion(c)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Request Archival / Data Removal (Subject to Approvals)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Modal / Drawer */}
      {dossierCaseId && (
        <CaseDetailModal
          caseId={dossierCaseId}
          onClose={() => setDossierCaseId(null)}
        />
      )}

      {/* Deletion Request Modal (with statutory protections) */}
      {showDeletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base text-slate-900">
                Submit Record Removal / Archival Request
              </h3>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 leading-relaxed">
              <strong>Statutory Protection Warning:</strong> Missing persons cases involving minors or active criminal FIRs cannot be deleted directly by investigating officers. All removal requests require formal statutory review and approval by the Government Department Administrator.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Case: {showDeletionModal.fullName} ({showDeletionModal.id})
              </label>
              <textarea
                value={deletionReason}
                onChange={e => setDeletionReason(e.target.value)}
                rows={3}
                placeholder="State lawful justification (e.g., erroneous registration duplicate, judicial quashing order #, statutory expungement)..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 text-xs">
              <button
                onClick={() => setShowDeletionModal(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitDeletion}
                disabled={!deletionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50 transition-colors shadow-xs"
              >
                Submit for Statutory Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
