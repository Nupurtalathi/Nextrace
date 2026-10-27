import {
  User,
  MissingPersonCase,
  PatternMatch,
  SuspectEntityNode,
  SuspectEntityEdge,
  VideoAnalysisCandidate,
  VehicleSighting,
  TrafficCameraRequest,
  EscalationRecord,
  AuditLog,
  FamilyNotification
} from '../types';

export const SEEDED_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Inspector Rajesh Kumar',
    role: 'LOCAL_OFFICER',
    badgeNumber: 'DL-W-7842',
    designation: 'Station House Officer / Investigating Officer',
    stationOrDept: 'Tilak Nagar Police Station',
    district: 'West District',
    state: 'Delhi (NCT)',
    phone: '+91 98110 54321',
    email: 'rajesh.kumar@delhipolice.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'USR-002',
    name: 'SP Vikram Singh, IPS',
    role: 'DISTRICT_ADMIN',
    badgeNumber: 'IPS-DL-2014-41',
    designation: 'Superintendent of Police / District In-Charge',
    stationOrDept: 'West District Police Headquarters',
    district: 'West District',
    state: 'Delhi (NCT)',
    phone: '+91 98110 99882',
    email: 'sp.west@delhipolice.gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'USR-003',
    name: 'ADGP Priya Sharma, IPS',
    role: 'STATE_ADMIN',
    badgeNumber: 'IPS-CID-2005-18',
    designation: 'Additional Director General of Police (Crime & AHTU)',
    stationOrDept: 'State Crime Investigation Dept (CID) / Anti-Human Trafficking',
    district: 'All Districts',
    state: 'Delhi (NCT)',
    phone: '+91 98110 11223',
    email: 'adgp.crime@delhipolice.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'USR-004',
    name: 'Joint Secy. Anita Deshmukh, IAS',
    role: 'GOV_ADMIN',
    badgeNumber: 'MHA-AHT-08',
    designation: 'Joint Secretary (Internal Security & Inter-State Coordination)',
    stationOrDept: 'Ministry of Home Affairs / National AHT Coordination Cell',
    district: 'National Scope',
    state: 'Government of India',
    phone: '+91 11 2309 2000',
    email: 'jsec.is@mha.gov.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'USR-005',
    name: 'Sunita Verma',
    role: 'FAMILY_MEMBER',
    designation: 'Verified Kin / Mother of Missing Minor',
    stationOrDept: 'Registered Family Portal',
    district: 'West District',
    state: 'Delhi (NCT)',
    phone: '+91 98712 34567',
    email: 'sunita.verma.family@demo.in',
    linkedCaseId: 'MP-2026-0842',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
  }
];

export const INITIAL_CASES: MissingPersonCase[] = [
  {
    id: 'MP-2026-0842',
    fullName: 'Priya Verma',
    age: 16,
    gender: 'Female',
    category: 'Minor',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    status: 'INVESTIGATING',
    priority: 'CRITICAL',
    registeredDate: '2026-10-21T10:15:00Z',
    lastUpdatedDate: '2026-10-27T08:30:00Z',
    policeStation: 'Tilak Nagar Police Station',
    district: 'West District',
    state: 'Delhi (NCT)',
    assignedOfficer: 'Inspector Rajesh Kumar (DL-W-7842)',
    assignedOfficerContact: '+91 98110 54321',
    aiRiskScore: 89,
    aiRiskFactors: [
      'Minor female below 18 years',
      'Sudden cessation of active SIM card at transit terminal',
      'Unverified garment factory placement offer',
      'Cross-district vehicle sighting in CCTV toll plaza',
      'Shared recruiter contact linked to Meerut FIR 2026-312'
    ],
    crossDistrictAlert: true,
    transitCorridorFlag: 'Delhi - Ghaziabad - Meerut Corridor (NH-24)',
    isEscalated: true,
    escalationLevel: 'DISTRICT',
    identifyingFeatures: {
      heightCm: 154,
      build: 'Slim',
      complexion: 'Wheatish',
      hairColor: 'Black, shoulder-length',
      eyeColor: 'Dark Brown',
      distinguishingMarks: ['Small circular burn mark on left forearm', 'Scar over right eyebrow'],
      clothingLastSeen: 'Navy blue school uniform salwar kameez with white dupatta',
      languagesSpoken: ['Hindi', 'Basic English']
    },
    fir: {
      firNumber: 'FIR No. 412/2026 u/s 137(2) BNS (Kidnapping of Minor)',
      policeStation: 'Tilak Nagar PS',
      district: 'West District',
      state: 'Delhi (NCT)',
      reportingDate: '2026-10-21T14:30:00Z',
      dateTimeLastSeen: '2026-10-21T08:45:00Z',
      lastSeenLocation: 'Tilak Nagar Metro Station Exit Gate 3, Subhash Nagar Road',
      lastSeenCoordinates: [28.6366, 77.0963],
      reportingOfficer: 'SI Manoj Tewari',
      officerBadge: 'DL-W-4109',
      originalFIRDocumentName: 'FIR_412_2026_TILAK_NAGAR_SIGNED.pdf',
      initialAccountSummary: 'Complainant Sunita Verma stated that her minor daughter Priya Verma left home for government school at 08:00 AM on 21.10.2026. She did not return by 02:00 PM. School authorities confirmed she did not attend morning assembly. Mobile phone switched off since 09:12 AM.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Priya attended tuition classes previous evening. Sibling reported she mentioned a new friend named "Pooja Didi" who offered free computer coaching and retail job in Gurugram.',
      lastKnownActivities: 'Boarded Blue Line Metro at Subhash Nagar station using smartcard #78192301 at 08:22 AM. Exit logged at Anand Vihar ISBT Metro station at 09:08 AM.',
      lastKnownCommunications: 'Incoming call from unlisted prepaid number +91 98765 43210 at 09:02 AM lasting 114 seconds.',
      travelArrangements: 'Anand Vihar Inter-State Bus Terminal footage shows interaction with middle-aged woman wearing red shawl.',
      employmentOrRecruitmentOffers: 'Handwritten slip found in school bag promising ₹18,000/month as retail cashier, no experience needed.',
      knownContactsOrIntermediaries: ['"Pooja Didi" (Suspected broker alias)', 'Ramesh Kumar (Sim owner of +91 98765 43210)'],
      witnessAccounts: 'Tea stall vendor outside Anand Vihar Gate 4 remembers young girl matching description boarding white commercial van with UP registration.',
      suspectedCoercionOrDeception: true,
      coercionIndicators: ['Fake recruitment offer', 'Rapid relocation to transit hub', 'Immediate communication blackout'],
      unresolvedDiscrepancies: ['Metro CCTV shows subject walking voluntarily, but telephone tower dump shows van moving rapidly towards Ghaziabad border within 20 mins.']
    },
    familyStatements: [
      {
        id: 'FS-001',
        statementText: 'Priya never traveled alone past Rajouri Garden. She was anxious about family finances and kept saying she will get a big job before Diwali to help her brother fees. She had no boyfriend and never went anywhere without telling her mother.',
        recordedDate: '2026-10-21T18:00:00Z',
        sourcePerson: 'Sunita Verma',
        relationship: 'Mother',
        recordingOfficer: 'Inspector Rajesh Kumar',
        verificationStatus: 'VERIFIED',
        supportingDocRef: 'Statement_Recorded_Under_Sec_180_BNSS.pdf'
      },
      {
        id: 'FS-002',
        statementText: 'Priya mentioned three days earlier that someone contacted her via Instagram offering modeling/promotional work in Noida Sector 62.',
        recordedDate: '2026-10-23T11:20:00Z',
        sourcePerson: 'Amit Verma',
        relationship: 'Elder Brother',
        recordingOfficer: 'SI Manoj Tewari',
        verificationStatus: 'REPORTED_UNVERIFIED',
        supportingDocRef: 'Screenshot_Instagram_Chat_Dump.jpg'
      }
    ],
    evidenceList: [
      {
        id: 'EVD-001',
        type: 'PHOTO',
        title: 'Recent Clear School Identity Photograph',
        description: 'Frontal high-resolution portrait taken during class 10 registration.',
        source: 'Mother (Sunita Verma)',
        uploaderName: 'Inspector Rajesh Kumar',
        uploaderRole: 'LOCAL_OFFICER',
        uploadDate: '2026-10-21T15:00:00Z',
        fileIntegrityHash: '9a3f81b7e4112ac065b2049d5cbf29a1e7b45821f009d1348c2317ef5d1902bb',
        verificationStatus: 'VERIFIED',
        mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
        fileSizeMb: 2.4
      },
      {
        id: 'EVD-002',
        type: 'CCTV_CLIP',
        title: 'Anand Vihar ISBT Gate 4 Exit Footage',
        description: 'CCTV clip showing subject at 09:18 AM talking to woman in red shawl and entering Maruti Omni DL-8C-AK-4412.',
        source: 'Delhi Integrated Transit System (DIMTS)',
        uploaderName: 'Inspector Rajesh Kumar',
        uploaderRole: 'LOCAL_OFFICER',
        uploadDate: '2026-10-22T09:40:00Z',
        fileIntegrityHash: '4e29b119a773cf29801ecbfa552b0479101f37ccb8393859d044e311029e2fa8',
        verificationStatus: 'VERIFIED',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fileSizeMb: 48.6
      },
      {
        id: 'EVD-003',
        type: 'CALL_RECORDS',
        title: 'Call Detail Record (CDR) Tower Dump - Shahdara & Anand Vihar',
        description: 'CDR extraction of target IMEI 861942058192019 showing last ping at NH-24 Ghazipur border tower at 09:34 AM.',
        source: 'Nodal Cyber Cell, Delhi Police',
        uploaderName: 'Cyber SI Alok Nath',
        uploaderRole: 'LOCAL_OFFICER',
        uploadDate: '2026-10-22T14:15:00Z',
        fileIntegrityHash: 'c772e01b3fa109405d41bcff8921a884d31019cfef9099990141b764201019ab',
        verificationStatus: 'VERIFIED',
        fileSizeMb: 12.1
      }
    ],
    scenarioVersions: [
      {
        versionNumber: 1,
        modifiedAt: '2026-10-21T14:35:00Z',
        modifiedBy: 'SI Manoj Tewari',
        officerRole: 'LOCAL_OFFICER',
        summary: 'Initial scenario recorded strictly as per FIR: Minor left for school at 08:00 AM, failed to return, phone dead by 09:12 AM.',
        changeReason: 'Initial FIR ingestion into NEXUS database.',
        claims: [
          {
            id: 'CLM-01',
            text: 'Subject left home in Tilak Nagar at 08:00 AM wearing school uniform.',
            sourceCitation: 'FIR No. 412/2026 Para 2',
            status: 'VERIFIED',
            verifiedBy: 'SI Manoj Tewari'
          },
          {
            id: 'CLM-02',
            text: 'Subject did not arrive at Government Girls Senior Secondary School.',
            sourceCitation: 'Principal Attendance Register Exhibit-A',
            status: 'VERIFIED',
            verifiedBy: 'SI Manoj Tewari'
          },
          {
            id: 'CLM-03',
            text: 'Mobile phone switched off at 09:12 AM.',
            sourceCitation: 'FIR No. 412/2026 Para 3',
            status: 'VERIFIED',
            verifiedBy: 'SI Manoj Tewari'
          }
        ]
      },
      {
        versionNumber: 2,
        modifiedAt: '2026-10-22T16:00:00Z',
        modifiedBy: 'Inspector Rajesh Kumar',
        officerRole: 'LOCAL_OFFICER',
        summary: 'Incorporated Metro Smartcard transaction logs, Anand Vihar CCTV and Telecom Tower Dump.',
        changeReason: 'Technical evidence verified through Delhi Metro and Telecom Nodal Officer.',
        claims: [
          {
            id: 'CLM-04',
            text: 'Subject boarded Subhash Nagar Metro at 08:22 AM and deboarded at Anand Vihar ISBT at 09:08 AM.',
            sourceCitation: 'DMRC Smartcard Server Audit Log #78192301',
            status: 'VERIFIED',
            verifiedBy: 'Inspector Rajesh Kumar'
          },
          {
            id: 'CLM-05',
            text: 'Subject made contact with unverified woman and boarded White Maruti Omni DL-8C-AK-4412.',
            sourceCitation: 'CCTV Camera #AV-ISBT-04 at 09:18 AM',
            status: 'VERIFIED',
            verifiedBy: 'Inspector Rajesh Kumar'
          },
          {
            id: 'CLM-06',
            text: 'Vehicle crossed Ghazipur Toll Plaza into Ghaziabad (Uttar Pradesh) at 09:41 AM.',
            sourceCitation: 'FASTag Log ID NH24-91823',
            status: 'VERIFIED',
            verifiedBy: 'Inspector Rajesh Kumar'
          },
          {
            id: 'CLM-07',
            text: 'Subject was lured by fraudulent computer job scheme operated by "Pooja Didi".',
            sourceCitation: 'Mother statement & handwritten note',
            status: 'REPORTED_UNVERIFIED'
          }
        ]
      }
    ]
  },
  {
    id: 'MP-2026-0791',
    fullName: 'Aarav Sharma',
    age: 14,
    gender: 'Male',
    category: 'Minor',
    photoUrl: 'https://images.unsplash.com/photo-1545696968-1a5245650b36?auto=format&fit=crop&q=80&w=300',
    status: 'AWAITING_VERIFICATION',
    priority: 'HIGH',
    registeredDate: '2026-10-18T16:20:00Z',
    lastUpdatedDate: '2026-10-26T14:10:00Z',
    policeStation: 'Old Delhi Railway Police Station',
    district: 'North District',
    state: 'Delhi (NCT)',
    assignedOfficer: 'Inspector Harish Chandra (DL-N-1204)',
    assignedOfficerContact: '+91 98110 33445',
    aiRiskScore: 78,
    aiRiskFactors: [
      'Minor male from marginalized economic background',
      'Reported recruitment for sweet factory packaging in Alwar, Rajasthan',
      'Missing from railway station platform 4',
      'Shared intermediary "Ramesh / Tiger" mentioned in statement'
    ],
    crossDistrictAlert: true,
    transitCorridorFlag: 'Delhi - Haryana - Rajasthan Railway Corridor',
    isEscalated: false,
    identifyingFeatures: {
      heightCm: 148,
      build: 'Medium',
      complexion: 'Fair',
      hairColor: 'Black, short',
      eyeColor: 'Black',
      distinguishingMarks: ['Mole on right collarbone'],
      clothingLastSeen: 'Red t-shirt and grey track pants with slippers',
      languagesSpoken: ['Hindi']
    },
    fir: {
      firNumber: 'FIR No. 289/2026 u/s 137(2) BNS',
      policeStation: 'Old Delhi Railway PS',
      district: 'North District',
      state: 'Delhi (NCT)',
      reportingDate: '2026-10-18T18:00:00Z',
      dateTimeLastSeen: '2026-10-18T14:30:00Z',
      lastSeenLocation: 'Old Delhi Railway Station, Platform 4 Near Waiting Hall',
      lastSeenCoordinates: [28.6619, 77.2280],
      reportingOfficer: 'SI Rakesh Dogra',
      officerBadge: 'DL-GRP-319',
      originalFIRDocumentName: 'FIR_289_2026_OLD_DELHI_RLY.pdf',
      initialAccountSummary: 'Father stated Aarav went with uncle to station to fetch goods and disappeared during train rush.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Family reported stranger approached boy near Chandni Chowk wholesale market offering ₹600/day for warehouse loading.',
      lastKnownActivities: 'Seen walking with tall man in white kurta on CCTV platform 4.',
      lastKnownCommunications: 'No phone carried by minor.',
      suspectedCoercionOrDeception: true,
      coercionIndicators: ['Unlicensed youth recruitment', 'Cash advance promised to acquaintance']
    },
    familyStatements: [],
    evidenceList: [],
    scenarioVersions: []
  },
  {
    id: 'MP-2026-0914',
    fullName: 'Meena Kumari',
    age: 19,
    gender: 'Female',
    category: 'Trafficking Suspected',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    status: 'INVESTIGATING',
    priority: 'CRITICAL',
    registeredDate: '2026-10-23T11:40:00Z',
    lastUpdatedDate: '2026-10-27T06:15:00Z',
    policeStation: 'Ghaziabad Kotwali Police Station',
    district: 'Ghaziabad',
    state: 'Uttar Pradesh',
    assignedOfficer: 'CO Shailendra Pratap (UP-GZB-881)',
    assignedOfficerContact: '+91 94544 01234',
    aiRiskScore: 92,
    aiRiskFactors: [
      'Identical fake boutique placement racket',
      'Shared phone number contact (+91 98765 43210) with Delhi MP-2026-0842',
      'Shared transit vehicle plate DL-8C-AK-4412 logged at Meerut Road toll',
      'Inter-state trafficking syndicate indicators'
    ],
    crossDistrictAlert: true,
    transitCorridorFlag: 'Delhi - Ghaziabad - Meerut Corridor (NH-24)',
    isEscalated: true,
    escalationLevel: 'STATE',
    identifyingFeatures: {
      heightCm: 160,
      build: 'Medium',
      complexion: 'Wheatish',
      hairColor: 'Black, braided',
      eyeColor: 'Brown',
      distinguishingMarks: ['Tattoo with word "Maa" in Devanagari on right wrist'],
      clothingLastSeen: 'Yellow kurti and white leggings with black purse',
      languagesSpoken: ['Hindi']
    },
    fir: {
      firNumber: 'FIR No. 719/2026 u/s 143 BNS (Trafficking of Persons)',
      policeStation: 'Kotwali Ghaziabad PS',
      district: 'Ghaziabad',
      state: 'Uttar Pradesh',
      reportingDate: '2026-10-23T14:00:00Z',
      dateTimeLastSeen: '2026-10-23T09:15:00Z',
      lastSeenLocation: 'Old Bus Stand, Near Mohan Nagar flyover, Ghaziabad',
      lastSeenCoordinates: [28.6757, 77.3826],
      reportingOfficer: 'Inspector V.K. Tyagi',
      officerBadge: 'UP-GZB-441',
      originalFIRDocumentName: 'FIR_719_2026_GHAZIABAD_KOTWALI.pdf',
      initialAccountSummary: 'Victim Meena Kumari did not return from a mock interview arranged by an agent named "Tiger". Family received call from unknown number demanding withdrawal of complaints.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Contacted through local beauty parlour notice board in Vijay Nagar.',
      lastKnownActivities: 'Boarded white Maruti Omni after waiting near metro pillar 142.',
      lastKnownCommunications: 'Calls received from +91 98765 43210 (same number as Priya Verma case).',
      suspectedCoercionOrDeception: true,
      coercionIndicators: ['Same recruiter alias', 'Same vehicle number', 'High probability of inter-state syndicate']
    },
    familyStatements: [],
    evidenceList: [],
    scenarioVersions: []
  },
  {
    id: 'MP-2026-0650',
    fullName: 'Rahul Mehra',
    age: 17,
    gender: 'Male',
    category: 'Vulnerable Adult',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    status: 'INVESTIGATING',
    priority: 'MEDIUM',
    registeredDate: '2026-10-12T09:00:00Z',
    lastUpdatedDate: '2026-10-24T12:00:00Z',
    policeStation: 'Janakpuri Police Station',
    district: 'West District',
    state: 'Delhi (NCT)',
    assignedOfficer: 'SI Ankit Solanki (DL-W-552)',
    assignedOfficerContact: '+91 98110 77665',
    aiRiskScore: 45,
    aiRiskFactors: [
      'Left after academic disagreement with parents',
      'ATM withdrawal logged at Jaipur Sindhi Camp bus stand',
      'No trafficking indicators detected'
    ],
    crossDistrictAlert: false,
    isEscalated: false,
    identifyingFeatures: {
      heightCm: 172,
      build: 'Athletic',
      complexion: 'Fair',
      hairColor: 'Black, spike cut',
      eyeColor: 'Brown',
      distinguishingMarks: ['Glasses with black rectangular frame'],
      clothingLastSeen: 'Black hoodie, blue jeans, white sneakers',
      languagesSpoken: ['Hindi', 'English']
    },
    fir: {
      firNumber: 'FIR No. 340/2026 u/s 137(2) BNS',
      policeStation: 'Janakpuri PS',
      district: 'West District',
      state: 'Delhi (NCT)',
      reportingDate: '2026-10-12T11:00:00Z',
      dateTimeLastSeen: '2026-10-11T20:30:00Z',
      lastSeenLocation: 'District Centre Janakpuri, West Delhi',
      lastSeenCoordinates: [28.6297, 77.0818],
      reportingOfficer: 'SI Ankit Solanki',
      officerBadge: 'DL-W-552',
      originalFIRDocumentName: 'FIR_340_2026_JANAKPURI.pdf',
      initialAccountSummary: 'Boy left house with backpack after argument over pre-board exam scores.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Argument over career choices.',
      lastKnownActivities: 'Withdrew ₹5,000 from SBI ATM at Sindhi Camp, Jaipur.',
      lastKnownCommunications: 'Sent WhatsApp text "I need some time alone, do not worry" to cousin.',
      suspectedCoercionOrDeception: false
    },
    familyStatements: [],
    evidenceList: [],
    scenarioVersions: []
  },
  {
    id: 'MP-2026-0522',
    fullName: 'Sunita Devi',
    age: 28,
    gender: 'Female',
    category: 'Vulnerable Adult',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    status: 'RECOVERY_REPORTED',
    priority: 'MEDIUM',
    registeredDate: '2026-09-28T14:30:00Z',
    lastUpdatedDate: '2026-10-26T17:00:00Z',
    policeStation: 'Sector 39 Police Station',
    district: 'Gautam Buddha Nagar (Noida)',
    state: 'Uttar Pradesh',
    assignedOfficer: 'Inspector Neeraj Kumar (UP-GBN-301)',
    assignedOfficerContact: '+91 94544 55667',
    aiRiskScore: 32,
    aiRiskFactors: ['Domestic discord', 'Recovery verification documents awaiting judicial signoff'],
    crossDistrictAlert: false,
    isEscalated: false,
    identifyingFeatures: {
      heightCm: 158,
      build: 'Average',
      complexion: 'Wheatish',
      hairColor: 'Black',
      eyeColor: 'Black',
      distinguishingMarks: ['Small mole on left cheek'],
      clothingLastSeen: 'Green cotton saree',
      languagesSpoken: ['Hindi']
    },
    fir: {
      firNumber: 'FIR No. 512/2026 u/s 140 BNS',
      policeStation: 'Sector 39 PS',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      reportingDate: '2026-09-28T16:00:00Z',
      dateTimeLastSeen: '2026-09-28T09:00:00Z',
      lastSeenLocation: 'Botanical Garden Metro Station, Noida',
      lastSeenCoordinates: [28.5645, 77.3343],
      reportingOfficer: 'SI Prem Chandra',
      officerBadge: 'UP-GBN-109',
      originalFIRDocumentName: 'FIR_512_2026_NOIDA_SEC39.pdf',
      initialAccountSummary: 'Husband reported wife went missing after visiting maternal uncle in Mayur Vihar.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Voluntarily moved to elder sister residence in Mathura.',
      lastKnownActivities: 'Traced to safe accommodation.',
      lastKnownCommunications: 'Contacted investigating officer directly.',
      suspectedCoercionOrDeception: false
    },
    recoveryDetails: {
      caseId: 'MP-2026-0522',
      recoveryDate: '2026-10-25T15:00:00Z',
      recoveryLocation: 'Mathura Town, Mathura District, UP',
      recoveringStation: 'Mathura City Kotwali PS',
      authorizedOfficer: 'Inspector Neeraj Kumar (UP-GBN-301)',
      healthStatus: 'Physically safe and medically fit',
      shelterOrGuardianHandover: 'Safe shelter accommodation under Women Helpline supervision',
      hasMedicalReport: true,
      hasMagistrateStatement: true,
      hasIdentityCardVerification: true,
      hasOfficerInChargeSignoff: false,
      verificationNotes: 'Subject appeared before SDM Mathura. Confirmed no coercion or abduction. Stated she left voluntarily due to domestic conflict.',
      closureStatus: 'AWAITING_APPROVAL',
      statutoryRetentionYears: 10
    },
    familyStatements: [],
    evidenceList: [],
    scenarioVersions: []
  },
  {
    id: 'MP-2026-0410',
    fullName: 'Deepa Patel',
    age: 15,
    gender: 'Female',
    category: 'Minor',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    status: 'CLOSED',
    priority: 'LOW',
    registeredDate: '2026-07-14T11:00:00Z',
    lastUpdatedDate: '2026-08-30T10:00:00Z',
    policeStation: 'Surat City Crime Branch',
    district: 'Surat',
    state: 'Gujarat',
    assignedOfficer: 'PI K.D. Zala (GJ-SUR-901)',
    assignedOfficerContact: '+91 99250 11223',
    aiRiskScore: 12,
    aiRiskFactors: ['Case safely recovered and closed under POCSO/JJ Act protocols'],
    crossDistrictAlert: true,
    isEscalated: false,
    identifyingFeatures: {
      heightCm: 152,
      build: 'Slim',
      complexion: 'Fair',
      hairColor: 'Black',
      eyeColor: 'Brown',
      distinguishingMarks: ['Birthmark on neck'],
      clothingLastSeen: 'Traditional dress',
      languagesSpoken: ['Gujarati', 'Hindi']
    },
    fir: {
      firNumber: 'FIR No. 198/2026 u/s 137(2) BNS',
      policeStation: 'Varachha PS, Surat',
      district: 'Surat',
      state: 'Gujarat',
      reportingDate: '2026-07-14T13:00:00Z',
      dateTimeLastSeen: '2026-07-14T07:30:00Z',
      lastSeenLocation: 'Varachha Main Road, Surat',
      lastSeenCoordinates: [21.2185, 72.8596],
      reportingOfficer: 'PSI R.B. Jadeja',
      officerBadge: 'GJ-SUR-311',
      originalFIRDocumentName: 'FIR_198_2026_SURAT_VARACHHA.pdf',
      initialAccountSummary: 'Minor girl missing from outside coaching institute.',
      isImmutable: true
    },
    circumstances: {
      eventsBeforeDisappearance: 'Trafficking ring intercepted at Vadodara Railway Junction.',
      lastKnownActivities: 'Safely rescued by Joint Anti-Human Trafficking Unit.',
      lastKnownCommunications: 'Rescued within 36 hours.',
      suspectedCoercionOrDeception: true
    },
    recoveryDetails: {
      caseId: 'MP-2026-0410',
      recoveryDate: '2026-07-16T08:30:00Z',
      recoveryLocation: 'Platform 2, Vadodara Junction Railway Station',
      recoveringStation: 'Vadodara Railway Police',
      authorizedOfficer: 'PI K.D. Zala (GJ-SUR-901)',
      healthStatus: 'Fit and uninjured',
      shelterOrGuardianHandover: 'Safely handed over to parents under CWC Surat order #SUR-CWC-2026-88',
      hasMedicalReport: true,
      hasMagistrateStatement: true,
      hasIdentityCardVerification: true,
      hasOfficerInChargeSignoff: true,
      verificationNotes: 'All 4 statutory closure conditions fulfilled. Rescued along with 2 other minors. Accused arrested under Section 143 BNS and POCSO Act.',
      closureStatus: 'CLOSED',
      closedDate: '2026-08-30T10:00:00Z',
      approvedByAuthority: 'Superintendent of Police / CMM Surat',
      statutoryRetentionYears: 25
    },
    familyStatements: [],
    evidenceList: [],
    scenarioVersions: []
  }
];

export const PATTERN_MATCHES: PatternMatch[] = [
  {
    id: 'PAT-2026-01',
    sourceCaseId: 'MP-2026-0842',
    matchedCaseId: 'MP-2026-0914',
    similarityScore: 94,
    patternType: 'RECRUITMENT_SCAM',
    sharedIndicators: [
      'Same target demographic: Minor / Young adult female seeking first employment',
      'Identical recruitment scheme: Hand-distributed slips for boutique cashier/receptionist',
      'Shared phone number: +91 98765 43210 (Ramesh Kumar / "Tiger")',
      'Shared transit vehicle: White Maruti Omni (DL-8C-AK-4412)',
      'Identical transit corridor: NH-24 corridor into Western Uttar Pradesh within 48 hours of disappearance'
    ],
    evidenceReferences: [
      'Delhi Tilak Nagar FIR 412/2026 CDR Dump Exhibit C-1',
      'Ghaziabad Kotwali FIR 719/2026 Case Diary Para 4',
      'NH-24 Toll FASTag Transaction #91823 vs #92401'
    ],
    conflictingInformation: [
      'Priya Verma is 16 (school uniform), Meena Kumari is 19 (casual wear)',
      'Initial boarding points differ: Anand Vihar ISBT (Delhi) vs Mohan Nagar (Ghaziabad)'
    ],
    missingDataNotes: [
      'Tower dump for intermediate transit through Hapur currently awaiting UP Telecom Cell clearance',
      'Owner registration of DL-8C-AK-4412 shows address in Seelampur under deceased individual'
    ],
    recommendedSteps: [
      'Issue immediate joint alert between West Delhi AHTU and Ghaziabad Special Task Force',
      'Request automated ANPR camera tracking on NH-24, NH-58 and Eastern Peripheral Expressway',
      'Escalate to State Police CID for inter-state Joint Investigation Team (JIT)'
    ],
    reviewStatus: 'VERIFIED_LINK',
    reviewedBy: 'SP Vikram Singh, IPS (District Admin)',
    reviewedDate: '2026-10-24T17:00:00Z'
  },
  {
    id: 'PAT-2026-02',
    sourceCaseId: 'MP-2026-0842',
    matchedCaseId: 'MP-2026-0791',
    similarityScore: 76,
    patternType: 'SHARED_AGENT',
    sharedIndicators: [
      'Broker alias "Ramesh / Tiger" mentioned in witness accounts at both terminals',
      'Disappearance window within 72 hours of each other',
      'Proximity of transit hubs: Anand Vihar ISBT and Old Delhi Railway Station'
    ],
    evidenceReferences: [
      'Witness statement of tea vendor at Old Delhi PF 4',
      'Statement of Priya Verma mother referencing phone contacts'
    ],
    conflictingInformation: [
      'Target gender differs (Female vs Male)',
      'Reported destinations differ: Garment factory vs Sweet packaging warehouse'
    ],
    missingDataNotes: [
      'No photographic CCTV confirmation of suspect at Old Delhi PF 4 due to camera maintenance outage'
    ],
    recommendedSteps: [
      'Cross-examine tea vendor with photo array of suspect Ramesh Kumar',
      'Inspect passenger reservation logs for sleeper trains to Alwar and Meerut'
    ],
    reviewStatus: 'PENDING_REVIEW'
  }
];

export const SUSPECT_NODES: SuspectEntityNode[] = [
  {
    id: 'MP-2026-0842',
    label: 'Priya Verma (16F)',
    type: 'CASE',
    riskLevel: 'CRITICAL',
    district: 'West District, Delhi',
    details: {
      status: 'INVESTIGATING',
      fir: 'FIR 412/2026 Tilak Nagar PS',
      lastSeen: 'Anand Vihar ISBT 21.10.2026'
    }
  },
  {
    id: 'MP-2026-0914',
    label: 'Meena Kumari (19F)',
    type: 'CASE',
    riskLevel: 'CRITICAL',
    district: 'Ghaziabad, UP',
    details: {
      status: 'INVESTIGATING',
      fir: 'FIR 719/2026 Ghaziabad Kotwali',
      lastSeen: 'Mohan Nagar 23.10.2026'
    }
  },
  {
    id: 'MP-2026-0791',
    label: 'Aarav Sharma (14M)',
    type: 'CASE',
    riskLevel: 'HIGH',
    district: 'North District, Delhi',
    details: {
      status: 'AWAITING_VERIFICATION',
      fir: 'FIR 289/2026 Old Delhi Rly PS',
      lastSeen: 'Old Delhi Platform 4'
    }
  },
  {
    id: 'SUSP-01',
    label: 'Ramesh Kumar (Alias: "Tiger")',
    type: 'SUSPECT',
    riskLevel: 'CRITICAL',
    district: 'Western UP / Delhi Border',
    details: {
      alias: 'Tiger / Ramesh Bhai',
      status: 'Person of Investigative Interest',
      linkedFIRs: ['Delhi Tilak Nagar 412/2026', 'UP Kotwali 719/2026', 'Meerut AHTU 312/2025'],
      knownModus: 'Fake employment broker for garment units and catering'
    }
  },
  {
    id: 'SUSP-02',
    label: '"Pooja Didi" (Unidentified Female)',
    type: 'AGENT',
    riskLevel: 'HIGH',
    district: 'Trans-Yamuna, Delhi',
    details: {
      description: 'Woman in red shawl, age approx 35-40 yrs',
      role: 'Recruiter / Facilitator at transit points'
    }
  },
  {
    id: 'VEH-01',
    label: 'DL-8C-AK-4412 (Maruti Omni)',
    type: 'VEHICLE',
    riskLevel: 'CRITICAL',
    district: 'Inter-State Transit',
    details: {
      model: 'White Maruti Omni Van',
      registeredTo: 'Dharamveer (Deceased address)',
      fastagPassings: ['Ghazipur Toll 09:41', 'Chhajarsi Toll 10:18']
    }
  },
  {
    id: 'LOC-01',
    label: 'Anand Vihar ISBT & Metro Hub',
    type: 'LOCATION',
    riskLevel: 'HIGH',
    district: 'Shahdara, Delhi',
    details: {
      type: 'Major Inter-State Transit Node',
      activeCasesSighted: 2
    }
  },
  {
    id: 'LOC-02',
    label: 'Meerut Industrial Garment Hub',
    type: 'LOCATION',
    riskLevel: 'CRITICAL',
    district: 'Meerut, UP',
    details: {
      type: 'Suspected Destination Cluster',
      historicalSyndicateLinks: 4
    }
  },
  {
    id: 'PHN-01',
    label: '+91 98765 43210 (Burner SIM)',
    type: 'PHONE',
    riskLevel: 'CRITICAL',
    district: 'Prepaid SIM Roaming',
    details: {
      subscriber: 'Ramesh Kumar (Fake ID)',
      activationDate: '2026-10-01'
    }
  }
];

export const SUSPECT_EDGES: SuspectEntityEdge[] = [
  {
    id: 'E-01',
    source: 'MP-2026-0842',
    target: 'LOC-01',
    relation: 'Last seen deboarding metro',
    isVerified: true,
    evidenceRef: 'DMRC Smartcard Server Log #78192301'
  },
  {
    id: 'E-02',
    source: 'MP-2026-0842',
    target: 'SUSP-02',
    relation: 'Seen speaking with at Gate 4',
    isVerified: true,
    evidenceRef: 'CCTV Camera #AV-ISBT-04 at 09:18 AM'
  },
  {
    id: 'E-03',
    source: 'SUSP-02',
    target: 'VEH-01',
    relation: 'Escorted subject into van',
    isVerified: true,
    evidenceRef: 'CCTV Camera #AV-ISBT-04 at 09:19 AM'
  },
  {
    id: 'E-04',
    source: 'MP-2026-0842',
    target: 'PHN-01',
    relation: 'Incoming call received at 09:02 AM',
    isVerified: true,
    evidenceRef: 'Nodal CDR Tower Dump Shahdara'
  },
  {
    id: 'E-05',
    source: 'PHN-01',
    target: 'SUSP-01',
    relation: 'Registered subscriber & user',
    isVerified: true,
    evidenceRef: 'Telecom CAF document & IMEI linkage'
  },
  {
    id: 'E-06',
    source: 'MP-2026-0914',
    target: 'PHN-01',
    relation: 'Calls received prior to vanishing',
    isVerified: true,
    evidenceRef: 'Ghaziabad Kotwali Case Diary #719'
  },
  {
    id: 'E-07',
    source: 'MP-2026-0914',
    target: 'VEH-01',
    relation: 'Same vehicle spotted picking subject',
    isVerified: true,
    evidenceRef: 'Mohan Nagar traffic camera #MN-09'
  },
  {
    id: 'E-08',
    source: 'VEH-01',
    target: 'LOC-02',
    relation: 'FASTag toll log towards Meerut',
    isVerified: true,
    evidenceRef: 'NH-24 Toll FASTag ID #91823'
  },
  {
    id: 'E-09',
    source: 'MP-2026-0791',
    target: 'SUSP-01',
    relation: 'AI-suggested link: Recruiter alias',
    isVerified: false,
    evidenceRef: 'Witness report Old Delhi PF 4 (Unverified)'
  }
];

export const VIDEO_CANDIDATES: VideoAnalysisCandidate[] = [
  {
    id: 'VAC-01',
    timestamp: '00:03:42',
    timestampSeconds: 222,
    cameraLocation: 'Anand Vihar ISBT Terminal Exit Gate 4',
    cameraRef: 'CAM-DTS-AV-04',
    confidenceScore: 89.4,
    boundingBox: { x: 38, y: 24, w: 22, h: 48 },
    matchedPersonName: 'Priya Verma (MP-2026-0842)',
    matchedCaseId: 'MP-2026-0842',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    verificationStatus: 'CONFIRMED',
    reviewerNotes: 'Verified by IO Rajesh Kumar. Distinct blue salwar kameez and facial contours match reference school photo.',
    limitations: 'Camera angle is 35-degree diagonal. Mild backlight flare from terminal glass facade.'
  },
  {
    id: 'VAC-02',
    timestamp: '00:07:15',
    timestampSeconds: 435,
    cameraLocation: 'NH-24 Ghazipur Border Toll Plaza Lane 3',
    cameraRef: 'CAM-NHAI-GZB-03',
    confidenceScore: 74.8,
    boundingBox: { x: 52, y: 30, w: 18, h: 36 },
    matchedPersonName: 'Priya Verma (MP-2026-0842)',
    matchedCaseId: 'MP-2026-0842',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    verificationStatus: 'PENDING',
    reviewerNotes: 'Co-passenger inside white Maruti Omni matching plate DL-8C-AK-4412. Window tinted.',
    limitations: 'Low resolution frame crop at 60km/h passing speed. Tinted glass reflection.'
  },
  {
    id: 'VAC-03',
    timestamp: '00:12:08',
    timestampSeconds: 728,
    cameraLocation: 'Mohan Nagar Flyover Junction, Ghaziabad',
    cameraRef: 'CAM-GZB-TRF-14',
    confidenceScore: 86.1,
    boundingBox: { x: 44, y: 22, w: 20, h: 44 },
    matchedPersonName: 'Meena Kumari (MP-2026-0914)',
    matchedCaseId: 'MP-2026-0914',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verificationStatus: 'CONFIRMED',
    reviewerNotes: 'Subject seen boarding white Maruti Omni. Tattoo on right wrist confirmed.',
    limitations: 'Night vision infrared mode active; partial color desaturation.'
  }
];

export const VEHICLE_SIGHTINGS: VehicleSighting[] = [
  {
    id: 'VS-01',
    plateNumber: 'DL-8C-AK-4412',
    vehicleModel: 'Maruti Suzuki Omni',
    color: 'White',
    timestamp: '2026-10-21 09:19 AM',
    location: 'Anand Vihar ISBT Outer Ring Road',
    cameraRef: 'CAM-DTS-AV-04',
    confidence: 96.2,
    associatedCaseId: 'MP-2026-0842',
    status: 'SUSPICIOUS'
  },
  {
    id: 'VS-02',
    plateNumber: 'DL-8C-AK-4412',
    vehicleModel: 'Maruti Suzuki Omni',
    color: 'White',
    timestamp: '2026-10-21 09:41 AM',
    location: 'Ghazipur Border Toll Plaza (UP Bound)',
    cameraRef: 'CAM-NHAI-GZB-03',
    confidence: 98.4,
    associatedCaseId: 'MP-2026-0842',
    status: 'VERIFIED'
  },
  {
    id: 'VS-03',
    plateNumber: 'DL-8C-AK-4412',
    vehicleModel: 'Maruti Suzuki Omni',
    color: 'White',
    timestamp: '2026-10-23 09:22 AM',
    location: 'Mohan Nagar Junction, Ghaziabad',
    cameraRef: 'CAM-GZB-TRF-14',
    confidence: 94.7,
    associatedCaseId: 'MP-2026-0914',
    status: 'VERIFIED'
  }
];

export const TRAFFIC_REQUESTS: TrafficCameraRequest[] = [
  {
    id: 'TCR-2026-0042',
    caseId: 'MP-2026-0842',
    caseName: 'Priya Verma (16F)',
    incidentDate: '2026-10-21',
    locationName: 'Ghazipur Border Toll Plaza & NH-24 Highway Stretch',
    latLng: [28.6256, 77.3312],
    timeWindowStart: '09:15 AM',
    timeWindowEnd: '10:15 AM',
    reasonForAccess: 'Urgent tracking of vehicle DL-8C-AK-4412 suspected in abduction of minor Priya Verma.',
    cameraRegion: 'NHAI Eastern Corridor & UP Traffic Control',
    requestingOfficer: 'Inspector Rajesh Kumar (DL-W-7842)',
    requestingStation: 'Tilak Nagar Police Station',
    urgency: 'CRITICAL',
    status: 'FOOTAGE_RECEIVED',
    submittedDate: '2026-10-21T16:00:00Z',
    approvedDate: '2026-10-21T17:15:00Z',
    approverNotes: 'Emergency high-priority approval granted by Traffic Control Room. Footage excerpt of 40 mins downloaded.',
    footageExtractName: 'NH24_GHAZIPUR_LANE3_20261021_0915_1000.mp4',
    footageExtractSizeMb: 340.5
  },
  {
    id: 'TCR-2026-0043',
    caseId: 'MP-2026-0842',
    caseName: 'Priya Verma (16F)',
    incidentDate: '2026-10-21',
    locationName: 'Chhajarsi Toll Plaza, Pilkhuwa (Hapur-Meerut Highway)',
    latLng: [28.7188, 77.6892],
    timeWindowStart: '10:00 AM',
    timeWindowEnd: '11:30 AM',
    reasonForAccess: 'Confirm further eastward transit of suspect vehicle DL-8C-AK-4412 towards Meerut industrial belt.',
    cameraRegion: 'Western UP NHAI Authority',
    requestingOfficer: 'Inspector Rajesh Kumar',
    requestingStation: 'Tilak Nagar Police Station',
    urgency: 'HIGH',
    status: 'UNDER_REVIEW',
    submittedDate: '2026-10-22T08:30:00Z'
  },
  {
    id: 'TCR-2026-0039',
    caseId: 'MP-2026-0791',
    caseName: 'Aarav Sharma (14M)',
    incidentDate: '2026-10-18',
    locationName: 'Old Delhi Railway Station Circulating Area & SPM Marg',
    latLng: [28.6622, 77.2285],
    timeWindowStart: '14:00 PM',
    timeWindowEnd: '15:30 PM',
    reasonForAccess: 'Verify exit route of missing minor Aarav Sharma last seen near Platform 4.',
    cameraRegion: 'Delhi Traffic Police Central Range',
    requestingOfficer: 'Inspector Harish Chandra',
    requestingStation: 'Old Delhi Railway PS',
    urgency: 'HIGH',
    status: 'APPROVED',
    submittedDate: '2026-10-19T10:00:00Z',
    approvedDate: '2026-10-19T14:30:00Z',
    approverNotes: 'Approved. Footage extraction scheduled with Station CCTV server.'
  }
];

export const ESCALATIONS: EscalationRecord[] = [
  {
    id: 'ESC-2026-0012',
    caseId: 'MP-2026-0842',
    caseTitle: 'Priya Verma (16F) - Kidnapping & Cross-Border Syndicate',
    triggerReason: 'Cross-district transit into Uttar Pradesh, shared phone broker linkage with Ghaziabad FIR 719/2026, minor female trafficking risk.',
    currentLevel: 'STATION',
    targetLevel: 'DISTRICT',
    requestedBy: 'Inspector Rajesh Kumar (SHO Tilak Nagar)',
    requestDate: '2026-10-22T12:00:00Z',
    reviewDeadline: '2026-10-23T12:00:00Z',
    assignedAuthority: 'SP Vikram Singh, IPS (District Police Administrator)',
    status: 'APPROVED',
    decisionNotes: 'Approved for District Supervision and immediate notification to State Anti-Human Trafficking Unit (AHTU). Inter-state coordination team constituted.',
    coordinationStations: ['Tilak Nagar PS (Delhi)', 'Anand Vihar Railway PS (Delhi)', 'Kotwali Ghaziabad PS (UP)']
  },
  {
    id: 'ESC-2026-0014',
    caseId: 'MP-2026-0914',
    caseTitle: 'Meena Kumari (19F) - Inter-State Human Trafficking Syndicate',
    triggerReason: 'High-risk recurring recruitment modus operandi spanning Delhi, Ghaziabad and Meerut. Shared vehicle DL-8C-AK-4412.',
    currentLevel: 'DISTRICT',
    targetLevel: 'STATE',
    requestedBy: 'CO Shailendra Pratap (Ghaziabad District)',
    requestDate: '2026-10-24T09:30:00Z',
    reviewDeadline: '2026-10-25T09:30:00Z',
    assignedAuthority: 'ADGP Priya Sharma, IPS (State Admin CID)',
    status: 'PENDING',
    decisionNotes: 'Awaiting briefing docket and joint technical analysis CDR report.',
    coordinationStations: ['Ghaziabad Kotwali', 'Meerut AHTU', 'Delhi Crime Branch']
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-9104',
    timestamp: '2026-10-27T08:30:12Z',
    action: 'AI_SIMILARITY_MATCH_GENERATED',
    performedBy: 'NEXUS AI Intelligence Service',
    role: 'SYSTEM' as any,
    targetEntityId: 'PAT-2026-01',
    entityType: 'CASE',
    details: 'NLP & CDR engine matched MP-2026-0842 with MP-2026-0914 (Score: 94%). Shared phone +91 98765 43210 identified.',
    ipAddress: '10.0.12.4 (Internal Secure Bus)',
    integrityHash: '8b7a421c99f01e23a48e716bc1209e992b1154a012cf190412803b9012a912bb'
  },
  {
    id: 'AUD-9103',
    timestamp: '2026-10-26T17:45:00Z',
    action: 'EVIDENCE_VERIFIED',
    performedBy: 'Inspector Rajesh Kumar',
    role: 'LOCAL_OFFICER',
    targetEntityId: 'EVD-002',
    entityType: 'EVIDENCE',
    details: 'Verified Anand Vihar CCTV clip #CAM-DTS-AV-04. Bounding box confirmed for subject Priya Verma.',
    ipAddress: '192.168.10.42 (Station Terminal 2)',
    integrityHash: '4a19b084e31002bf901ea89bc441019ab723145ff10988019b782901a1bc3410'
  },
  {
    id: 'AUD-9102',
    timestamp: '2026-10-25T14:10:22Z',
    action: 'TRAFFIC_CAMERA_REQUEST_APPROVED',
    performedBy: 'SP Vikram Singh, IPS',
    role: 'DISTRICT_ADMIN',
    targetEntityId: 'TCR-2026-0042',
    entityType: 'TRAFFIC_REQUEST',
    details: 'Approved emergency high-priority access to Ghazipur Toll Plaza footage. Legal warrant exemption #W-412/26.',
    ipAddress: '10.14.8.1 (District HQ Console)',
    integrityHash: '7721bca904812301bb019488e0149021af1823901bcf912803b9012a912aa112'
  },
  {
    id: 'AUD-9101',
    timestamp: '2026-10-24T11:00:00Z',
    action: 'SCENARIO_VERSION_COMMITTED',
    performedBy: 'Inspector Rajesh Kumar',
    role: 'LOCAL_OFFICER',
    targetEntityId: 'MP-2026-0842',
    entityType: 'SCENARIO',
    details: 'Committed Scenario Version 2. Added verified Smartcard transaction and vehicle transit claims.',
    ipAddress: '192.168.10.42 (Station Terminal 2)',
    integrityHash: 'e31980bcfa0194120bb782910a12cf3450912abcf01928374650192837465019'
  },
  {
    id: 'AUD-9100',
    timestamp: '2026-10-21T14:30:00Z',
    action: 'CASE_REGISTERED_IMMUTABLE_FIR',
    performedBy: 'SI Manoj Tewari',
    role: 'LOCAL_OFFICER',
    targetEntityId: 'MP-2026-0842',
    entityType: 'CASE',
    details: 'Registered new missing person case MP-2026-0842 (Priya Verma, 16F). FIR No. 412/2026 locked as immutable.',
    ipAddress: '192.168.10.18 (Station Terminal 1)',
    integrityHash: '9a3f81b7e4112ac065b2049d5cbf29a1e7b45821f009d1348c2317ef5d1902bb'
  }
];

export const FAMILY_NOTIFICATIONS: FamilyNotification[] = [
  {
    id: 'NOTIF-01',
    caseId: 'MP-2026-0842',
    timestamp: '2026-10-24T18:00:00Z',
    title: 'Official Investigation Update',
    message: 'Supervision has been escalated to West District Anti-Human Trafficking Unit. Special search teams are actively coordinating across border transit checkpoints.',
    type: 'OFFICIAL_UPDATE',
    isRead: false
  },
  {
    id: 'NOTIF-02',
    caseId: 'MP-2026-0842',
    timestamp: '2026-10-23T10:30:00Z',
    title: 'Question from Investigating Officer',
    message: 'Inspector Rajesh Kumar has requested clarification regarding Priya\'s recent social media accounts or any specific usernames she used on Instagram or Telegram.',
    type: 'QUESTION_FROM_OFFICER',
    isRead: false,
    requiresResponse: true
  },
  {
    id: 'NOTIF-03',
    caseId: 'MP-2026-0842',
    timestamp: '2026-10-21T15:30:00Z',
    title: 'Document Receipt Acknowledgement',
    message: 'School Identity Card and recent photograph submitted by Sunita Verma have been securely cataloged and verified in the official case dossier.',
    type: 'DOCUMENT_ACK',
    isRead: true
  }
];
