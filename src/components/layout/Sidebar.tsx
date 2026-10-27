import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BrainCircuit,
  Network,
  Share2,
  Video,
  Camera,
  GitCommit,
  ArrowUpRight,
  ShieldCheck,
  Archive,
  BarChart3,
  UserCog,
  FileCheck2,
  Settings,
  HeartHandshake,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, currentUser, cases, escalations, trafficRequests } = useApp();

  const isFamily = currentUser.role === 'FAMILY_MEMBER';
  const isAdmin = ['DISTRICT_ADMIN', 'STATE_ADMIN', 'GOV_ADMIN'].includes(currentUser.role);
  const isGovAdmin = currentUser.role === 'GOV_ADMIN';

  // Counts for badges
  const activeCasesCount = cases.filter(c => c.status === 'INVESTIGATING' || c.status === 'NEW_REGISTERED').length;
  const pendingEscalationsCount = escalations.filter(e => e.status === 'PENDING').length;
  const pendingTrafficCount = trafficRequests.filter(t => t.status === 'UNDER_REVIEW' || t.status === 'SUBMITTED').length;

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: number | string;
    badgeColor?: string;
    adminOnly?: boolean;
    familyVisible?: boolean;
    group?: string;
  }

  const navItems: NavItem[] = [
    // Family Member Nav
    {
      id: 'family-portal',
      label: 'Family Portal & Updates',
      icon: HeartHandshake,
      familyVisible: true,
      badge: 'Protected',
      badgeColor: 'bg-purple-600',
      group: 'Family Kin Portal'
    },
    // Police Core Nav
    {
      id: 'dashboard',
      label: 'Command Dashboard',
      icon: LayoutDashboard,
      group: 'Intelligence Operations'
    },
    {
      id: 'cases',
      label: 'Missing Persons Cases',
      icon: Users,
      badge: activeCasesCount,
      badgeColor: 'bg-blue-600',
      group: 'Intelligence Operations'
    },
    {
      id: 'register-case',
      label: 'Register New Case',
      icon: UserPlus,
      group: 'Intelligence Operations'
    },
    // AI & Advanced Analytics
    {
      id: 'scenario-builder',
      label: 'AI Scenario Builder',
      icon: BrainCircuit,
      badge: 'AI Active',
      badgeColor: 'bg-indigo-600',
      group: 'AI & Forensic Analysis'
    },
    {
      id: 'patterns',
      label: 'Pattern Discovery',
      icon: Network,
      badge: '94% Match',
      badgeColor: 'bg-amber-600',
      group: 'AI & Forensic Analysis'
    },
    {
      id: 'connections-graph',
      label: 'Suspect & Entity Graph',
      icon: Share2,
      group: 'AI & Forensic Analysis'
    },
    {
      id: 'video-intel',
      label: 'Video Intelligence & CCTV',
      icon: Video,
      group: 'Surveillance & Technical'
    },
    {
      id: 'traffic-requests',
      label: 'Traffic Camera & RTO',
      icon: Camera,
      badge: pendingTrafficCount > 0 ? pendingTrafficCount : undefined,
      badgeColor: 'bg-amber-600',
      group: 'Surveillance & Technical'
    },
    {
      id: 'timeline',
      label: 'Investigation Timeline',
      icon: GitCommit,
      group: 'Case Management'
    },
    {
      id: 'escalations',
      label: 'Case Escalations',
      icon: ArrowUpRight,
      badge: pendingEscalationsCount > 0 ? pendingEscalationsCount : undefined,
      badgeColor: 'bg-red-600',
      group: 'Case Management'
    },
    {
      id: 'recovery-closure',
      label: 'Recovery & Case Closure',
      icon: ShieldCheck,
      group: 'Case Management'
    },
    {
      id: 'historical',
      label: 'Historical Case Repository',
      icon: Archive,
      group: 'Intelligence Archive'
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      group: 'Intelligence Archive'
    },
    // Administration & Governance
    {
      id: 'users',
      label: 'User Management',
      icon: UserCog,
      adminOnly: true,
      group: 'System Governance'
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs & Tamper Trail',
      icon: FileCheck2,
      adminOnly: true,
      group: 'System Governance'
    },
    {
      id: 'settings',
      label: 'Settings & Policy Controls',
      icon: Settings,
      group: 'System Governance'
    }
  ];

  // Filter items based on role
  const visibleItems = isFamily
    ? navItems.filter(item => item.familyVisible)
    : navItems.filter(item => {
        if (item.familyVisible) return false;
        if (item.adminOnly && !isAdmin) return false;
        return true;
      });

  // Group items by category
  const groups = Array.from(new Set(visibleItems.map(item => item.group || 'General')));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-extrabold text-lg">
          🛡️
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-base tracking-wider text-white">NEXUS</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              v2.6
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            Missing Persons Intelligence
          </p>
        </div>
      </div>

      {/* Role Indicator Card */}
      <div className="p-3 bg-slate-800/40 border-b border-slate-800/60 text-xs">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
          <span>Active Clearance</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <div className="font-semibold text-white truncate text-xs">
          {currentUser.designation}
        </div>
        <div className="text-[11px] text-blue-400 font-medium truncate mt-0.5">
          {currentUser.stationOrDept}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {groups.map(group => {
          const itemsInGroup = visibleItems.filter(item => item.group === group);
          return (
            <div key={group} className="space-y-1">
              <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {group}
              </div>
              {itemsInGroup.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white text-blue-700' : `${item.badgeColor || 'bg-slate-700'} text-white`
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 text-[10px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono">CID-POL-SECURE</span>
          <span className="text-emerald-400 font-medium">Synced</span>
        </div>
        <p className="leading-tight text-slate-400 text-[10px]">
          Cross-Jurisdiction Grid v2.6.4 • National AHTU Network
        </p>
      </div>
    </aside>
  );
};
