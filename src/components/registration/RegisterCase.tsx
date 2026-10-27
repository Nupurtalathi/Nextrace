import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MissingPersonCase, FIRRecord, IdentifyingFeatures, CircumstanceDetails } from '../../types';
import {
  UserPlus,
  Shield,
  FileText,
  Clock,
  MapPin,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
  Sparkles
} from 'lucide-react';

export const RegisterCase: React.FC = () => {
  const { addCase, setActivePage, setSelectedCaseId, currentUser } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Step A: Person Details
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(17);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [category, setCategory] = useState<MissingPersonCase['category']>('Minor');
  const [priority, setPriority] = useState<MissingPersonCase['priority']>('HIGH');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300');
  const [heightCm, setHeightCm] = useState(156);
  const [build, setBuild] = useState('Slim');
  const [complexion, setComplexion] = useState('Wheatish');
  const [distinguishingMarks, setDistinguishingMarks] = useState('Birthmark on right collarbone');
  const [clothingLastSeen, setClothingLastSeen] = useState('Blue denim shirt and black trousers');
  const [languages, setLanguages] = useState('Hindi, English');

  // Step B: FIR Details
  const [firNumber, setFirNumber] = useState('FIR No. 498/2026 u/s 137(2) BNS');
  const [policeStation, setPoliceStation] = useState(currentUser.stationOrDept || 'Tilak Nagar Police Station');
  const [district, setDistrict] = useState(currentUser.district || 'West District');
  const [state, setState] = useState('Delhi (NCT)');
  const [lastSeenLocation, setLastSeenLocation] = useState('Subhash Nagar Metro Station Gate 2');
  const [reportingDate, setReportingDate] = useState('2026-10-27');
  const [lastSeenDate, setLastSeenDate] = useState('2026-10-26T18:30');
  const [initialAccount, setInitialAccount] = useState('Family reported subject left coaching center at 06:30 PM. Mobile unreachable since 07:15 PM.');

  // Step C: Circumstances
  const [preEvents, setPreEvents] = useState('Subject had mentioned an online social media interaction offering tele-calling job.');
  const [lastCommunications, setLastCommunications] = useState('Last text sent to classmate stating "meeting someone near flyover".');
  const [recruitmentOffers, setRecruitmentOffers] = useState('Promised ₹20,000 monthly stipend for part-time administrative work.');
  const [suspectedCoercion, setSuspectedCoercion] = useState(true);

  // Step D: Family Statement
  const [familyStatement, setFamilyStatement] = useState('Father states she has never stayed out overnight and has no disciplinary issues.');
  const [sourcePerson, setSourcePerson] = useState('Rameshwar Prasad (Father)');

  // Step E: Evidence Simulation
  const [evidenceTitle, setEvidenceTitle] = useState('Coaching Institute Attendance Register Copy');
  const [evidenceType, setEvidenceType] = useState<'PHOTO' | 'FORENSIC_DOC'>('FORENSIC_DOC');

  const steps = [
    { num: 1, title: 'Person Details', desc: 'Identity & Physical Profile' },
    { num: 2, title: 'FIR & Station', desc: 'Immutable FIR Source' },
    { num: 3, title: 'Circumstances', desc: 'Pre-Disappearance Events' },
    { num: 4, title: 'Family Statements', desc: 'Interviews & Witness Notes' },
    { num: 5, title: 'Evidence Vault', desc: 'Secure Uploads & Hashes' },
    { num: 6, title: 'Review & Commit', desc: 'Final Authorization' }
  ];

  const handleNext = () => {
    setFormError('');
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setFormError('Please enter full name of missing person.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!firNumber.trim() || !policeStation.trim()) {
        setFormError('FIR Number and Police Station are required.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrev = () => {
    setFormError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    const generatedId = `MP-2026-0${Math.floor(850 + Math.random() * 100)}`;
    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newCase: MissingPersonCase = {
      id: generatedId,
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      category,
      photoUrl,
      status: 'NEW_REGISTERED',
      priority,
      registeredDate: new Date().toISOString(),
      lastUpdatedDate: new Date().toISOString(),
      policeStation,
      district,
      state,
      assignedOfficer: currentUser.name,
      assignedOfficerContact: currentUser.phone,
      aiRiskScore: age < 18 ? 84 : 65,
      aiRiskFactors: [
        age < 18 ? 'Minor vulnerable individual (<18 years)' : 'Adult unexplained disappearance',
        recruitmentOffers ? 'Unverified employment / placement offer indicator' : 'Sudden communication blackout',
        'Initial 24-hour golden window active'
      ],
      crossDistrictAlert: suspectedCoercion,
      isEscalated: false,
      identifyingFeatures: {
        heightCm: Number(heightCm),
        build,
        complexion,
        hairColor: 'Black',
        eyeColor: 'Dark Brown',
        distinguishingMarks: [distinguishingMarks],
        clothingLastSeen,
        languagesSpoken: languages.split(',').map(l => l.trim())
      },
      fir: {
        firNumber: firNumber.trim(),
        policeStation,
        district,
        state,
        reportingDate: new Date(reportingDate).toISOString(),
        dateTimeLastSeen: new Date(lastSeenDate).toISOString(),
        lastSeenLocation,
        lastSeenCoordinates: [28.6366 + (Math.random() - 0.5) * 0.05, 77.0963 + (Math.random() - 0.5) * 0.05],
        reportingOfficer: currentUser.name,
        officerBadge: currentUser.badgeNumber || 'DL-POL-REG',
        originalFIRDocumentName: `${firNumber.replace(/[^a-zA-Z0-9]/g, '_')}_SIGNED.pdf`,
        initialAccountSummary: initialAccount,
        isImmutable: true
      },
      circumstances: {
        eventsBeforeDisappearance: preEvents,
        lastKnownActivities: 'Reported leaving coaching center.',
        lastKnownCommunications: lastCommunications,
        employmentOrRecruitmentOffers: recruitmentOffers,
        suspectedCoercionOrDeception: suspectedCoercion,
        coercionIndicators: suspectedCoercion ? ['Unverified third-party job offer', 'Rapid phone switch-off'] : []
      },
      familyStatements: [
        {
          id: `FS-${Date.now().toString().slice(-4)}`,
          statementText: familyStatement,
          recordedDate: new Date().toISOString(),
          sourcePerson,
          relationship: 'Parent / Legal Guardian',
          recordingOfficer: currentUser.name,
          verificationStatus: 'VERIFIED'
        }
      ],
      evidenceList: [
        {
          id: `EVD-${Date.now().toString().slice(-4)}`,
          type: evidenceType,
          title: evidenceTitle,
          description: 'Initial supporting evidentiary attachment verified during registration.',
          source: sourcePerson,
          uploaderName: currentUser.name,
          uploaderRole: currentUser.role,
          uploadDate: new Date().toISOString(),
          fileIntegrityHash: randomHash,
          verificationStatus: 'VERIFIED'
        }
      ],
      scenarioVersions: [
        {
          versionNumber: 1,
          modifiedAt: new Date().toISOString(),
          modifiedBy: currentUser.name,
          officerRole: currentUser.role,
          summary: `Initial working scenario ingested from FIR: ${initialAccount}`,
          changeReason: 'Primary registration entry.',
          claims: [
            {
              id: 'CLM-01',
              text: `Subject last seen near ${lastSeenLocation}.`,
              sourceCitation: `FIR ${firNumber} Para 1`,
              status: 'VERIFIED',
              verifiedBy: currentUser.name
            },
            {
              id: 'CLM-02',
              text: 'Subject phone turned off shortly after departure.',
              sourceCitation: `FIR ${firNumber} Para 2`,
              status: 'VERIFIED',
              verifiedBy: currentUser.name
            }
          ]
        }
      ]
    };

    setTimeout(() => {
      addCase(newCase);
      setSelectedCaseId(newCase.id);
      setIsSubmitting(false);
      setActivePage('cases');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <UserPlus className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Missing Person Statutory Case Registration
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-step intake adhering to statutory child tracing protocols and immutable FIR standards.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Statutory Immutable Record</span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {steps.map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <span className={`font-bold text-[11px] truncate ${isCurrent ? 'text-blue-900' : 'text-slate-700'}`}>
                    {s.title}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Step Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* STEP 1: Person Details */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Step A: Person Identification & Demographics</span>
              <span className="text-slate-400 font-normal">Fields marked with * are required</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name of Missing Person *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g., Anjali Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Classification Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Minor">Minor (Below 18 Years - Strict Protocol)</option>
                  <option value="Trafficking Suspected">Trafficking Suspected (High Alert)</option>
                  <option value="Vulnerable Adult">Vulnerable Adult</option>
                  <option value="Runaway">Runaway / Disputed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Priority Level</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="CRITICAL">CRITICAL (Amber Alert / Active Syndicate)</option>
                  <option value="HIGH">HIGH (Minor / Golden Window Active)</option>
                  <option value="MEDIUM">MEDIUM (Standard Investigation)</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Build</label>
                  <input
                    type="text"
                    value={build}
                    onChange={e => setBuild(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complexion</label>
                  <input
                    type="text"
                    value={complexion}
                    onChange={e => setComplexion(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Distinguishing Physical Marks, Scars, Tattoos</label>
                <input
                  type="text"
                  value={distinguishingMarks}
                  onChange={e => setDistinguishingMarks(e.target.value)}
                  placeholder="e.g. Burn mark on left wrist, mole under right eye"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Clothing Last Seen Wearing</label>
                <input
                  type="text"
                  value={clothingLastSeen}
                  onChange={e => setClothingLastSeen(e.target.value)}
                  placeholder="e.g. Blue school uniform salwar kameez with white dupatta"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Reference Photo URL (Simulated Upload)</label>
                <div className="flex items-center space-x-3">
                  <img src={photoUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-300" />
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={e => setPhotoUrl(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FIR Details */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start space-x-2.5">
              <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Statutory FIR Immutability Rule:</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  The initial FIR account is treated as an immutable legal record. All supplementary evidence, family testimonies, and AI hypotheses will be appended as versioned working scenarios without overwriting this initial report.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official FIR / Reference Number *</label>
                <input
                  type="text"
                  value={firNumber}
                  onChange={e => setFirNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Police Station *</label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={e => setPoliceStation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District & State</label>
                <input
                  type="text"
                  value={`${district}, ${state}`}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Seen Date & Time *</label>
                <input
                  type="datetime-local"
                  value={lastSeenDate}
                  onChange={e => setLastSeenDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Last Seen Physical Location / Landmark *</label>
                <input
                  type="text"
                  value={lastSeenLocation}
                  onChange={e => setLastSeenLocation(e.target.value)}
                  placeholder="e.g. Anand Vihar ISBT Gate 4 / Subhash Nagar Metro Station"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Initial Account of Disappearance (From FIR) *</label>
                <textarea
                  value={initialAccount}
                  onChange={e => setInitialAccount(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Circumstances */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Step C: Circumstances of Disappearance
            </h2>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Events & Activities Before Disappearance</label>
              <textarea
                value={preEvents}
                onChange={e => setPreEvents(e.target.value)}
                rows={3}
                placeholder="Details of schooling, workplace, or travel preparations..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Last Known Communications & Social Media Activity</label>
              <input
                type="text"
                value={lastCommunications}
                onChange={e => setLastCommunications(e.target.value)}
                placeholder="Phone calls, SMS, WhatsApp, Instagram chats..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Employment / Recruitment Offers (If Any)</label>
              <input
                type="text"
                value={recruitmentOffers}
                onChange={e => setRecruitmentOffers(e.target.value)}
                placeholder="Details of any job promises, coaching offers, or recruitment agents..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-3">
              <input
                type="checkbox"
                id="coercion-check"
                checked={suspectedCoercion}
                onChange={e => setSuspectedCoercion(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="coercion-check" className="font-bold text-amber-900 cursor-pointer">
                Suspected Coercion, Trafficking, or Inter-State Syndicate Involvement
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Family Statements */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Step D: Family & Witness Initial Interview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Person / Deponent Name</label>
                <input
                  type="text"
                  value={sourcePerson}
                  onChange={e => setSourcePerson(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recording Investigating Officer</label>
                <input
                  type="text"
                  value={currentUser.name}
                  readOnly
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Statement Summary</label>
                <textarea
                  value={familyStatement}
                  onChange={e => setFamilyStatement(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Evidence */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Step E: Primary Evidentiary Attachments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence Title</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={e => setEvidenceTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={e => setEvidenceType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="FORENSIC_DOC">Document / Register Exhibit</option>
                  <option value="PHOTO">Photographic Exhibit</option>
                  <option value="CCTV_CLIP">CCTV Surveillance Extract</option>
                  <option value="CALL_RECORDS">Call Detail Record (CDR)</option>
                </select>
              </div>

              <div className="md:col-span-2 p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <span className="font-bold text-slate-800">Simulated Secure File Intake</span>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                  Documents are automatically hashed using SHA-256 for cryptographic integrity verification.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Final Submission */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-900">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Ready for Statutory Intake:</span>
                <p className="text-[11px] text-emerald-800">
                  Please verify the summarized data below before committing to the police database.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Person Name</span>
                <div className="font-bold text-slate-900">{fullName} ({age} yrs • {gender})</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">FIR Number</span>
                <div className="font-mono font-bold text-slate-900">{firNumber}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Station</span>
                <div className="font-bold text-slate-900">{policeStation}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Last Seen Location</span>
                <div className="font-bold text-slate-900">{lastSeenLocation}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Priority Tier</span>
                <div className="font-bold text-red-600">{priority}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned IO</span>
                <div className="font-bold text-slate-900">{currentUser.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Authorizing & Indexing...' : 'Commit Immutable Case Record'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
