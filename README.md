# NEXUS / Nextrace — AI-Powered Missing Persons & Human Trafficking Intelligence Platform

> **AI-Assisted Investigation & Cross-Jurisdiction Intelligence System**  
> *Notice: Demonstration environment — all case records, personal identities, FIRs and surveillance feeds are synthetic.*

---

## 1. Project Overview

**NEXUS / Nextrace** is a modern, professional, full-stack intelligence platform engineered for law enforcement personnel, Anti-Human Trafficking Units (AHTU), and supervisory authorities.

The platform helps authorized police personnel:
- Register missing-person cases adhering to statutory FIR immutability standards.
- Analyze FIRs and evidence using NLP and entity extraction.
- Reconstruct case scenarios with versioned working timelines.
- Identify recurring patterns and discover cross-district syndicate links.
- Review potential suspect and entity connections via an interactive graph.
- Analyze authorized CCTV footage and ANPR vehicle tracking.
- Manage traffic camera and RTO access requests.
- Coordinate investigations across police stations, districts, states, and government authorities.
- Enforce strict 4-point statutory recovery verification before case closure.
- Provide a dedicated, dignified Family Portal with official updates and secure Q&A.

---

## 2. Technology Stack

- **Frontend**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts & Visualizations**: Recharts
- **Geospatial Mapping**: Leaflet with OpenStreetMap
- **Connection Graph**: React Flow (`reactflow`)
- **State Management**: Reactive Context with persistent local storage and append-only audit trail

---

## 3. User Roles & Clearance

NEXUS enforces a role-based access model across 5 authorized tiers:

1. **Local Police Officer** (*Inspector Rajesh Kumar, Tilak Nagar PS*): Case registration, scenario updates, evidence upload, CCTV warrant requests, recovery submissions.
2. **District Police Administrator** (*SP Vikram Singh, IPS, West District HQ*): Case supervision, escalation approvals, cross-district alert coordination.
3. **State Police Administrator** (*ADGP Priya Sharma, IPS, State CID / Anti-Trafficking*): Inter-district syndicates, state-level JIT coordination.
4. **Government Department Administrator** (*Joint Secy. Anita Deshmukh, IAS, Ministry of Home Affairs*): Multi-state oversight, governance policies, statutory archival and data-removal approvals.
5. **Family Member** (*Sunita Verma, Mother of missing minor Priya Verma*): Scoped strictly to linked case `MP-2026-0842`, verified public milestones, officer Q&A, and supplementary lead submission.

---

## 4. Main Application Modules

1. **Command Dashboard**: Real-time KPI summary cards, Leaflet geospatial incident map, Recharts trends, and critical attention queue.
2. **Missing Persons Cases**: Multi-filter case register and comprehensive dossier modal.
3. **Register New Case**: 6-step statutory intake wizard with automated SHA-256 evidence hashing.
4. **AI Scenario Builder**: Side-by-side comparison of immutable FIR accounts vs. evolving working scenarios with claim status classification.
5. **Pattern Discovery Engine**: Explainable cross-district matcher highlighting shared phone numbers, vehicle plates, and recruitment MO.
6. **Suspect & Entity Graph**: Interactive React Flow relationship graph connecting cases, brokers, vehicles, and transit nodes.
7. **Video Intelligence & CCTV Workspace**: Video playback scrubber with timestamp bookmarks, facial matching confidence scores, and ANPR plate recognition.
8. **Traffic Camera Requests**: Inter-agency warrant request workflow (Draft → Submitted → Under Review → Approved → Footage Received).
9. **Investigation Timeline**: Multi-source harmonized chronological sequence.
10. **Case Escalations**: Hierarchical escalation queue with review countdown deadlines.
11. **Recovery & Case Closure**: Mandatory 4-point statutory verification checklist (Medical examination, Sec 164 BNSS statement, identity verification, and SHO signoff).
12. **Historical Case Repository**: Sealed archive of closed cases retained under 10–25 year statutory custody rules.
13. **Reports & Analytics**: 72-hour golden window ageing charts, demographic vulnerability analysis, and CSV/PDF docket export.
14. **User Management**: Provisioned personnel directory and Role-Based Access Control (RBAC) matrix.
15. **Audit Logs & Tamper Trail**: Append-only cryptographic ledger with SHA-256 block hashes and statutory data-removal adjudication.
16. **Settings & Policy Governance**: AI confidence thresholds and statutory retention rules.
17. **Family Portal**: Dignified, secure kin portal with verified milestones and direct officer interaction.

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nupurtalathi/Nextrace.git
cd Nextrace

# Install dependencies
npm install

# Build production bundle
npm run build

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173/` to explore the operational platform.
