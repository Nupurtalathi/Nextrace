import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrafficCameraRequest, PriorityLevel } from '../../types';
import {
  Camera,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  Download,
  Filter,
  Eye,
  Sliders,
  Shield
} from 'lucide-react';

export const TrafficCameraRequests: React.FC = () => {
  const {
    trafficRequests,
    addTrafficRequest,
    updateTrafficRequestStatus,
    cases,
    currentUser
  } = useApp();

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || 'MP-2026-0842');
  const [locationName, setLocationName] = useState('NH-24 Ghazipur Border Toll Plaza');
  const [incidentDate, setIncidentDate] = useState('2026-10-21');
  const [timeWindowStart, setTimeWindowStart] = useState('09:15 AM');
  const [timeWindowEnd, setTimeWindowEnd] = useState('10:15 AM');
  const [cameraRegion, setCameraRegion] = useState('NHAI Eastern Highway Surveillance');
  const [reason, setReason] = useState('Urgent tracking of vehicle DL-8C-AK-4412 suspected in transit abduction of minor.');
  const [urgency, setUrgency] = useState<PriorityLevel>('CRITICAL');

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredRequests = trafficRequests.filter(r => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: TrafficCameraRequest['status']) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Draft</span>;
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Under Review</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">Rejected</span>;
      case 'FOOTAGE_RECEIVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Footage Received</span>;
      case 'ANALYSIS_COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Analysis Done</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">Closed</span>;
    }
  };

  const handleSubmitNew = () => {
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    const newReq: TrafficCameraRequest = {
      id: `TCR-2026-00${Math.floor(50 + Math.random() * 50)}`,
      caseId: selectedCaseId,
      caseName: selectedCase ? `${selectedCase.fullName} (${selectedCase.age}${selectedCase.gender[0]})` : selectedCaseId,
      incidentDate,
      locationName,
      latLng: [28.6256, 77.3312],
      timeWindowStart,
      timeWindowEnd,
      reasonForAccess: reason,
      cameraRegion,
      requestingOfficer: currentUser.name,
      requestingStation: currentUser.stationOrDept,
      urgency,
      status: 'SUBMITTED',
      submittedDate: new Date().toISOString()
    };

    addTrafficRequest(newReq);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Camera className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Traffic Camera & RTO Surveillance Access Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Official inter-agency warrant request workflow for city junctions, toll plazas, and highway surveillance cameras.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Request States</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="FOOTAGE_RECEIVED">Footage Received</option>
          </select>

          {currentUser.role !== 'FAMILY_MEMBER' && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Camera Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Request ID & Case</th>
                <th className="px-4 py-3">Camera Location & Region</th>
                <th className="px-4 py-3">Time Window</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Footage Extract</th>
                <th className="px-4 py-3 text-right">RTO / Traffic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRequests.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-bold text-xs text-slate-900">{r.id}</div>
                    <div className="text-[11px] text-blue-600 font-semibold">{r.caseName}</div>
                    <div className="text-[10px] text-slate-400">Req by: {r.requestingOfficer}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-800 text-xs">{r.locationName}</div>
                    <div className="text-[11px] text-slate-500">{r.cameraRegion}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                      "{r.reasonForAccess}"
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="text-slate-800 font-semibold">{r.incidentDate}</div>
                    <div className="text-[11px] text-slate-500">{r.timeWindowStart} - {r.timeWindowEnd}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.urgency}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(r.status)}
                  </td>

                  <td className="px-4 py-3.5">
                    {r.footageExtractName ? (
                      <div className="flex items-center space-x-1.5 text-blue-600 font-mono text-[11px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[140px]">{r.footageExtractName}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No extract yet</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {currentUser.role !== 'FAMILY_MEMBER' && (
                      <div className="flex items-center justify-end space-x-1.5">
                        {r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW' ? (
                          <>
                            <button
                              onClick={() => updateTrafficRequestStatus(r.id, 'APPROVED', 'Warrant approved under emergency child rescue mandate.')}
                              className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateTrafficRequestStatus(r.id, 'REJECTED', 'No camera coverage on requested lane.')}
                              className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : r.status === 'APPROVED' ? (
                          <button
                            onClick={() => updateTrafficRequestStatus(r.id, 'FOOTAGE_RECEIVED', 'Footage excerpt downloaded and SHA-256 hashed.')}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                          >
                            Upload Extract
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Submit Authorized Traffic Camera Request</span>
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Associated Case ID *</label>
                <select
                  value={selectedCaseId}
                  onChange={e => setSelectedCaseId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) - {c.policeStation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Location / Junction / Toll Plaza *</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incident Date *</label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={e => setIncidentDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Surveillance Region</label>
                  <input
                    type="text"
                    value={cameraRegion}
                    onChange={e => setCameraRegion(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Window Start</label>
                  <input
                    type="text"
                    value={timeWindowStart}
                    onChange={e => setTimeWindowStart(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Window End</label>
                  <input
                    type="text"
                    value={timeWindowEnd}
                    onChange={e => setTimeWindowEnd(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Justification / Lawful Grounds *</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNew}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
              >
                Submit Request to RTO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
