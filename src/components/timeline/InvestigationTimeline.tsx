import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitCommit,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Plus,
  Shield,
  FileText,
  Filter,
  Phone,
  Car
} from 'lucide-react';

interface TimelineEventItem {
  id: string;
  time: string;
  date: string;
  title: string;
  description: string;
  source: string;
  type: 'FIR' | 'METRO' | 'TELECOM' | 'CCTV' | 'TOLL' | 'WITNESS' | 'POLICE_ACTION';
  isVerified: boolean;
  location?: string;
}

export const InvestigationTimeline: React.FC = () => {
  const { cases, selectedCaseId, setSelectedCaseId, currentUser, logAudit } = useApp();

  const c = cases.find(item => item.id === selectedCaseId) || cases[0];

  const [filterType, setFilterType] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Initial rich synthetic events for Priya Verma MP-2026-0842
  const [events, setEvents] = useState<TimelineEventItem[]>([
    {
      id: 'EVT-01',
      date: '2026-10-21',
      time: '08:00 AM',
      title: 'Departure from Residence (Tilak Nagar)',
      description: 'Subject Priya Verma left family residence wearing school uniform with school bag.',
      source: 'Mother (Sunita Verma) Statement',
      type: 'WITNESS',
      isVerified: true,
      location: 'Tilak Nagar, West Delhi'
    },
    {
      id: 'EVT-02',
      date: '2026-10-21',
      time: '08:22 AM',
      title: 'Metro Entry Logged (Subhash Nagar)',
      description: 'Smartcard #78192301 tapped at automatic fare collection gate.',
      source: 'DMRC Smartcard Server Audit Log',
      type: 'METRO',
      isVerified: true,
      location: 'Subhash Nagar Metro Station'
    },
    {
      id: 'EVT-03',
      date: '2026-10-21',
      time: '09:02 AM',
      title: 'Incoming Call from Suspect Burner Phone',
      description: 'Incoming call from +91 98765 43210 (duration 114 seconds). Tower: Anand Vihar East.',
      source: 'Telecom Nodal CDR Dump',
      type: 'TELECOM',
      isVerified: true,
      location: 'Anand Vihar Sector'
    },
    {
      id: 'EVT-04',
      date: '2026-10-21',
      time: '09:08 AM',
      title: 'Metro Exit Logged (Anand Vihar ISBT)',
      description: 'Deboarded Blue Line train and exited towards inter-state bus terminal.',
      source: 'DMRC Smartcard Server Audit Log',
      type: 'METRO',
      isVerified: true,
      location: 'Anand Vihar ISBT Metro Gate'
    },
    {
      id: 'EVT-05',
      date: '2026-10-21',
      time: '09:18 AM',
      title: 'CCTV Sighting: Interaction at Terminal Exit Gate 4',
      description: 'Subject seen conversing with female broker in red shawl and entering white Maruti Omni DL-8C-AK-4412.',
      source: 'Terminal CCTV Camera #CAM-DTS-AV-04',
      type: 'CCTV',
      isVerified: true,
      location: 'Anand Vihar ISBT Terminal Exit'
    },
    {
      id: 'EVT-06',
      date: '2026-10-21',
      time: '09:41 AM',
      title: 'FASTag Crossing at Ghazipur Border Toll Plaza',
      description: 'Suspect vehicle crossed toll lane 3 eastward into Ghaziabad, Uttar Pradesh.',
      source: 'NHAI FASTag Central Transaction Ledger #91823',
      type: 'TOLL',
      isVerified: true,
      location: 'Ghazipur Toll Plaza, NH-24'
    },
    {
      id: 'EVT-07',
      date: '2026-10-21',
      time: '14:30 PM',
      title: 'FIR No. 412/2026 Registered at Tilak Nagar PS',
      description: 'Mother lodged formal missing complaint. Case locked as immutable benchmark.',
      source: 'Delhi Police CCTNS System',
      type: 'FIR',
      isVerified: true,
      location: 'Tilak Nagar Police Station'
    },
    {
      id: 'EVT-08',
      date: '2026-10-22',
      time: '12:00 PM',
      title: 'Inter-District Escalation & Joint Alert Dispatched',
      description: 'Case escalated to West District HQ; joint alert transmitted to Ghaziabad and Meerut AHTU.',
      source: 'Supervisory Dispatch Docket #ESC-2026-0012',
      type: 'POLICE_ACTION',
      isVerified: true,
      location: 'West District HQ'
    }
  ]);

  // Form state for adding milestone
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newTime, setNewTime] = useState('10:15 AM');
  const [newDate, setNewDate] = useState('2026-10-22');
  const [newType, setNewType] = useState<TimelineEventItem['type']>('POLICE_ACTION');
  const [newLocation, setNewLocation] = useState('');

  const filteredEvents = events.filter(e => {
    if (filterType !== 'ALL' && e.type !== filterType) return false;
    return true;
  });

  const handleAddEvent = () => {
    if (!newTitle.trim() || !newDesc.trim() || !newSource.trim()) return;

    const newEv: TimelineEventItem = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      date: newDate,
      time: newTime,
      title: newTitle.trim(),
      description: newDesc.trim(),
      source: newSource.trim(),
      type: newType,
      isVerified: true,
      location: newLocation.trim() || undefined
    };

    setEvents(prev => [...prev, newEv]);
    logAudit('TIMELINE_MILESTONE_ADDED', c.id, 'CASE', `Added milestone: "${newTitle}" (${newType})`);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewSource('');
  };

  const getTypeColor = (type: TimelineEventItem['type']) => {
    switch (type) {
      case 'FIR': return 'bg-blue-600 text-white';
      case 'METRO': return 'bg-cyan-600 text-white';
      case 'TELECOM': return 'bg-purple-600 text-white';
      case 'CCTV': return 'bg-emerald-600 text-white';
      case 'TOLL': return 'bg-amber-600 text-white';
      case 'WITNESS': return 'bg-pink-600 text-white';
      case 'POLICE_ACTION': return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <GitCommit className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Chronological Multi-Source Investigation Timeline
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Harmonized timeline synthesizing telecom dumps, transit smartcards, toll logs, and eyewitness reports.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <select
            value={c.id}
            onChange={e => setSelectedCaseId(e.target.value)}
            className="font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
          >
            {cases.map(item => (
              <option key={item.id} value={item.id}>
                {item.fullName} ({item.id})
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">All Event Sources</option>
            <option value="CCTV">CCTV Surveillance</option>
            <option value="TELECOM">Telecom / Tower Dump</option>
            <option value="TOLL">FASTag / Highway Toll</option>
            <option value="METRO">Transit Smartcard</option>
            <option value="WITNESS">Witness Statement</option>
            <option value="POLICE_ACTION">Police Team Actions</option>
          </select>

          {currentUser.role !== 'FAMILY_MEMBER' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-8 py-2">
          {filteredEvents.map((ev, index) => (
            <div key={ev.id} className="relative pl-6 md:pl-8 group">
              {/* Dot Icon on line */}
              <div
                className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-[9px] font-bold ${getTypeColor(
                  ev.type
                )}`}
              >
                ✓
              </div>

              {/* Timestamp label on left for desktop */}
              <div className="md:absolute md:-left-36 md:top-1 text-left md:text-right w-28 text-xs font-mono font-bold text-slate-500 mb-1 md:mb-0">
                <div>{ev.date}</div>
                <div className="text-[11px] text-blue-600">{ev.time}</div>
              </div>

              {/* Content Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTypeColor(ev.type)}`}>
                      {ev.type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{ev.title}</h3>
                  </div>

                  {ev.location && (
                    <span className="flex items-center text-slate-500 text-[11px] font-medium">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                      {ev.location}
                    </span>
                  )}
                </div>

                <p className="text-slate-700 leading-relaxed">{ev.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <span>Source: <strong className="text-slate-700 italic">{ev.source}</strong></span>
                  <span className="font-bold text-emerald-700">● Independently Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Record New Case Milestone</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Sighted at Jaipur Bus Stand"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="14:30 PM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="POLICE_ACTION">Police Team Action</option>
                    <option value="CCTV">CCTV Surveillance</option>
                    <option value="TELECOM">Telecom / Tower</option>
                    <option value="TOLL">FASTag / Toll</option>
                    <option value="WITNESS">Witness / Citizen Tip</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. NH-24 Toll"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Event Narrative / Description *</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Citation Document / Log *</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={e => setNewSource(e.target.value)}
                  placeholder="e.g. Case Diary Entry Para 8 / Toll FASTag Ledger"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
              >
                Commit to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
