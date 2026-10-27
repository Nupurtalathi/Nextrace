import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  MissingPersonCase,
  PatternMatch,
  TrafficCameraRequest,
  EscalationRecord,
  AuditLog,
  FamilyNotification,
  FamilyQuestionResponse,
  ScenarioVersion,
  ClaimStatus,
  RecoveryRecord
} from '../types';
import {
  SEEDED_USERS,
  INITIAL_CASES,
  PATTERN_MATCHES,
  TRAFFIC_REQUESTS,
  ESCALATIONS,
  AUDIT_LOGS,
  FAMILY_NOTIFICATIONS
} from '../data/mockData';

export interface DeletionRequest {
  id: string;
  caseId: string;
  caseName: string;
  reason: string;
  requestedBy: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  statutoryBlockReason?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;

  // Data
  cases: MissingPersonCase[];
  addCase: (newCase: MissingPersonCase) => void;
  updateCase: (caseId: string, updates: Partial<MissingPersonCase>) => void;
  
  // Scenarios
  addScenarioVersion: (caseId: string, version: ScenarioVersion) => void;
  updateClaimStatus: (caseId: string, versionIndex: number, claimId: string, status: ClaimStatus) => void;

  // Patterns
  patternMatches: PatternMatch[];
  updatePatternReview: (id: string, status: 'VERIFIED_LINK' | 'REJECTED_FALSE_POSITIVE', notes?: string) => void;

  // Traffic
  trafficRequests: TrafficCameraRequest[];
  addTrafficRequest: (req: TrafficCameraRequest) => void;
  updateTrafficRequestStatus: (id: string, status: TrafficCameraRequest['status'], notes?: string) => void;

  // Escalations
  escalations: EscalationRecord[];
  addEscalation: (esc: EscalationRecord) => void;
  updateEscalationStatus: (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => void;

  // Recovery & Closure
  submitRecovery: (caseId: string, recovery: RecoveryRecord) => void;
  updateRecoveryChecklist: (caseId: string, checklist: Partial<RecoveryRecord>) => void;
  closeCaseWithVerification: (caseId: string) => boolean;

  // Data Removal & Archival
  deletionRequests: DeletionRequest[];
  submitDeletionRequest: (caseId: string, reason: string) => void;
  reviewDeletionRequest: (id: string, decision: 'APPROVED' | 'REJECTED', justification: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAudit: (action: string, targetId: string, entityType: AuditLog['entityType'], details: string) => void;

  // Family Portal
  familyNotifications: FamilyNotification[];
  familyResponses: FamilyQuestionResponse[];
  submitFamilyResponse: (questionId: string, questionText: string, answerText: string) => void;
  submitFamilyAdditionalInfo: (caseId: string, info: string, photoRef?: string) => void;

  // Reset to seed data
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : SEEDED_USERS[0]; // Local Officer default
  });

  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('MP-2026-0842');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const [cases, setCases] = useState<MissingPersonCase[]>(() => {
    const saved = localStorage.getItem('nexus_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [patternMatches, setPatternMatches] = useState<PatternMatch[]>(() => {
    const saved = localStorage.getItem('nexus_patterns');
    return saved ? JSON.parse(saved) : PATTERN_MATCHES;
  });

  const [trafficRequests, setTrafficRequests] = useState<TrafficCameraRequest[]>(() => {
    const saved = localStorage.getItem('nexus_traffic');
    return saved ? JSON.parse(saved) : TRAFFIC_REQUESTS;
  });

  const [escalations, setEscalations] = useState<EscalationRecord[]>(() => {
    const saved = localStorage.getItem('nexus_escalations');
    return saved ? JSON.parse(saved) : ESCALATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nexus_audit');
    return saved ? JSON.parse(saved) : AUDIT_LOGS;
  });

  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>(() => {
    const saved = localStorage.getItem('nexus_deletions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'DEL-2026-01',
        caseId: 'MP-2026-0842',
        caseName: 'Priya Verma (16F)',
        reason: 'Requested removal by third party claiming false registration',
        requestedBy: 'Counsel R.K. Vashisht',
        requestDate: '2026-10-25T11:00:00Z',
        status: 'REJECTED',
        statutoryBlockReason: 'BLOCKED: Under Section 137(2) BNS & POCSO mandatory child tracing directive. Active criminal investigation cannot be purged.',
        reviewedBy: 'Joint Secy. Anita Deshmukh, IAS (Govt Admin)',
        reviewedDate: '2026-10-25T14:30:00Z'
      }
    ];
  });

  const [familyNotifications, setFamilyNotifications] = useState<FamilyNotification[]>(() => {
    const saved = localStorage.getItem('nexus_family_notifs');
    return saved ? JSON.parse(saved) : FAMILY_NOTIFICATIONS;
  });

  const [familyResponses, setFamilyResponses] = useState<FamilyQuestionResponse[]>(() => {
    const saved = localStorage.getItem('nexus_family_responses');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('nexus_patterns', JSON.stringify(patternMatches));
  }, [patternMatches]);

  useEffect(() => {
    localStorage.setItem('nexus_traffic', JSON.stringify(trafficRequests));
  }, [trafficRequests]);

  useEffect(() => {
    localStorage.setItem('nexus_escalations', JSON.stringify(escalations));
  }, [escalations]);

  useEffect(() => {
    localStorage.setItem('nexus_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('nexus_deletions', JSON.stringify(deletionRequests));
  }, [deletionRequests]);

  const logAudit = (action: string, targetId: string, entityType: AuditLog['entityType'], details: string) => {
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action,
      performedBy: currentUser.name,
      role: currentUser.role,
      targetEntityId: targetId,
      entityType,
      details,
      ipAddress: '192.168.10.42 (Station Terminal 2)',
      integrityHash: randomHash
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const found = SEEDED_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      logAudit('ROLE_SWITCHED', found.id, 'USER', `Session user switched to ${found.name} (${role})`);
      if (role === 'FAMILY_MEMBER') {
        setActivePage('family-portal');
        setSelectedCaseId(found.linkedCaseId || 'MP-2026-0842');
      } else if (activePage === 'family-portal') {
        setActivePage('dashboard');
      }
    }
  };

  const addCase = (newCase: MissingPersonCase) => {
    setCases(prev => [newCase, ...prev]);
    logAudit('CASE_REGISTERED', newCase.id, 'CASE', `New case registered: ${newCase.fullName} (${newCase.age}${newCase.gender[0]}). FIR ${newCase.fir.firNumber}`);
  };

  const updateCase = (caseId: string, updates: Partial<MissingPersonCase>) => {
    setCases(prev => prev.map(c => (c.id === caseId ? { ...c, ...updates, lastUpdatedDate: new Date().toISOString() } : c)));
    logAudit('CASE_UPDATED', caseId, 'CASE', `Updated case fields: ${Object.keys(updates).join(', ')}`);
  };

  const addScenarioVersion = (caseId: string, version: ScenarioVersion) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const nextVersions = [...(c.scenarioVersions || []), version];
        return {
          ...c,
          scenarioVersions: nextVersions,
          lastUpdatedDate: new Date().toISOString()
        };
      }
      return c;
    }));
    logAudit('SCENARIO_VERSION_ADDED', caseId, 'SCENARIO', `Added scenario version ${version.versionNumber} with ${version.claims.length} claims.`);
  };

  const updateClaimStatus = (caseId: string, versionIndex: number, claimId: string, status: ClaimStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId && c.scenarioVersions && c.scenarioVersions[versionIndex]) {
        const updatedVersions = [...c.scenarioVersions];
        const currentVersion = { ...updatedVersions[versionIndex] };
        currentVersion.claims = currentVersion.claims.map(claim => {
          if (claim.id === claimId) {
            return { ...claim, status, verifiedBy: currentUser.name };
          }
          return claim;
        });
        updatedVersions[versionIndex] = currentVersion;
        return { ...c, scenarioVersions: updatedVersions, lastUpdatedDate: new Date().toISOString() };
      }
      return c;
    }));
    logAudit('CLAIM_STATUS_UPDATED', claimId, 'SCENARIO', `Claim status set to ${status} by ${currentUser.name}`);
  };

  const updatePatternReview = (id: string, status: 'VERIFIED_LINK' | 'REJECTED_FALSE_POSITIVE', notes?: string) => {
    setPatternMatches(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          reviewStatus: status,
          reviewedBy: currentUser.name,
          reviewedDate: new Date().toISOString(),
          recommendedSteps: notes ? [...p.recommendedSteps, `Officer Note: ${notes}`] : p.recommendedSteps
        };
      }
      return p;
    }));
    logAudit('PATTERN_REVIEW_UPDATED', id, 'CASE', `Pattern review changed to ${status}`);
  };

  const addTrafficRequest = (req: TrafficCameraRequest) => {
    setTrafficRequests(prev => [req, ...prev]);
    logAudit('TRAFFIC_REQUEST_CREATED', req.id, 'TRAFFIC_REQUEST', `Submitted camera access request for ${req.locationName} (${req.urgency} urgency)`);
  };

  const updateTrafficRequestStatus = (id: string, status: TrafficCameraRequest['status'], notes?: string) => {
    setTrafficRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          approverNotes: notes || r.approverNotes,
          approvedDate: status === 'APPROVED' || status === 'FOOTAGE_RECEIVED' ? new Date().toISOString() : r.approvedDate
        };
      }
      return r;
    }));
    logAudit('TRAFFIC_REQUEST_UPDATED', id, 'TRAFFIC_REQUEST', `Camera request status changed to ${status}`);
  };

  const addEscalation = (esc: EscalationRecord) => {
    setEscalations(prev => [esc, ...prev]);
    logAudit('CASE_ESCALATION_INITIATED', esc.caseId, 'ESCALATION', `Escalation requested to ${esc.targetLevel} level. Trigger: ${esc.triggerReason}`);
  };

  const updateEscalationStatus = (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    setEscalations(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          decisionNotes: notes || e.decisionNotes
        };
      }
      return e;
    }));
    logAudit('ESCALATION_DECISION_RECORDED', id, 'ESCALATION', `Escalation ${status} by ${currentUser.name}`);
  };

  const submitRecovery = (caseId: string, recovery: RecoveryRecord) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'RECOVERY_REPORTED',
          recoveryDetails: recovery,
          lastUpdatedDate: new Date().toISOString()
        };
      }
      return c;
    }));
    logAudit('RECOVERY_SUBMITTED', caseId, 'RECOVERY', `Recovery documentation submitted at ${recovery.recoveryLocation}. Status: ${recovery.closureStatus}`);
  };

  const updateRecoveryChecklist = (caseId: string, checklist: Partial<RecoveryRecord>) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId && c.recoveryDetails) {
        const updatedRec = { ...c.recoveryDetails, ...checklist };
        return {
          ...c,
          recoveryDetails: updatedRec,
          lastUpdatedDate: new Date().toISOString()
        };
      }
      return c;
    }));
    logAudit('RECOVERY_CHECKLIST_UPDATED', caseId, 'RECOVERY', `Updated checklist items: ${Object.keys(checklist).join(', ')}`);
  };

  const closeCaseWithVerification = (caseId: string): boolean => {
    const target = cases.find(c => c.id === caseId);
    if (!target || !target.recoveryDetails) return false;
    const rec = target.recoveryDetails;

    // Strict 4-point verification check
    if (!rec.hasMedicalReport || !rec.hasMagistrateStatement || !rec.hasIdentityCardVerification || !rec.hasOfficerInChargeSignoff) {
      return false;
    }

    setCases(prev => prev.map(c => {
      if (c.id === caseId && c.recoveryDetails) {
        return {
          ...c,
          status: 'CLOSED',
          recoveryDetails: {
            ...c.recoveryDetails,
            closureStatus: 'CLOSED',
            closedDate: new Date().toISOString(),
            approvedByAuthority: currentUser.name
          },
          lastUpdatedDate: new Date().toISOString()
        };
      }
      return c;
    }));

    logAudit('CASE_FORMALLY_CLOSED', caseId, 'CASE', `All 4 verification checks passed. Case formally archived under statutory retention (${rec.statutoryRetentionYears} yrs).`);
    return true;
  };

  const submitDeletionRequest = (caseId: string, reason: string) => {
    const target = cases.find(c => c.id === caseId);
    const newReq: DeletionRequest = {
      id: `DEL-${Date.now().toString().slice(-4)}`,
      caseId,
      caseName: target ? `${target.fullName} (${target.id})` : caseId,
      reason,
      requestedBy: currentUser.name,
      requestDate: new Date().toISOString(),
      status: 'PENDING'
    };
    setDeletionRequests(prev => [newReq, ...prev]);
    logAudit('DELETION_REQUEST_FILED', caseId, 'CASE', `Deletion request filed by ${currentUser.name}. Reason: ${reason}`);
  };

  const reviewDeletionRequest = (id: string, decision: 'APPROVED' | 'REJECTED', justification: string) => {
    setDeletionRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: decision,
          statutoryBlockReason: justification,
          reviewedBy: currentUser.name,
          reviewedDate: new Date().toISOString()
        };
      }
      return r;
    }));
    logAudit('DELETION_REQUEST_REVIEWED', id, 'CASE', `Deletion request ${decision} by ${currentUser.name}. Justification: ${justification}`);
  };

  const submitFamilyResponse = (questionId: string, questionText: string, answerText: string) => {
    const newResp: FamilyQuestionResponse = {
      id: `RESP-${Date.now().toString().slice(-4)}`,
      questionId,
      questionText,
      answeredBy: currentUser.name,
      answerText,
      submittedAt: new Date().toISOString()
    };
    setFamilyResponses(prev => [newResp, ...prev]);
    
    // Add official receipt notification
    const ackNotif: FamilyNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      caseId: currentUser.linkedCaseId || 'MP-2026-0842',
      timestamp: new Date().toISOString(),
      title: 'Information Received & Acknowledged',
      message: `Your response regarding "${questionText.slice(0, 40)}..." has been safely received by IO ${cases[0].assignedOfficer}.`,
      type: 'DOCUMENT_ACK',
      isRead: false
    };
    setFamilyNotifications(prev => [ackNotif, ...prev]);
    logAudit('FAMILY_INFO_SUBMITTED', questionId, 'CASE', `Family member submitted clarification notes.`);
  };

  const submitFamilyAdditionalInfo = (caseId: string, info: string, photoRef?: string) => {
    const ackNotif: FamilyNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      caseId,
      timestamp: new Date().toISOString(),
      title: 'Additional Lead Recorded',
      message: `Your supplementary update "${info.slice(0, 45)}..." was logged in the case register. Thank you for your cooperation.`,
      type: 'DOCUMENT_ACK',
      isRead: false
    };
    setFamilyNotifications(prev => [ackNotif, ...prev]);
    logAudit('FAMILY_LEAD_RECORDED', caseId, 'CASE', `Family submitted supplementary information.`);
  };

  const resetDatabase = () => {
    localStorage.clear();
    setCurrentUser(SEEDED_USERS[0]);
    setCases(INITIAL_CASES);
    setPatternMatches(PATTERN_MATCHES);
    setTrafficRequests(TRAFFIC_REQUESTS);
    setEscalations(ESCALATIONS);
    setAuditLogs(AUDIT_LOGS);
    setSelectedCaseId('MP-2026-0842');
    setActivePage('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        activePage,
        setActivePage,
        selectedCaseId,
        setSelectedCaseId,
        searchQuery,
        setSearchQuery,
        selectedDistrict,
        setSelectedDistrict,
        cases,
        addCase,
        updateCase,
        addScenarioVersion,
        updateClaimStatus,
        patternMatches,
        updatePatternReview,
        trafficRequests,
        addTrafficRequest,
        updateTrafficRequestStatus,
        escalations,
        addEscalation,
        updateEscalationStatus,
        submitRecovery,
        updateRecoveryChecklist,
        closeCaseWithVerification,
        deletionRequests,
        submitDeletionRequest,
        reviewDeletionRequest,
        auditLogs,
        logAudit,
        familyNotifications,
        familyResponses,
        submitFamilyResponse,
        submitFamilyAdditionalInfo,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
