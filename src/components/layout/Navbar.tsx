import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Shield,
  Search,
  Bell,
  ChevronDown,
  AlertTriangle,
  UserCheck,
  Building,
  Key,
  X,
  CheckCircle,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    searchQuery,
    setSearchQuery,
    selectedDistrict,
    setSelectedDistrict,
    activePage,
    setActivePage,
    familyNotifications,
    cases,
    setSelectedCaseId
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const rolesList: { role: UserRole; title: string; desc: string; icon: any }[] = [
    {
      role: 'LOCAL_OFFICER',
      title: 'Local Police Officer',
      desc: 'Inspector Rajesh Kumar (Tilak Nagar PS, West Delhi)',
      icon: Shield
    },
    {
      role: 'DISTRICT_ADMIN',
      title: 'District Police Administrator',
      desc: 'SP Vikram Singh, IPS (West District HQ)',
      icon: Building
    },
    {
      role: 'STATE_ADMIN',
      title: 'State Police Administrator',
      desc: 'ADGP Priya Sharma, IPS (State CID / Anti-Trafficking)',
      icon: Key
    },
    {
      role: 'GOV_ADMIN',
      title: 'Government Dept. Administrator',
      desc: 'Joint Secy. Anita Deshmukh, IAS (Ministry of Home Affairs)',
      icon: Building
    },
    {
      role: 'FAMILY_MEMBER',
      title: 'Family Member Portal',
      desc: 'Sunita Verma (Mother of Priya Verma MP-2026-0842)',
      icon: UserCheck
    }
  ];

  // Quick search results
  const searchResults = searchQuery.trim()
    ? cases.filter(c =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.fir.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.policeStation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const unreadCount = familyNotifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Critical notice strip */}
      <div className="bg-amber-500/10 border-b border-amber-200 px-4 py-1 flex items-center justify-between text-xs text-amber-900 font-medium">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white uppercase tracking-wider">
            Demo Sandbox
          </span>
          <span>
            Demonstration environment — all case records, personal identities, FIRs and surveillance feeds are synthetic.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-slate-500">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Govt. Secure Bus Encrypted (AES-256)
          </span>
          <span>Terminal ID: DL-POL-9812</span>
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Left: Mobile App Title & Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search by Case ID (MP-...), Person Name, FIR #, Station, Phone..."
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Live Search Popup */}
            {searchFocused && searchResults.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100"
                onMouseDown={e => e.preventDefault()}
              >
                <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Found {searchResults.length} matching case(s)</span>
                  <button onClick={() => setSearchFocused(false)} className="text-slate-400 hover:text-slate-600">Close</button>
                </div>
                {searchResults.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setActivePage(currentUser.role === 'FAMILY_MEMBER' ? 'family-portal' : 'cases');
                      setSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-3 transition-colors"
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.fullName}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-900">{c.fullName}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700">{c.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          c.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {c.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {c.fir.firNumber} • {c.policeStation} • Age {c.age}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* District Selector Filter */}
          {currentUser.role !== 'FAMILY_MEMBER' && (
            <div className="hidden lg:flex items-center space-x-1.5">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Scope:</span>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">All Jurisdictions / Inter-State</option>
                <option value="West District">West District (Delhi)</option>
                <option value="North District">North District (Delhi)</option>
                <option value="Ghaziabad">Ghaziabad (UP)</option>
                <option value="Gautam Buddha Nagar">Noida / GBN (UP)</option>
                <option value="Surat">Surat (Gujarat)</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Controls: Notifications & Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="System Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
                <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Notifications & Dispatch
                  </span>
                  <span className="text-[11px] text-blue-600 font-medium">{familyNotifications.length} alerts</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {familyNotifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center bg-slate-50">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      setActivePage(currentUser.role === 'FAMILY_MEMBER' ? 'family-portal' : 'audit-logs');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Audit & System Events →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight flex items-center space-x-1">
                  <span>{currentUser.name}</span>
                  {currentUser.role === 'FAMILY_MEMBER' ? (
                    <span className="px-1 py-0.2 bg-purple-100 text-purple-700 text-[10px] rounded font-semibold">Family</span>
                  ) : (
                    <span className="px-1 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded font-semibold">Officer</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                  {currentUser.designation}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Modal Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-900 text-white">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-0.5">
                    Simulation Role Switcher
                  </div>
                  <div className="text-xs text-slate-300">
                    Test the system across all 5 authorized police, administrative and family user tiers.
                  </div>
                </div>

                <div className="p-1.5 divide-y divide-slate-100">
                  {rolesList.map(r => {
                    const isCurrent = currentUser.role === r.role;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-2.5 transition-colors ${
                          isCurrent ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                              {r.title}
                            </span>
                            {isCurrent && (
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                  Permissions are strictly enforced on UI & mock business services.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
