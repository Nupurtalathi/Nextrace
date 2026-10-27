import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecoveryRecord, MissingPersonCase } from '../../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Lock,
  Camera,
  UserCheck,
  Clock,
  HelpCircle,
  Plus
} from 'lucide-react';

export const RecoveryClosureWorkflow: React.FC = () => {
  const {
    cases,
    submitRecovery,
    updateRecoveryChecklist,
    closeCaseWithVerification,
    currentUser,
    logAudit
  } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    cases.find(c => c.status === 'RECOVERY_REPORTED' || c.status === 'INVESTIGATING')?.id || cases[0]?.id
  );

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [closureError, setClosureError] = useState<string>('');
  const [closureSuccess, setClosureSuccess] = useState<string>('');

  // Form state for recovery submission
  const [recoveryLocation, setRecoveryLocation] = useState('Mathura Railway Station, Uttar Pradesh');
  const [recoveringStation, setRecoveringStation] = useState('Mathura Kotwali GRP');
  const [recoveryDate, setRecoveryDate] = useState('2026-10-27T10:00');
  const [healthStatus, setHealthStatus] = useState('Physically unharmed, medically evaluated');
  const [handoverDetails, setHandoverDetails] = useState('Child Welfare Committee (CWC) Shelter Home Mathura');
  const [notes, setNotes] = useState('Subject intercepted during joint search operation. Corroborated with family via video conference.');

  const targetCase = cases.find(c => c.id === selectedCaseId);
  const rec = targetCase?.recoveryDetails;

  const handleCreateRecovery = () => {
    if (!targetCase) return;

    const newRecord: RecoveryRecord = {
      caseId: targetCase.id,
      recoveryDate: new Date(recoveryDate).toISOString(),
      recoveryLocation,
      recoveringStation,
      authorizedOfficer: currentUser.name,
      healthStatus,
      shelterOrGuardianHandover: handoverDetails,
      hasMedicalReport: true,
      hasMagistrateStatement: false,
      hasIdentityCardVerification: true,
      hasOfficerInChargeSignoff: false,
      verificationNotes: notes,
      closureStatus: 'AWAITING_APPROVAL',
      statutoryRetentionYears: targetCase.age < 18 ? 25 : 10
    };

    submitRecovery(targetCase.id, newRecord);
    setShowSubmitModal(false);
  };

  const handleToggleChecklist = (field: keyof RecoveryRecord, val: boolean) => {
    if (!targetCase) return;
    updateRecoveryChecklist(targetCase.id, { [field]: val });
  };

  const handleFinalClosure = () => {
    setClosureError('');
    setClosureSuccess('');

    if (!targetCase || !rec) return;

    const success = closeCaseWithVerification(targetCase.id);
    if (!success) {
      setClosureError(
        'Statutory Verification Failure: All 4 mandatory legal closure requirements must be fulfilled before a case can be closed.'
      );
    } else {
      setClosureSuccess(
        `Case ${targetCase.id} successfully closed and sealed into the Historical Repository with ${rec.statutoryRetentionYears}-year statutory retention.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Recovery Verification & Statutory Case Closure
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-point mandatory statutory verification workflow preventing premature or unauthorized closure of missing cases.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <select
            value={selectedCaseId}
            onChange={e => {
              setSelectedCaseId(e.target.value);
              setClosureError('');
              setClosureSuccess('');
            }}
            className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
          >
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.id}) - {c.status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {currentUser.role !== 'FAMILY_MEMBER' && !rec && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Recovery</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Legal Rule Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-950">
        <Lock className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold text-sm">Four-Point Mandatory Closure Criteria:</span>
          <p className="text-emerald-800 mt-1 leading-relaxed">
            A missing person case CANNOT be marked closed without: (1) Official Medical Examination Report, (2) Judicial Magistrate or CWC Statement under Sec 164 CrPC/BNSS, (3) Formal Physical Identity Verification, and (4) Station House Officer / Magistrate Formal Signoff. Photographic evidence is supporting documentation only.
          </p>
        </div>
      </div>

      {closureError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{closureError}</span>
        </div>
      )}

      {closureSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center space-x-2 text-xs text-emerald-900 font-bold">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{closureSuccess}</span>
        </div>
      )}

      {/* Active Case Recovery Card */}
      {targetCase && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <img
                src={targetCase.photoUrl}
                alt={targetCase.fullName}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-slate-900">{targetCase.fullName}</h2>
                  <span className="font-mono text-xs text-slate-500 font-bold">({targetCase.id})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {targetCase.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {targetCase.age} yrs • {targetCase.gender} • {targetCase.policeStation} • FIR: {targetCase.fir.firNumber}
                </div>
              </div>
            </div>

            {rec && (
              <div className="text-right text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Statutory Lock</span>
                <span className="font-bold text-slate-800">
                  {rec.statutoryRetentionYears} Years Retention Mandate
                </span>
              </div>
            )}
          </div>

          {!rec ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-3">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="max-w-md mx-auto">
                No recovery submission logged yet for this case. When the missing individual is located, an investigating officer must initiate the formal recovery documentation.
              </p>
              {currentUser.role !== 'FAMILY_MEMBER' && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs"
                >
                  Initiate Recovery Submission
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recovery Submission Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Recovery Location</span>
                  <div className="font-bold text-slate-800 mt-0.5">{rec.recoveryLocation}</div>
                  <div className="text-[11px] text-slate-500">{rec.recoveringStation}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Health & Medical Status</span>
                  <div className="font-bold text-slate-800 mt-0.5">{rec.healthStatus}</div>
                  <div className="text-[11px] text-slate-500">Handover: {rec.shelterOrGuardianHandover}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Authorized Officer</span>
                  <div className="font-bold text-slate-800 mt-0.5">{rec.authorizedOfficer}</div>
                  <div className="text-[11px] text-slate-500">
                    Logged: {new Date(rec.recoveryDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </div>
              </div>

              {/* 4-Point Verification Checklist */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                  Mandatory Statutory Verification Checklist
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Check 1 */}
                  <div
                    onClick={() => handleToggleChecklist('hasMedicalReport', !rec.hasMedicalReport)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      rec.hasMedicalReport ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">1. Medical Examination & Fitness Report</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Completed by authorized Government District Hospital CMO
                      </div>
                    </div>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      rec.hasMedicalReport ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-slate-400'
                    }`}>
                      {rec.hasMedicalReport ? '✓' : '○'}
                    </span>
                  </div>

                  {/* Check 2 */}
                  <div
                    onClick={() => handleToggleChecklist('hasMagistrateStatement', !rec.hasMagistrateStatement)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      rec.hasMagistrateStatement ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">2. Judicial Statement u/s 164 BNSS / CWC Order</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Recorded before Judicial Magistrate or Child Welfare Committee
                      </div>
                    </div>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      rec.hasMagistrateStatement ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-slate-400'
                    }`}>
                      {rec.hasMagistrateStatement ? '✓' : '○'}
                    </span>
                  </div>

                  {/* Check 3 */}
                  <div
                    onClick={() => handleToggleChecklist('hasIdentityCardVerification', !rec.hasIdentityCardVerification)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      rec.hasIdentityCardVerification ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">3. Physical Identity Verification Document</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Biometric / Aadhaar / Parent sworn affidavit corroborated
                      </div>
                    </div>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      rec.hasIdentityCardVerification ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-slate-400'
                    }`}>
                      {rec.hasIdentityCardVerification ? '✓' : '○'}
                    </span>
                  </div>

                  {/* Check 4 */}
                  <div
                    onClick={() => handleToggleChecklist('hasOfficerInChargeSignoff', !rec.hasOfficerInChargeSignoff)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      rec.hasOfficerInChargeSignoff ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">4. Station House Officer & Magistrate Final Signoff</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Formal investigation closure summary reviewed & authorized
                      </div>
                    </div>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      rec.hasOfficerInChargeSignoff ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-slate-400'
                    }`}>
                      {rec.hasOfficerInChargeSignoff ? '✓' : '○'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Action Bar */}
              {targetCase.status !== 'CLOSED' && currentUser.role !== 'FAMILY_MEMBER' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Ready to execute formal closure?</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Case records remain fully preserved and indexed in the Historical Repository for continuous AI pattern matching.
                    </p>
                  </div>

                  <button
                    onClick={handleFinalClosure}
                    className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap"
                  >
                    Execute Statutory Case Closure
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recovery Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Record Recovery Documentation</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recovery Location *</label>
                <input
                  type="text"
                  value={recoveryLocation}
                  onChange={e => setRecoveryLocation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recovering Station</label>
                  <input
                    type="text"
                    value={recoveringStation}
                    onChange={e => setRecoveringStation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recovery Date & Time</label>
                  <input
                    type="datetime-local"
                    value={recoveryDate}
                    onChange={e => setRecoveryDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Health & Fitness Condition</label>
                <input
                  type="text"
                  value={healthStatus}
                  onChange={e => setHealthStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shelter / Legal Guardian Handover Details</label>
                <input
                  type="text"
                  value={handoverDetails}
                  onChange={e => setHandoverDetails(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRecovery}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
              >
                Save Recovery Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
