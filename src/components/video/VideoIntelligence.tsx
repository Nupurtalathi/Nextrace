import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { VIDEO_CANDIDATES, VEHICLE_SIGHTINGS } from '../../data/mockData';
import { VideoAnalysisCandidate, VehicleSighting } from '../../types';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Camera,
  Car,
  User,
  Shield,
  Eye,
  Clock,
  Sparkles,
  AlertTriangle,
  MapPin,
  Sliders
} from 'lucide-react';

export const VideoIntelligence: React.FC = () => {
  const { cases, setSelectedCaseId, setActivePage, logAudit, currentUser } = useApp();

  const [candidates, setCandidates] = useState<VideoAnalysisCandidate[]>(VIDEO_CANDIDATES);
  const [vehicleSightings, setVehicleSightings] = useState<VehicleSighting[]>(VEHICLE_SIGHTINGS);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(222); // 00:03:42
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('VAC-01');
  const [activeTab, setActiveTab] = useState<'faces' | 'vehicles'>('faces');
  const [reviewNotes, setReviewNotes] = useState('');

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  const handleSeek = (seconds: number, candidateId?: string) => {
    setCurrentTime(seconds);
    if (candidateId) setSelectedCandidateId(candidateId);
  };

  const handleVerifyCandidate = (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          verificationStatus: status,
          reviewerNotes: reviewNotes || c.reviewerNotes
        };
      }
      return c;
    }));
    logAudit('VIDEO_CANDIDATE_VERIFIED', id, 'VIDEO', `Officer verified CCTV candidate match status to ${status}. Notes: ${reviewNotes || 'Confirmed by IO'}`);
    setReviewNotes('');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Video className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                CCTV Video Intelligence & Facial Verification Workspace
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated computer vision facial matching and Automatic Number Plate Recognition (ANPR) across authorized camera feeds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            Feed Integrity SHA-256 Validated
          </span>
        </div>
      </div>

      {/* Main Grid: Video Player + Detection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Video Player Interface */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-md p-4 flex flex-col space-y-3">
          {/* Simulated Video Canvas */}
          <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group select-none">
            {/* Background CCTV Frame Preview */}
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"
              alt="CCTV Frame"
              className="w-full h-full object-cover filter brightness-75 contrast-125"
            />

            {/* CCTV Scan Lines and Timestamp Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

            <div className="absolute top-3 left-3 text-[11px] font-mono text-emerald-400 font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-xs">
              CAM-DTS-AV-04 • ANAND VIHAR ISBT GATE 4 • REC 2026-10-21 09:18:22
            </div>

            <div className="absolute top-3 right-3 text-[11px] font-mono text-white/80 bg-red-600/80 px-2 py-0.5 rounded font-bold animate-pulse">
              ● SYNCED ARCHIVE
            </div>

            {/* Bounding Box Overlay for Selected Candidate */}
            {selectedCandidate && (
              <div
                className="absolute border-2 border-emerald-400 bg-emerald-500/10 rounded shadow-lg pointer-events-none transition-all"
                style={{
                  left: `${selectedCandidate.boundingBox.x}%`,
                  top: `${selectedCandidate.boundingBox.y}%`,
                  width: `${selectedCandidate.boundingBox.w}%`,
                  height: `${selectedCandidate.boundingBox.h}%`
                }}
              >
                <div className="absolute -top-6 left-0 bg-emerald-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                  MATCH: {selectedCandidate.confidenceScore}% (Priya Verma)
                </div>
              </div>
            )}

            {/* Center Play Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute p-4 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>

          {/* Timeline Scrubber & Controls */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>{formatTime(currentTime)}</span>
              <span>Total Extract: 15:00</span>
            </div>

            {/* Scrubber Range Bar with Detection Markers */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={900}
                value={currentTime}
                onChange={e => setCurrentTime(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />

              {/* Timestamp Markers */}
              {candidates.map(cand => (
                <div
                  key={cand.id}
                  onClick={() => handleSeek(cand.timestampSeconds, cand.id)}
                  className={`absolute top-0 w-2.5 h-2.5 rounded-full -mt-0.5 cursor-pointer transform -translate-x-1/2 transition-transform hover:scale-150 ${
                    cand.id === selectedCandidateId ? 'bg-emerald-400 ring-2 ring-white' : 'bg-amber-400'
                  }`}
                  style={{ left: `${(cand.timestampSeconds / 900) * 100}%` }}
                  title={`Jump to match at ${cand.timestamp}`}
                />
              ))}
            </div>

            {/* Quick Bookmark Buttons */}
            <div className="flex items-center space-x-2 pt-1 text-[11px]">
              <span className="text-slate-500 font-semibold">Flagged Bookmarks:</span>
              {candidates.map(cand => (
                <button
                  key={cand.id}
                  onClick={() => handleSeek(cand.timestampSeconds, cand.id)}
                  className={`px-2 py-0.5 rounded font-mono transition-colors ${
                    cand.id === selectedCandidateId
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  📍 {cand.timestamp} ({cand.confidenceScore}%)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Candidate Matches & Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Tab switch between Face and Vehicles */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4 text-xs">
              <button
                onClick={() => setActiveTab('faces')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'faces' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Person Matches ({candidates.length})
              </button>
              <button
                onClick={() => setActiveTab('vehicles')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'vehicles' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ANPR Vehicles ({vehicleSightings.length})
              </button>
            </div>

            {/* TAB 1: Person Matching */}
            {activeTab === 'faces' && selectedCandidate && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedCandidate.matchedPersonName}</h3>
                    <div className="text-[11px] text-slate-500">Case ID: {selectedCandidate.matchedCaseId}</div>
                  </div>
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${
                    selectedCandidate.confidenceScore >= 80 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {selectedCandidate.confidenceScore}% Match
                  </span>
                </div>

                {/* Compare: Reference vs CCTV Crop */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-center">
                    <img
                      src={cases.find(c => c.id === selectedCandidate.matchedCaseId)?.photoUrl}
                      alt="Reference"
                      className="w-full h-24 object-cover rounded-lg border border-slate-300 mb-1"
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Reference Photo</span>
                  </div>
                  <div className="text-center">
                    <img
                      src={selectedCandidate.thumbnailUrl}
                      alt="CCTV Crop"
                      className="w-full h-24 object-cover rounded-lg border border-slate-300 mb-1"
                    />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">CCTV Capture Frame</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <div>Location: <strong>{selectedCandidate.cameraLocation}</strong></div>
                  <div>Camera Ref: <strong className="font-mono">{selectedCandidate.cameraRef}</strong></div>
                  <div>Verification: <strong className="text-blue-700">{selectedCandidate.verificationStatus}</strong></div>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Algorithm Limitations:</strong> {selectedCandidate.limitations}
                </div>

                {/* Review Action */}
                {currentUser.role !== 'FAMILY_MEMBER' && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <textarea
                      value={reviewNotes}
                      onChange={e => setReviewNotes(e.target.value)}
                      placeholder="Add officer verification notes..."
                      rows={2}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVerifyCandidate(selectedCandidate.id, 'REJECTED')}
                        className="flex-1 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors"
                      >
                        Reject Match
                      </button>
                      <button
                        onClick={() => handleVerifyCandidate(selectedCandidate.id, 'CONFIRMED')}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                      >
                        Confirm Match
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ANPR Vehicles */}
            {activeTab === 'vehicles' && (
              <div className="space-y-3 text-xs">
                {vehicleSightings.map(v => (
                  <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {v.plateNumber}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                        {v.confidence}% Plate Read
                      </span>
                    </div>

                    <div className="text-slate-700 font-semibold">{v.color} {v.vehicleModel}</div>
                    <div className="text-[11px] text-slate-500">📍 {v.location}</div>
                    <div className="text-[10px] text-slate-400">Timestamp: {v.timestamp} • Cam: {v.cameraRef}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center">
            All facial candidate crops logged in evidentiary audit ledger.
          </div>
        </div>
      </div>
    </div>
  );
};
