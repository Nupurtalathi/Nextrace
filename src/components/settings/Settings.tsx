import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Shield,
  Sliders,
  RotateCcw,
  CheckCircle,
  Lock,
  Database,
  BrainCircuit,
  Bell,
  Scale
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { resetDatabase, logAudit, currentUser } = useApp();

  const [facialThreshold, setFacialThreshold] = useState<number>(75);
  const [nlpThreshold, setNlpThreshold] = useState<number>(70);
  const [anprThreshold, setAnprThreshold] = useState<number>(85);
  const [retentionMinors, setRetentionMinors] = useState<number>(25);
  const [retentionAdults, setRetentionAdults] = useState<number>(10);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    logAudit(
      'SETTINGS_POLICY_UPDATED',
      'POLICY_CFG',
      'SYSTEM',
      `Updated AI thresholds (Face: ${facialThreshold}%, NLP: ${nlpThreshold}%, ANPR: ${anprThreshold}%)`
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSandbox = () => {
    if (window.confirm('Reset all synthetic demonstration cases, audit logs, and escalations back to factory seed defaults?')) {
      resetDatabase();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-800">
              <SettingsIcon className="w-5 h-5 text-blue-700" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                System Governance, AI Thresholds & Statutory Retention
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure algorithmic confidence cutoffs, juvenile justice retention mandates, and operational parameters.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Save Policy Parameters</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>System governance parameters successfully updated and logged in the audit ledger.</span>
        </div>
      )}

      {/* AI Confidence Thresholds */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-sm text-slate-900">
            Algorithmic Matching & Automated Confidence Cutoffs
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">Facial Recognition Matching Threshold</span>
              <span className="font-mono font-bold text-indigo-600">{facialThreshold}% Confidence</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={facialThreshold}
              onChange={e => setFacialThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Candidate appearances below this threshold are filtered out of CCTV candidate recommendations.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">Text & Modus Operandi Semantic NLP Similarity</span>
              <span className="font-mono font-bold text-indigo-600">{nlpThreshold}% Match Index</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={nlpThreshold}
              onChange={e => setNlpThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum cross-district correlation score required to generate automated Pattern Discovery alerts.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800">ANPR Vehicle Optical Character Recognition (OCR)</span>
              <span className="font-mono font-bold text-indigo-600">{anprThreshold}% Certainty</span>
            </div>
            <input
              type="range"
              min={60}
              max={99}
              value={anprThreshold}
              onChange={e => setAnprThreshold(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Statutory Retention Rules */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Scale className="w-4 h-4 text-emerald-600" />
          <h2 className="font-bold text-sm text-slate-900">
            Statutory Legal Retention & Anti-Human Trafficking Mandates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800">Minor Missing Records (POCSO / JJ Act)</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={retentionMinors}
                onChange={e => setRetentionMinors(Number(e.target.value))}
                min={10}
                max={50}
                className="w-20 p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
              />
              <span className="font-semibold text-slate-700">Years Mandatory Retention</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Supreme Court of India directives require permanent or 25-year sealed retention for child cases.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800">Adult Missing Records</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={retentionAdults}
                onChange={e => setRetentionAdults(Number(e.target.value))}
                min={5}
                max={30}
                className="w-20 p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
              />
              <span className="font-semibold text-slate-700">Years Statutory Retention</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Minimum retention before lawful expungement or unrecovered archiving.
            </p>
          </div>
        </div>
      </div>

      {/* Sandbox Reset & Storage */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>Reset Demonstration Environment</span>
          </h3>
          <p className="text-slate-500 mt-0.5">
            Restores all case registers, working scenarios, CCTV requests, and audit trails back to synthetic seed data.
          </p>
        </div>

        <button
          onClick={handleResetSandbox}
          className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 transition-colors shrink-0"
        >
          Reset Synthetic Database to Seed
        </button>
      </div>
    </div>
  );
};
