import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Shield,
  FileText,
  Clock,
  MapPin,
  AlertTriangle,
  BrainCircuit,
  Share2,
  Camera,
  CheckCircle,
  Hash,
  Download,
  Calendar,
  Phone,
  User,
  Info
} from 'lucide-react';

interface CaseDetailModalProps {
  caseId: string;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseId, onClose }) => {
  const { cases, setActivePage, setSelectedCaseId, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'fir' | 'circumstances' | 'evidence' | 'statements' | 'ai'>('profile');

  const c = cases.find(item => item.id === caseId);

  if (!c) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={c.photoUrl}
              alt={c.fullName}
              className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-tight">{c.fullName}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {c.id}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  c.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {c.priority}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {c.age} yrs • {c.gender} • {c.policeStation} • {c.district}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentUser.role !== 'FAMILY_MEMBER' && (
              <>
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActivePage('scenario-builder');
                    onClose();
                  }}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>AI Scenario Builder</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActivePage('connections-graph');
                    onClose();
                  }}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Graph</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center space-x-1 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'profile', label: 'Physical Profile' },
            { id: 'fir', label: 'FIR Source Document' },
            { id: 'circumstances', label: 'Disappearance Circumstances' },
            { id: 'evidence', label: `Evidence Vault (${c.evidenceList.length})` },
            { id: 'statements', label: `Statements (${c.familyStatements.length})` },
            { id: 'ai', label: 'AI Risk & Corridors' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-xs space-y-6">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={c.photoUrl}
                    alt={c.fullName}
                    className="w-44 h-44 rounded-xl object-cover border border-slate-300 shadow-sm mb-3"
                  />
                  <div className="text-center">
                    <span className="font-bold text-slate-900 text-sm">{c.fullName}</span>
                    <div className="text-[11px] text-slate-500">Subject Photograph (Verified)</div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 pb-1 border-b border-slate-200">
                    Identifying Physical Characteristics
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Height</span>
                      <div className="font-semibold text-slate-800">{c.identifyingFeatures.heightCm} cm</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Complexion & Build</span>
                      <div className="font-semibold text-slate-800">{c.identifyingFeatures.complexion} • {c.identifyingFeatures.build}</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Hair & Eyes</span>
                      <div className="font-semibold text-slate-800">{c.identifyingFeatures.hairColor} • {c.identifyingFeatures.eyeColor}</div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Languages Spoken</span>
                      <div className="font-semibold text-slate-800">{c.identifyingFeatures.languagesSpoken.join(', ')}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Distinguishing Body Marks / Scars
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.identifyingFeatures.distinguishingMarks.map((m, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                          ⚡ {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      Clothing Last Seen Wearing
                    </span>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700">
                      {c.identifyingFeatures.clothingLastSeen}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIR Document */}
          {activeTab === 'fir' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-700 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Immutable Primary Police FIR Record</div>
                    <div className="text-[11px] text-blue-700">
                      Original source document cannot be overwritten. Supplementary claims are versioned separately.
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-700 text-white">
                  LOCKED
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">FIR Number</span>
                  <div className="font-bold text-slate-900">{c.fir.firNumber}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Police Station</span>
                  <div className="font-bold text-slate-900">{c.fir.policeStation}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Reporting Officer</span>
                  <div className="font-bold text-slate-900">{c.fir.reportingOfficer} ({c.fir.officerBadge})</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Reporting Timestamp</span>
                  <div className="font-bold text-slate-900">{new Date(c.fir.reportingDate).toLocaleString()}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs">Initial FIR Account (As Lodged):</div>
                <p className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                  "{c.fir.initialAccountSummary}"
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="font-mono text-slate-700">{c.fir.originalFIRDocumentName}</span>
                </div>
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-bold text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Circumstances */}
          {activeTab === 'circumstances' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Pre-Disappearance Events</div>
                  <p className="text-slate-600">{c.circumstances.eventsBeforeDisappearance}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Last Known Activities & Movement</div>
                  <p className="text-slate-600">{c.circumstances.lastKnownActivities}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">Last Known Communications</div>
                  <p className="text-slate-600">{c.circumstances.lastKnownCommunications}</p>
                </div>

                {c.circumstances.employmentOrRecruitmentOffers && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="font-bold text-amber-900 mb-1">Employment / Recruitment Offer Details</div>
                    <p className="text-amber-800">{c.circumstances.employmentOrRecruitmentOffers}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Evidence Vault */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Tamper-evident evidentiary items verified under official chain of custody</span>
                <span className="font-mono text-[10px] text-slate-400">SHA-256 Verified</span>
              </div>

              {c.evidenceList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No evidence files currently attached to this case record.
                </div>
              ) : (
                c.evidenceList.map(ev => (
                  <div key={ev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          {ev.type}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{ev.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ev.verificationStatus}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs">{ev.description}</p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <div>
                        Source: <strong className="text-slate-700">{ev.source}</strong> • Uploader: {ev.uploaderName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        Hash: {ev.fileIntegrityHash.slice(0, 16)}...
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: Family & Witness Statements */}
          {activeTab === 'statements' && (
            <div className="space-y-3">
              {c.familyStatements.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No supplementary family statements recorded yet.
                </div>
              ) : (
                c.familyStatements.map(st => (
                  <div key={st.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {st.sourcePerson} ({st.relationship})
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Recorded on {new Date(st.recordedDate).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                      "{st.statementText}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div>Recorded by: <strong>{st.recordingOfficer}</strong></div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                        {st.verificationStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: AI Risk & Corridors */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-900 text-sm">AI Trafficking Risk Assessment</span>
                  </div>
                  <span className="text-sm font-black px-2.5 py-1 rounded bg-red-600 text-white font-mono">
                    Risk Score: {c.aiRiskScore}/100
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-red-900 uppercase tracking-wider">
                    Identified Vulnerability & Syndication Factors:
                  </div>
                  <ul className="space-y-1 text-xs text-red-800">
                    {c.aiRiskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {c.transitCorridorFlag && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-purple-900">
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-purple-700" />
                    <span>Identified Inter-District Transit Corridor</span>
                  </div>
                  <p className="text-xs text-purple-800">
                    {c.transitCorridorFlag} — Highway FASTag and mobile tower handoffs flag recurring transit patterns.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 font-mono">
            NEXUS Dossier #{c.id} • Assigned to {c.assignedOfficer}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
