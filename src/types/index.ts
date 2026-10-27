export type UserRole = 
  | 'LOCAL_OFFICER'
  | 'DISTRICT_ADMIN'
  | 'STATE_ADMIN'
  | 'GOV_ADMIN'
  | 'FAMILY_MEMBER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  badgeNumber?: string;
  designation: string;
  stationOrDept: string;
  district: string;
  state: string;
  phone: string;
  email: string;
  avatar?: string;
  linkedCaseId?: string; // For Family Member
}

export type CaseStatus = 
  | 'NEW_REGISTERED'
  | 'INVESTIGATING'
  | 'AWAITING_VERIFICATION'
  | 'ESCALATED'
  | 'RECOVERY_REPORTED'
  | 'CLOSED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ClaimStatus = 'VERIFIED' | 'REPORTED_UNVERIFIED' | 'DISPUTED' | 'CONTRADICTED' | 'UNKNOWN';

export interface IdentifyingFeatures {
  heightCm: number;
  build: string;
  complexion: string;
  hairColor: string;
  eyeColor: string;
  distinguishingMarks: string[];
  clothingLastSeen: string;
  languagesSpoken: string[];
}

export interface FIRRecord {
  firNumber: string;
  policeStation: string;
  district: string;
  state: string;
  reportingDate: string;
  dateTimeLastSeen: string;
  lastSeenLocation: string;
  lastSeenCoordinates: [number, number]; // lat, lng
  reportingOfficer: string;
  officerBadge: string;
  originalFIRDocumentName: string;
  initialAccountSummary: string;
  isImmutable: boolean;
}

export interface CircumstanceDetails {
  eventsBeforeDisappearance: string;
  lastKnownActivities: string;
  lastKnownCommunications: string;
  travelArrangements?: string;
  employmentOrRecruitmentOffers?: string;
  knownContactsOrIntermediaries?: string[];
  witnessAccounts?: string;
  suspectedCoercionOrDeception: boolean;
  coercionIndicators?: string[];
  unresolvedDiscrepancies?: string[];
}

export interface FamilyStatement {
  id: string;
  statementText: string;
  recordedDate: string;
  sourcePerson: string;
  relationship: string;
  recordingOfficer: string;
  verificationStatus: ClaimStatus;
  supportingDocRef?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'PHOTO' | 'CCTV_CLIP' | 'CALL_RECORDS' | 'WITNESS_STATEMENT' | 'VEHICLE_RECORD' | 'TRAVEL_TICKET' | 'FORENSIC_DOC';
  title: string;
  description: string;
  source: string;
  uploaderName: string;
  uploaderRole: string;
  uploadDate: string;
  fileIntegrityHash: string; // SHA-256
  verificationStatus: ClaimStatus;
  mediaUrl?: string;
  fileSizeMb?: number;
}

export interface ScenarioVersion {
  versionNumber: number;
  modifiedAt: string;
  modifiedBy: string;
  officerRole: string;
  summary: string;
  claims: {
    id: string;
    text: string;
    sourceCitation: string;
    status: ClaimStatus;
    verifiedBy?: string;
  }[];
  changeReason: string;
}

export interface MissingPersonCase {
  id: string; // e.g., MP-2026-0842
  fullName: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  category: 'Minor' | 'Trafficking Suspected' | 'Vulnerable Adult' | 'Runaway' | 'Missing Person';
  photoUrl: string;
  status: CaseStatus;
  priority: PriorityLevel;
  registeredDate: string;
  lastUpdatedDate: string;
  
  // Jurisdiction
  policeStation: string;
  district: string;
  state: string;
  assignedOfficer: string;
  assignedOfficerContact: string;

  // Details
  identifyingFeatures: IdentifyingFeatures;
  fir: FIRRecord;
  circumstances: CircumstanceDetails;
  familyStatements: FamilyStatement[];
  evidenceList: EvidenceItem[];
  scenarioVersions: ScenarioVersion[];
  
  // AI flags
  aiRiskScore: number; // 0-100
  aiRiskFactors: string[];
  crossDistrictAlert: boolean;
  transitCorridorFlag?: string;
  isEscalated: boolean;
  escalationLevel?: 'DISTRICT' | 'STATE' | 'CENTRAL';

  // Recovery
  recoveryDetails?: RecoveryRecord;
}

export interface PatternMatch {
  id: string;
  sourceCaseId: string;
  matchedCaseId: string;
  similarityScore: number; // 0-100
  sharedIndicators: string[];
  evidenceReferences: string[];
  conflictingInformation: string[];
  missingDataNotes: string[];
  recommendedSteps: string[];
  reviewStatus: 'PENDING_REVIEW' | 'VERIFIED_LINK' | 'REJECTED_FALSE_POSITIVE';
  reviewedBy?: string;
  reviewedDate?: string;
  patternType: 'RECRUITMENT_SCAM' | 'TRANSIT_CORRIDOR' | 'SHARED_PHONE' | 'SHARED_VEHICLE' | 'SHARED_AGENT';
}

export interface SuspectEntityNode {
  id: string;
  label: string;
  type: 'CASE' | 'SUSPECT' | 'VEHICLE' | 'LOCATION' | 'PHONE' | 'AGENT';
  details: Record<string, any>;
  riskLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  district?: string;
}

export interface SuspectEntityEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  isVerified: boolean;
  evidenceRef: string;
}

export interface VideoAnalysisCandidate {
  id: string;
  timestamp: string; // "00:03:42"
  timestampSeconds: number;
  cameraLocation: string;
  cameraRef: string;
  confidenceScore: number; // e.g. 88.5
  boundingBox: { x: number; y: number; w: number; h: number };
  matchedPersonName: string;
  matchedCaseId: string;
  thumbnailUrl: string;
  verificationStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  reviewerNotes?: string;
  limitations: string;
}

export interface VehicleSighting {
  id: string;
  plateNumber: string;
  vehicleModel: string;
  color: string;
  timestamp: string;
  location: string;
  cameraRef: string;
  confidence: number;
  associatedCaseId?: string;
  status: 'SUSPICIOUS' | 'VERIFIED' | 'CLEARED';
}

export interface TrafficCameraRequest {
  id: string; // TCR-2026-0042
  caseId: string;
  caseName: string;
  incidentDate: string;
  locationName: string;
  latLng: [number, number];
  timeWindowStart: string;
  timeWindowEnd: string;
  reasonForAccess: string;
  cameraRegion: string;
  requestingOfficer: string;
  requestingStation: string;
  urgency: PriorityLevel;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'FOOTAGE_RECEIVED' | 'ANALYSIS_COMPLETED' | 'CLOSED';
  submittedDate: string;
  approvedDate?: string;
  approverNotes?: string;
  footageExtractName?: string;
  footageExtractSizeMb?: number;
}

export interface EscalationRecord {
  id: string; // ESC-2026-0012
  caseId: string;
  caseTitle: string;
  triggerReason: string;
  currentLevel: 'STATION' | 'DISTRICT' | 'STATE' | 'CENTRAL';
  targetLevel: 'DISTRICT' | 'STATE' | 'CENTRAL';
  requestedBy: string;
  requestDate: string;
  reviewDeadline: string;
  assignedAuthority: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  coordinationStations: string[];
}

export interface RecoveryRecord {
  caseId: string;
  recoveryDate: string;
  recoveryLocation: string;
  recoveringStation: string;
  authorizedOfficer: string;
  healthStatus: string;
  shelterOrGuardianHandover: string;
  hasMedicalReport: boolean;
  hasMagistrateStatement: boolean;
  hasIdentityCardVerification: boolean;
  hasOfficerInChargeSignoff: boolean;
  supportingPhotoUrl?: string;
  verificationNotes: string;
  closureStatus: 'RECOVERY_REPORTED' | 'DOCUMENTATION_PENDING' | 'VERIFICATION_IN_PROGRESS' | 'AWAITING_APPROVAL' | 'CLOSED' | 'REOPENED';
  closedDate?: string;
  approvedByAuthority?: string;
  statutoryRetentionYears: number; // e.g. 25
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: UserRole;
  targetEntityId: string;
  entityType: 'CASE' | 'SCENARIO' | 'EVIDENCE' | 'VIDEO' | 'TRAFFIC_REQUEST' | 'ESCALATION' | 'RECOVERY' | 'USER' | 'SYSTEM';
  details: string;
  ipAddress: string;
  integrityHash: string;
}

export interface FamilyNotification {
  id: string;
  caseId: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'OFFICIAL_UPDATE' | 'QUESTION_FROM_OFFICER' | 'DOCUMENT_ACK';
  isRead: boolean;
  requiresResponse?: boolean;
}

export interface FamilyQuestionResponse {
  id: string;
  questionId: string;
  questionText: string;
  answeredBy: string;
  answerText: string;
  submittedAt: string;
  attachedDocs?: string[];
}
