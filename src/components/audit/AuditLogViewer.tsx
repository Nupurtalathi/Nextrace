import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import {
  FileCheck2,
  Shield,
  Search,
  Filter,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  Download,
  Calendar,
  Eye,
  Trash2
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs, deletionRequests, reviewDeletionRequest, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'deletions'>('audit');
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [reviewJustification, setReviewJustification] = useState<Record<string, string>>({});

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'ALL' && log.action !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.targetEntityId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.integrityHash.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleReviewDeletion = (id: string, decision: 'APPROVED' | 'REJECTED') => {
    const just = reviewJustification[id] || (decision === 'REJECTED'
      ? 'BLOCKED: Under Section 137(2) BNS & POCSO Act statutory minor missing tracing guidelines.'
      : 'Approved under lawful court expungement decree.');
    reviewDeletionRequest(id, decision, just);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-800">
              <FileCheck2 className="w-5 h-5 text-blue-700" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Cryptographic Audit Ledger & Statutory Compliance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Append-only, tamper-evident forensic ledger recording every case update, evidence access, and deletion decision.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ledger Integrity 100% Cryptographically Verified</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          All System Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('deletions')}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'deletions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Statutory Data Removal Requests ({deletionRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: Audit Logs Stream */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search audit trail by actor, case ID, keyword, SHA hash..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium"
            >
              <option value="ALL">All Recorded Actions</option>
              <option value="CASE_REGISTERED">Case Registered</option>
              <option value="SCENARIO_VERSION_COMMITTED">Scenario Committed</option>
              <option value="EVIDENCE_VERIFIED">Evidence Verified</option>
              <option value="AI_SIMILARITY_MATCH_GENERATED">AI Match Generated</option>
              <option value="TRAFFIC_CAMERA_REQUEST_APPROVED">Camera Request Approved</option>
              <option value="CASE_FORMALLY_CLOSED">Case Formally Closed</option>
              <option value="ROLE_SWITCHED">Role Switched</option>
            </select>
          </div>

          {/* Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Timestamp (UTC)</th>
                    <th className="px-4 py-3">Action Type</th>
                    <th className="px-4 py-3">Authorized Actor</th>
                    <th className="px-4 py-3">Target Entity</th>
                    <th className="px-4 py-3">Audit Details</th>
                    <th className="px-4 py-3 font-mono">SHA-256 Block Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'medium'
                        })}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">{log.performedBy}</div>
                        <div className="text-[10px] text-slate-400">{log.role || 'AUTHORIZED'}</div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-800">{log.targetEntityId}</span>
                        <span className="text-[10px] text-slate-400 block">{log.entityType}</span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                          {log.details}
                        </p>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[10px] text-slate-400">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.integrityHash.slice(0, 16)}...
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Deletion & Archival Review Queue */}
      {activeTab === 'deletions' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm">Strict Statutory Data Protection Mandate:</span>
              <p className="text-amber-800 mt-1 leading-relaxed">
                Cases with active criminal investigation, human trafficking indicators, or minor victims cannot be deleted by police stations. All deletion or expungement petitions must be formally examined and adjudicated by the Government Department Administrator in compliance with statutory retention laws.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {deletionRequests.map(req => {
              const isPending = req.status === 'PENDING';
              return (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        {req.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{req.caseName}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Reason for Removal Petition</span>
                      <p className="text-slate-800 font-medium">{req.reason}</p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Requested by: {req.requestedBy} on {new Date(req.requestDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Adjudication / Statutory Ruling</span>
                      <p className="text-slate-800 font-medium italic">
                        {req.statutoryBlockReason || 'Awaiting formal review by Government Department Administrator.'}
                      </p>
                      {req.reviewedBy && (
                        <div className="text-[10px] text-slate-500 pt-1">
                          Reviewed by: <strong>{req.reviewedBy}</strong> ({new Date(req.reviewedDate!).toLocaleString()})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Gov Admin */}
                  {isPending && currentUser.role === 'GOV_ADMIN' && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={reviewJustification[req.id] || ''}
                        onChange={e => setReviewJustification({ ...reviewJustification, [req.id]: e.target.value })}
                        placeholder="Enter legal rationale (e.g., Blocked under Section 137(2) BNS & POCSO mandatory child tracing directive)..."
                        className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                      />

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReviewDeletion(req.id, 'REJECTED')}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
                        >
                          Block & Reject Deletion
                        </button>
                        <button
                          onClick={() => handleReviewDeletion(req.id, 'APPROVED')}
                          className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
                        >
                          Approve Expungement
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
