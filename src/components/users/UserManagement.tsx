import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEEDED_USERS } from '../../data/mockData';
import { User, UserRole } from '../../types';
import {
  UserCog,
  Shield,
  Building,
  Key,
  UserCheck,
  CheckCircle,
  XCircle,
  Plus,
  Lock,
  Mail,
  Phone
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { currentUser } = useApp();
  const [usersList, setUsersList] = useState<User[]>(SEEDED_USERS);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('LOCAL_OFFICER');
  const [designation, setDesignation] = useState('Sub-Inspector of Police');
  const [stationOrDept, setStationOrDept] = useState('Anand Vihar Police Station');
  const [district, setDistrict] = useState('Shahdara District');
  const [phone, setPhone] = useState('+91 98110 88776');
  const [email, setEmail] = useState('si.anandvihar@delhipolice.gov.in');

  const permissionsMatrix = [
    { permission: 'Register New Missing Persons Case', local: true, district: true, state: true, gov: true, family: false },
    { permission: 'Enter & Commit Immutable FIR', local: true, district: true, state: true, gov: true, family: false },
    { permission: 'Build & Edit Working Scenarios', local: true, district: true, state: true, gov: true, family: false },
    { permission: 'Submit Traffic Camera Warrant Request', local: true, district: true, state: true, gov: true, family: false },
    { permission: 'Approve District Camera Requests', local: false, district: true, state: true, gov: true, family: false },
    { permission: 'Authorize Inter-District Escalation', local: false, district: true, state: true, gov: true, family: false },
    { permission: 'Execute Statutory Case Closure', local: false, district: true, state: true, gov: true, family: false },
    { permission: 'Approve Data Removal / Archival Request', local: false, district: false, state: false, gov: true, family: false },
    { permission: 'Inspect Global Tamper-Proof Audit Trail', local: false, district: true, state: true, gov: true, family: false },
    { permission: 'Access Confidential Suspect Intelligence', local: true, district: true, state: true, gov: true, family: false },
    { permission: 'View Approved Case Updates (Public)', local: true, district: true, state: true, gov: true, family: true },
    { permission: 'Submit Family Supplementary Leads', local: false, district: false, state: false, gov: false, family: true }
  ];

  const handleAddUser = () => {
    if (!name.trim()) return;

    const newUser: User = {
      id: `USR-00${usersList.length + 1}`,
      name: name.trim(),
      role,
      designation,
      stationOrDept,
      district,
      state: 'Delhi (NCT)',
      phone,
      email,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    };

    setUsersList(prev => [...prev, newUser]);
    setShowAddModal(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <UserCog className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Personnel Access & Jurisdictional Clearance
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized law enforcement personnel directory, jurisdiction delegation, and role-based permissions matrix.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Officer Credentials</span>
        </button>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Provisioned Accounts ({usersList.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Secured by Hardware Token (PKI)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Officer Profile</th>
                <th className="px-4 py-3">Role Tier</th>
                <th className="px-4 py-3">Station / Department</th>
                <th className="px-4 py-3">Jurisdiction</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.designation}</div>
                        {u.badgeNumber && (
                          <span className="font-mono text-[10px] text-blue-700 font-semibold">{u.badgeNumber}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-800">{u.stationOrDept}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-slate-600">{u.district}, {u.state}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-[11px] text-slate-600">{u.phone}</div>
                    <div className="text-[10px] text-slate-400">{u.email}</div>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ● Active Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Role-Based Access Control (RBAC) Statutory Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Granular permission mapping enforced across API endpoints, data models, and UI views.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Zero-Trust Law Enforcement Policy
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Permission Capability</th>
                <th className="px-3 py-3 text-center">Local Officer</th>
                <th className="px-3 py-3 text-center">District Admin</th>
                <th className="px-3 py-3 text-center">State CID Admin</th>
                <th className="px-3 py-3 text-center">Gov / MHA Admin</th>
                <th className="px-3 py-3 text-center">Family Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{item.permission}</td>
                  <td className="px-3 py-2.5 text-center">
                    {item.local ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {item.district ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {item.state ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {item.gov ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {item.family ? <CheckCircle className="w-4 h-4 text-purple-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Provision Authorized Officer Account</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name & Rank *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. SI Ananya Sen"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Role Tier</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="LOCAL_OFFICER">Local Police Officer</option>
                  <option value="DISTRICT_ADMIN">District Police Administrator</option>
                  <option value="STATE_ADMIN">State Police Administrator</option>
                  <option value="GOV_ADMIN">Government Department Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Police Station / Branch</label>
                  <input
                    type="text"
                    value={stationOrDept}
                    onChange={e => setStationOrDept(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
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
                onClick={handleAddUser}
                disabled={!name.trim()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs disabled:opacity-40"
              >
                Issue Digital ID & Provision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
