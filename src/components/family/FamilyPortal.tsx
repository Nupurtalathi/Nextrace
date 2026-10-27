import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  Shield,
  Clock,
  Phone,
  MessageSquare,
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
  Send,
  HelpCircle
} from 'lucide-react';

export const FamilyPortal: React.FC = () => {
  const {
    currentUser,
    cases,
    familyNotifications,
    familyResponses,
    submitFamilyResponse,
    submitFamilyAdditionalInfo
  } = useApp();

  const linkedCase = cases.find(c => c.id === (currentUser.linkedCaseId || 'MP-2026-0842')) || cases[0];

  // Q&A reply state
  const [activeQuestion, setActiveQuestion] = useState<{ id: string; text: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubmitted, setReplySubmitted] = useState(false);

  // Additional info state
  const [additionalLead, setAdditionalLead] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Question notification needing response
  const pendingQuestion = familyNotifications.find(n => n.requiresResponse);

  const handleSendReply = () => {
    if (!replyText.trim() || !pendingQuestion) return;
    submitFamilyResponse(pendingQuestion.id, pendingQuestion.message, replyText.trim());
    setReplySubmitted(true);
    setReplyText('');
    setTimeout(() => setReplySubmitted(false), 5000);
  };

  const handleSendLead = () => {
    if (!additionalLead.trim()) return;
    submitFamilyAdditionalInfo(linkedCase.id, additionalLead.trim());
    setLeadSuccess(true);
    setAdditionalLead('');
    setTimeout(() => setLeadSuccess(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Supportive Dignified Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-purple-400" />
          <span>Official Police Family Support & Investigation Portal</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Case Inquiry for: {linkedCase.fullName}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Case Ref: <span className="font-mono text-blue-300 font-bold">{linkedCase.id}</span> • FIR: {linkedCase.fir.firNumber}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] text-blue-200 uppercase font-bold block">Current Case Status</span>
            <span className="text-sm font-extrabold text-emerald-300">
              ● Active Investigation & Inter-Agency Coordination
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-2 border-t border-white/10">
          This portal provides verified, lawful updates directly from the investigating team. Confidential operational tactics, suspect identities, and raw surveillance feeds are restricted to maintain investigative integrity.
        </p>
      </div>

      {/* Investigating Team Contact Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3.5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            alt="Investigating Officer"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
          />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Investigating Officer</div>
            <div className="font-bold text-slate-900 text-sm">{linkedCase.assignedOfficer}</div>
            <div className="text-slate-500">{linkedCase.policeStation} • {linkedCase.district}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={`tel:${linkedCase.assignedOfficerContact}`}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Officer: {linkedCase.assignedOfficerContact}</span>
          </a>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Emergency 24x7</span>
            <span className="font-bold text-red-600">Dial 112 / 1098</span>
          </div>
        </div>
      </div>

      {/* Verified Official Progress Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Verified Case Progress & Official Updates
            </h2>
            <p className="text-xs text-slate-500">Chronological public milestones approved for family disclosure</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold">
            Public Disclosure Standard
          </span>
        </div>

        <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 py-2">
          <div className="relative pl-6 text-xs space-y-1">
            <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white">
              ✓
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">Inter-District Alert Dispatched to Neighboring States</span>
              <span className="text-[10px] text-slate-400">24 Oct, 06:00 PM</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Supervision escalated to West District Anti-Human Trafficking Unit. Special police search teams are actively coordinating across highway transit points in Western Uttar Pradesh and Haryana.
            </p>
          </div>

          <div className="relative pl-6 text-xs space-y-1">
            <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white">
              ✓
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">CCTV Surveillance Footage Obtained & Verified</span>
              <span className="text-[10px] text-slate-400">22 Oct, 11:30 AM</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Transit terminal cameras near Anand Vihar were officially cataloged and analyzed by technical forensic officers.
            </p>
          </div>

          <div className="relative pl-6 text-xs space-y-1">
            <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white">
              ✓
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900">FIR Registered & Case Dossier Initiated</span>
              <span className="text-[10px] text-slate-400">21 Oct, 02:30 PM</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Primary FIR No. 412/2026 registered at Tilak Nagar Police Station. Dedicated Investigating Officer Inspector Rajesh Kumar assigned.
            </p>
          </div>
        </div>
      </div>

      {/* Officer Clarification Question & Direct Reply */}
      {pendingQuestion && (
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 text-sm">
                  Official Clarification Request from Investigating Officer:
                </span>
                <span className="text-[10px] text-slate-400">Action Requested</span>
              </div>
              <p className="text-slate-700 font-medium text-xs mt-1.5 leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                "{pendingQuestion.message}"
              </p>
            </div>
          </div>

          {replySubmitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Your response has been securely transmitted to IO Rajesh Kumar. Formal receipt issued.</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Your Response to Investigating Officer:</label>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="e.g., Priya had an Instagram account under @priya.v_2026 and mentioned someone named Pooja asking her to meet near Anand Vihar..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Response to Police Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Additional Information / Photo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Submit Additional Family Lead or Supporting Information
          </h2>
          <p className="text-xs text-slate-500">
            If you remember any new phone numbers, recent acquaintances, vehicle details, or social accounts, submit them here.
          </p>
        </div>

        {leadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Information logged into the case diary. Investigating team notified immediately.</span>
          </div>
        )}

        <div className="space-y-3">
          <textarea
            value={additionalLead}
            onChange={e => setAdditionalLead(e.target.value)}
            placeholder="Type any additional details or witness recollections here..."
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Official intake complies with Bharatiya Nagarik Suraksha Sanhita (BNSS).
            </span>

            <button
              onClick={handleSendLead}
              disabled={!additionalLead.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs disabled:opacity-40"
            >
              Transmit to Investigating Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
