import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CaseList } from './components/cases/CaseList';
import { RegisterCase } from './components/registration/RegisterCase';
import { AIScenarioBuilder } from './components/scenario/AIScenarioBuilder';
import { PatternDiscovery } from './components/patterns/PatternDiscovery';
import { SuspectEntityGraph } from './components/graph/SuspectEntityGraph';
import { VideoIntelligence } from './components/video/VideoIntelligence';
import { TrafficCameraRequests } from './components/traffic/TrafficCameraRequests';
import { InvestigationTimeline } from './components/timeline/InvestigationTimeline';
import { CaseEscalations } from './components/escalations/CaseEscalations';
import { RecoveryClosureWorkflow } from './components/recovery/RecoveryClosureWorkflow';
import { HistoricalCaseRepository } from './components/historical/HistoricalCaseRepository';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { UserManagement } from './components/users/UserManagement';
import { AuditLogViewer } from './components/audit/AuditLogViewer';
import { Settings } from './components/settings/Settings';
import { FamilyPortal } from './components/family/FamilyPortal';
import { ChevronRight, Home, AlertOctagon } from 'lucide-react';

const PageContent: React.FC = () => {
  const { activePage, setActivePage, selectedCaseId, currentUser, cases } = useApp();

  const activeCase = cases.find(c => c.id === selectedCaseId);

  // Friendly title map
  const pageTitles: Record<string, string> = {
    'dashboard': 'Command Dashboard',
    'cases': 'Missing Persons Cases',
    'register-case': 'Register New Case',
    'scenario-builder': 'AI Scenario Builder',
    'patterns': 'Pattern Discovery & Cross-District Matcher',
    'connections-graph': 'Suspect & Entity Connection Graph',
    'video-intel': 'Video Intelligence & CCTV Workspace',
    'traffic-requests': 'Traffic Camera & RTO Surveillance Requests',
    'timeline': 'Investigation Timeline',
    'escalations': 'Case Escalations',
    'recovery-closure': 'Recovery Verification & Case Closure',
    'historical': 'Historical Case Repository',
    'reports': 'Reports & Analytics',
    'users': 'User Management & Clearances',
    'audit-logs': 'Audit Logs & Tamper Trail',
    'settings': 'Settings & Policy Governance',
    'family-portal': 'Family Portal & Verified Updates'
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cases':
        return <CaseList />;
      case 'register-case':
        return <RegisterCase />;
      case 'scenario-builder':
        return <AIScenarioBuilder />;
      case 'patterns':
        return <PatternDiscovery />;
      case 'connections-graph':
        return <SuspectEntityGraph />;
      case 'video-intel':
        return <VideoIntelligence />;
      case 'traffic-requests':
        return <TrafficCameraRequests />;
      case 'timeline':
        return <InvestigationTimeline />;
      case 'escalations':
        return <CaseEscalations />;
      case 'recovery-closure':
        return <RecoveryClosureWorkflow />;
      case 'historical':
        return <HistoricalCaseRepository />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'users':
        return <UserManagement />;
      case 'audit-logs':
        return <AuditLogViewer />;
      case 'settings':
        return <Settings />;
      case 'family-portal':
        return <FamilyPortal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Execution Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar />

        {/* Breadcrumb & Amber Alert Banner */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs shrink-0">
          <nav className="flex items-center space-x-1.5 text-slate-500 truncate">
            <button
              onClick={() => setActivePage(currentUser.role === 'FAMILY_MEMBER' ? 'family-portal' : 'dashboard')}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>NEXUS</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {pageTitles[activePage] || 'Module'}
            </span>
            {activeCase && (activePage === 'scenario-builder' || activePage === 'timeline') && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-blue-700 font-bold truncate">
                  {activeCase.fullName} ({activeCase.id})
                </span>
              </>
            )}
          </nav>

          {/* Active Amber Alert Ticker */}
          <div className="hidden lg:flex items-center space-x-2 text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 text-[11px] font-bold">
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse text-red-600" />
            <span>AMBER ALERT ACTIVE: MP-2026-0842 (Priya Verma, 16F) • Inter-State Corridors Alerted</span>
          </div>
        </div>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PageContent />
    </AppProvider>
  );
}
