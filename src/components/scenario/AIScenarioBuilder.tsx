import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimStatus, ScenarioVersion } from '../../types';
import {
  BrainCircuit,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  History,
  Sparkles,
  HelpCircle,
  XCircle,
  GitBranch,
  Save,
  Plus,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const AIScenarioBuilder: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    addScenarioVersion,
    updateClaimStatus,
    currentUser
  } = useApp();

  const c = cases.find(item => item.id === selectedCaseId) || cases[0];

  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(
    c.scenarioVersions && c.scenarioVersions.length > 0 ? c.scenarioVersions.length - 1 : 0
  );

  const [newClaimText, setNewClaimText] = useState('');
  const [newClaimCitation, setNewClaimCitation] = useState('');
  const [newClaimStatus, setNewClaimStatus] = useState<ClaimStatus>('REPORTED_UNVERIFIED');
  const [isSimulatingNLP, setIsSimulatingNLP] = useState(false);
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  const currentVersion = c.scenarioVersions && c.scenarioVersions[activeVersionIndex];

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">VERIFIED</span>;
      case 'REPORTED_UNVERIFIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">REPORTED (UNVERIFIED)</span>;
      case 'DISPUTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">DISPUTED</span>;
      case 'CONTRADICTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">CONTRADICTED</span>;
      case 'UNKNOWN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">UNKNOWN</span>;
    }
  };

  const handleSimulateNLP = () => {
    setIsSimulatingNLP(true);
    setTimeout(() => {
      setIsSimulatingNLP(false);
      setSimulatedAlert(
        `AI Simulated Extraction identified 2 temporal anomalies: (1) 28-minute gap between Anand Vihar Metro exit (09:08 AM) and van toll passing (09:41 AM), (2) Burner mobile IMEI 861942058192019 matched with UP Kotwali FIR 719/2026.`
      );
    }, 900);
  };

  const handleAddClaim = () => {
    if (!newClaimText.trim() || !newClaimCitation.trim()) return;

    const nextVerNum = (c.scenarioVersions?.length || 0) + 1;
    const existingClaims = currentVersion?.claims || [];

    const newVersion: ScenarioVersion = {
      versionNumber: nextVerNum,
      modifiedAt: new Date().toISOString(),
      modifiedBy: currentUser.name,
      officerRole: currentUser.role,
      summary: `Updated scenario with newly evaluated claim: "${newClaimText.slice(0, 40)}..."`,
      changeReason: `Investigative officer review & forensic update.`,
      claims: [
        ...existingClaims,
        {
          id: `CLM-0${existingClaims.length + 1}`,
          text: newClaimText.trim(),
          sourceCitation: newClaimCitation.trim(),
          status: newClaimStatus,
          verifiedBy: newClaimStatus === 'VERIFIED' ? currentUser.name : undefined
        }
      ]
    };

    addScenarioVersion(c.id, newVersion);
    setActiveVersionIndex(nextVerNum - 1);
    setNewClaimText('');
    setNewClaimCitation('');
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI Scenario Builder & Forensic Reconstruction
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Extracts entities, evaluates chronological sequences, and maintains strict versioned audit trails.
              </p>
            </div>
          </div>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Active Dossier:</span>
          <select
            value={c.id}
            onChange={e => {
              setSelectedCaseId(e.target.value);
              setActiveVersionIndex(0);
            }}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {cases.map(item => (
              <option key={item.id} value={item.id}>
                {item.fullName} ({item.id}) - {item.policeStation}
              </option>
            ))}
          </select>

          <button
            onClick={handleSimulateNLP}
            disabled={isSimulatingNLP}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSimulatingNLP ? 'Extracting...' : 'Run Simulated NLP'}</span>
          </button>
        </div>
      </div>

      {/* Simulated AI NLP Notice Banner */}
      {simulatedAlert && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <strong className="font-bold">Simulated NLP & Knowledge Graph Analysis:</strong>
              <p className="mt-0.5 leading-relaxed">{simulatedAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setSimulatedAlert(null)}
            className="text-indigo-400 hover:text-indigo-700 text-xs font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Immutable FIR & Initial Report */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <h2 className="text-sm font-bold text-slate-900">
                Primary FIR Ingestion (Immutable Benchmark)
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800">
              LOCKED & SIGNED
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">{c.fir.firNumber}</span>
              <span className="text-[10px] text-slate-400">
                Lodged {new Date(c.fir.reportingDate).toLocaleDateString()}
              </span>
            </div>
            <div className="text-slate-600">
              Station: <strong className="text-slate-800">{c.fir.policeStation}</strong> • Officer: {c.fir.reportingOfficer}
            </div>
            <div className="text-slate-600">
              Last Seen: <strong className="text-slate-800">{c.fir.lastSeenLocation}</strong> at {new Date(c.fir.dateTimeLastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className="space-y-2 text-xs flex-1">
            <span className="font-bold text-slate-700">Initial Account Summary:</span>
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-700 leading-relaxed italic">
              "{c.fir.initialAccountSummary}"
            </div>
          </div>

          {/* Extracted NLP Entities */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Extracted Forensic Entities & Attributes:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                Person: {c.fullName}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                Age: {c.age} (Minor)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                Loc: {c.fir.lastSeenLocation}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                Vehicle Plate: DL-8C-AK-4412
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                Suspect Alias: "Tiger"
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Working Scenario & Claim Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Working Scenario (Version {currentVersion?.versionNumber || 1})
              </h2>
            </div>

            {/* Version Switcher */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-slate-400">Ver:</span>
              {(c.scenarioVersions || []).map((ver, idx) => (
                <button
                  key={ver.versionNumber}
                  onClick={() => setActiveVersionIndex(idx)}
                  className={`w-6 h-6 rounded-md font-bold text-xs transition-colors ${
                    activeVersionIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ver.versionNumber}
                </button>
              ))}
            </div>
          </div>

          {currentVersion && (
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>{currentVersion.summary}</span>
                <span className="text-[10px] text-indigo-500 font-mono">
                  {new Date(currentVersion.modifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Authorized by: {currentVersion.modifiedBy} ({currentVersion.officerRole}) • Reason: {currentVersion.changeReason}
              </div>
            </div>
          )}

          {/* List of Claims */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] text-xs">
            {(!currentVersion || currentVersion.claims.length === 0) ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                No working claims formulated yet.
              </div>
            ) : (
              currentVersion.claims.map(claim => (
                <div
                  key={claim.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-200 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-900 leading-relaxed">
                      {claim.text}
                    </span>
                    <div className="shrink-0">{getStatusBadge(claim.status)}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                    <span className="font-semibold text-slate-600">
                      Citation: <span className="italic">{claim.sourceCitation}</span>
                    </span>

                    {/* Officer Claim Verification Actions */}
                    {currentUser.role !== 'FAMILY_MEMBER' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateClaimStatus(c.id, activeVersionIndex, claim.id, 'VERIFIED')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            claim.status === 'VERIFIED'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 hover:bg-emerald-100 text-slate-700'
                          }`}
                          title="Mark as Verified by Investigation"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => updateClaimStatus(c.id, activeVersionIndex, claim.id, 'DISPUTED')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            claim.status === 'DISPUTED'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-200 hover:bg-red-100 text-slate-700'
                          }`}
                          title="Mark as Disputed / Contradicted"
                        >
                          Dispute
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add New Claim Form */}
          {currentUser.role !== 'FAMILY_MEMBER' && (
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Append Evaluated Working Claim & Commit New Version:</span>
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  value={newClaimText}
                  onChange={e => setNewClaimText(e.target.value)}
                  placeholder="e.g., FASTag log proves vehicle exited Ghazipur toll into UP at 09:41 AM"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newClaimCitation}
                    onChange={e => setNewClaimCitation(e.target.value)}
                    placeholder="Source citation (e.g., NHAI Toll Log #91823)"
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <select
                    value={newClaimStatus}
                    onChange={e => setNewClaimStatus(e.target.value as any)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  >
                    <option value="VERIFIED">Verified</option>
                    <option value="REPORTED_UNVERIFIED">Reported but Unverified</option>
                    <option value="DISPUTED">Disputed</option>
                    <option value="CONTRADICTED">Contradicted</option>
                  </select>
                </div>

                <button
                  onClick={handleAddClaim}
                  disabled={!newClaimText.trim() || !newClaimCitation.trim()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-xs disabled:opacity-40"
                >
                  Commit Scenario Version { (c.scenarioVersions?.length || 0) + 1 }
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
