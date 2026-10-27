import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  AlertOctagon,
  Clock,
  Network,
  ShieldCheck,
  CheckCircle2,
  FilePlus2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Filter,
  Eye,
  Activity,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CaseMap } from '../common/CaseMap';

export const Dashboard: React.FC = () => {
  const {
    cases,
    patternMatches,
    escalations,
    trafficRequests,
    auditLogs,
    selectedDistrict,
    setSelectedDistrict,
    setActivePage,
    setSelectedCaseId
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter cases based on selected District and Status
  const filteredCases = cases.filter(c => {
    if (selectedDistrict !== 'ALL' && c.district !== selectedDistrict) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  // Calculate stats from dynamic state
  const totalActiveCases = filteredCases.filter(c => c.status === 'INVESTIGATING' || c.status === 'NEW_REGISTERED').length;
  const newlyRegistered = filteredCases.filter(c => c.status === 'NEW_REGISTERED' || c.registeredDate > '2026-10-15').length;
  const awaitingVerification = filteredCases.filter(c => c.status === 'AWAITING_VERIFICATION').length;
  const potentialConnections = patternMatches.length;
  const highPriorityCases = filteredCases.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH').length;
  const recoveryPendingApproval = filteredCases.filter(c => c.status === 'RECOVERY_REPORTED' && c.recoveryDetails?.closureStatus === 'AWAITING_APPROVAL').length;
  const closedCases = filteredCases.filter(c => c.status === 'CLOSED').length;

  // Chart Data: Active cases by district
  const districtCounts = cases.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.district] = (acc[curr.district] || 0) + 1;
    return acc;
  }, {});

  const districtData = Object.entries(districtCounts).map(([district, count]) => ({
    district,
    cases: count
  }));

  // Chart Data: Cases by status
  const statusCounts = cases.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    INVESTIGATING: '#2563eb',
    NEW_REGISTERED: '#0284c7',
    AWAITING_VERIFICATION: '#d97706',
    ESCALATED: '#dc2626',
    RECOVERY_REPORTED: '#10b981',
    CLOSED: '#64748b'
  };

  const statusData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.replace('_', ' '),
    value,
    color: statusColors[status] || '#94a3b8'
  }));

  // Chart Data: Monthly Trends
  const trendData = [
    { month: 'Jun', reported: 18, recovered: 14 },
    { month: 'Jul', reported: 24, recovered: 19 },
    { month: 'Aug', reported: 29, recovered: 23 },
    { month: 'Sep', reported: 35, recovered: 28 },
    { month: 'Oct', reported: 42, recovered: 31 }
  ];

  // Chart Data: Escalations by Jurisdiction
  const escalationData = [
    { jurisdiction: 'West Delhi -> District', count: 4 },
    { jurisdiction: 'Delhi -> Western UP CID', count: 6 },
    { jurisdiction: 'Delhi -> Rajasthan Rly', count: 3 },
    { jurisdiction: 'UP -> National AHTU', count: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Command & Case Intelligence Operations
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ● Grid Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cross-jurisdiction situational awareness, forensic timelines, and AI-assisted trafficking pattern detection.
          </p>
        </div>

        {/* Global Dashboard Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            {(['7D', '30D', '90D', 'ALL'] as const).map(period => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeFilter === period ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="AWAITING_VERIFICATION">Awaiting Verification</option>
            <option value="RECOVERY_REPORTED">Recovery Reported</option>
            <option value="CLOSED">Closed (Archived)</option>
          </select>

          <button
            onClick={() => setActivePage('register-case')}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Register Case</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Active */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Cases</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalActiveCases}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">Under investigation</div>
        </div>

        {/* Newly Registered */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">New (7 Days)</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{newlyRegistered}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">+2 registered today</div>
        </div>

        {/* Awaiting Verification */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verification</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{awaitingVerification}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-1">Witness/CDR reviews</div>
        </div>

        {/* Potential Connections */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Inter-District</span>
            <Network className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{potentialConnections}</div>
          <div className="text-[10px] text-purple-600 font-medium mt-1">AI similarity links</div>
        </div>

        {/* High Priority Alerts */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Critical / Red</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{highPriorityCases}</div>
          <div className="text-[10px] text-red-600 font-medium mt-1">Minors & syndicates</div>
        </div>

        {/* Recovery Pending */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recovery Review</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{recoveryPendingApproval}</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-1">SDM signoff pending</div>
        </div>

        {/* Closed Cases */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Closed (YTD)</span>
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-700">{closedCases}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Statutory archive</div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Critical Case Priority Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Geospatial Map */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Geographic Case Distribution & Transit Hotspots</span>
              </h2>
              <p className="text-xs text-slate-500">
                Live OpenStreetMap visualization of last-seen incident coordinates across Delhi NCR and Western UP.
              </p>
            </div>
            <button
              onClick={() => setSelectedDistrict('ALL')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Map Scope
            </button>
          </div>
          <div className="flex-1 min-h-[360px]">
            <CaseMap cases={filteredCases} height="360px" />
          </div>
        </div>

        {/* Right: Urgent Cases Requiring Review */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>Critical Attention Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Cases requiring urgent supervisory action</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
              {filteredCases.filter(c => c.priority === 'CRITICAL').length} Critical
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[360px]">
            {filteredCases
              .filter(c => c.priority === 'CRITICAL' || c.aiRiskScore > 75)
              .map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setActivePage('cases');
                  }}
                  className="p-3 rounded-lg border border-red-100 bg-red-50/40 hover:bg-red-50 hover:border-red-300 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={c.photoUrl}
                        alt={c.fullName}
                        className="w-10 h-10 rounded-lg object-cover border border-red-200"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.age} yrs • {c.gender} • <span className="font-mono text-slate-700">{c.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                        AI Risk {c.aiRiskScore}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-600 line-clamp-2">
                    {c.fir.firNumber} • {c.fir.lastSeenLocation}
                  </div>

                  {c.crossDistrictAlert && (
                    <div className="mt-2 flex items-center space-x-1 text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      <Network className="w-3 h-3" />
                      <span>{c.transitCorridorFlag || 'Inter-District Link Identified'}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActivePage('cases')}
              className="w-full py-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center space-x-1"
            >
              <span>View All Missing Persons Dossiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visualizations Row: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Active Cases by District */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Cases by District
            </h3>
            <span className="text-[10px] text-slate-400">Jurisdictional Load</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <XAxis dataKey="district" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="cases" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cases by Investigation Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Case Status Lifecycle
            </h3>
            <span className="text-[10px] text-slate-400">Current Pipeline</span>
          </div>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Monthly Trends */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Monthly Reported vs Recovered
            </h3>
            <span className="text-[10px] text-slate-400">Last 5 Months</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="reported" stroke="#dc2626" strokeWidth={2} name="Reported" />
                <Line type="monotone" dataKey="recovered" stroke="#059669" strokeWidth={2} name="Recovered" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Investigation Activity & AI Leads Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Recent Investigation & Audit Feed</span>
              </h3>
              <p className="text-xs text-slate-500">Immutable ledger of investigative actions</p>
            </div>
            <button
              onClick={() => setActivePage('audit-logs')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              All Logs →
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {auditLogs.slice(0, 6).map(log => (
              <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 line-clamp-1">{log.details}</p>
                  <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-400">
                    <span>Officer: {log.performedBy}</span>
                    <span>•</span>
                    <span className="font-mono truncate max-w-[120px]">{log.integrityHash.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launchpad to Workflows */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Operational Workflows & Quick Actions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Direct access to specialized investigation modules
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedCaseId('MP-2026-0842');
                  setActivePage('scenario-builder');
                }}
                className="p-3 text-left rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
              >
                <div className="font-bold text-xs text-indigo-900 group-hover:text-indigo-700 flex items-center justify-between">
                  <span>AI Scenario Builder</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-indigo-600/80 mt-1">
                  NLP entity extraction & working scenario versions
                </p>
              </button>

              <button
                onClick={() => setActivePage('patterns')}
                className="p-3 text-left rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all group"
              >
                <div className="font-bold text-xs text-amber-900 group-hover:text-amber-700 flex items-center justify-between">
                  <span>Pattern Discovery</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-amber-600/80 mt-1">
                  Cross-district trafficking syndicate matcher
                </p>
              </button>

              <button
                onClick={() => setActivePage('connections-graph')}
                className="p-3 text-left rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all group"
              >
                <div className="font-bold text-xs text-purple-900 group-hover:text-purple-700 flex items-center justify-between">
                  <span>Suspect & Entity Graph</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-purple-600/80 mt-1">
                  Interactive network of cases, vehicles & brokers
                </p>
              </button>

              <button
                onClick={() => setActivePage('video-intel')}
                className="p-3 text-left rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all group"
              >
                <div className="font-bold text-xs text-blue-900 group-hover:text-blue-700 flex items-center justify-between">
                  <span>CCTV & Video Intel</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-blue-600/80 mt-1">
                  Facial matching & ANPR vehicle tracking
                </p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Logged in as: <strong className="text-slate-700">{cases.length} Total Records Loaded</strong></span>
            <span className="font-mono text-[11px] text-emerald-600 font-semibold">ALL SYSTEMS SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
