import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  Shield,
  MapPin,
  CheckCircle,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const ReportsAnalytics: React.FC = () => {
  const { cases, patternMatches, escalations, trafficRequests } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<string>('CASE_AGEING');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Ageing Breakdown
  const ageingData = [
    { bracket: '< 24h (Golden Window)', count: 2, fill: '#dc2626' },
    { bracket: '24h - 72h Critical', count: 1, fill: '#ea580c' },
    { bracket: '7 - 30 Days', count: 1, fill: '#d97706' },
    { bracket: '> 30 Days Active', count: 1, fill: '#2563eb' },
    { bracket: 'Recovered / Closed', count: 1, fill: '#059669' }
  ];

  // Gender & Demographics
  const demographicData = [
    { name: 'Female Minors (<18)', value: 2, color: '#ec4899' },
    { name: 'Male Minors (<18)', value: 2, color: '#3b82f6' },
    { name: 'Adult Females (18+)', value: 2, color: '#8b5cf6' }
  ];

  const handleExportCSV = (reportName: string) => {
    // Generate synthetic CSV string
    const headers = 'Case ID,Full Name,Age,Gender,Police Station,District,Status,AI Risk Score,Registered Date\n';
    const rows = cases
      .map(
        c =>
          `${c.id},"${c.fullName}",${c.age},${c.gender},"${c.policeStation}","${c.district}",${c.status},${c.aiRiskScore}%,${c.registeredDate}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NEXUS_${reportName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Generated and downloaded ${reportName} dataset.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Operational Reports, Case Ageing & Jurisdictional Analytics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory reporting dockets, forensic recovery metrics, and inter-state syndicate distribution charts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => handleExportCSV(selectedReportType)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Docket</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Case Ageing & Overdue Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                <span>Case Ageing & Critical Response Windows</span>
              </h3>
              <p className="text-[11px] text-slate-400">Golden 72-hour window tracking</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Active Pipeline</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageingData}>
                <XAxis dataKey="bracket" tick={{ fontSize: 9 }} interval={0} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {ageingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Demographic Vulnerability Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Demographic Vulnerability Profile</span>
              </h3>
              <p className="text-[11px] text-slate-400">Minor vs Adult distribution</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Demographics</span>
          </div>

          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Printable Report Preview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Statutory Anti-Human Trafficking Monthly Summary Preview
            </h3>
            <p className="text-xs text-slate-500">Official review docket for District & State Police Leadership</p>
          </div>

          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
            CONFIDENTIAL LAW ENFORCEMENT INTERNAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-3 py-2.5">Case ID</th>
                <th className="px-3 py-2.5">Person Name & Age</th>
                <th className="px-3 py-2.5">Jurisdiction</th>
                <th className="px-3 py-2.5">FIR Reference</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Trafficking Risk</th>
                <th className="px-3 py-2.5">Inter-District Sighting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{c.id}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-800">{c.fullName} ({c.age} yrs • {c.gender})</td>
                  <td className="px-3 py-2.5">{c.policeStation}, {c.district}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-600">{c.fir.firNumber}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-red-600">{c.aiRiskScore}%</td>
                  <td className="px-3 py-2.5">
                    {c.crossDistrictAlert ? (
                      <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        NH-24 Corridor Flagged
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
