import React, { useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useApp } from '../../context/AppContext';
import { SUSPECT_NODES, SUSPECT_EDGES } from '../../data/mockData';
import { SuspectEntityNode, SuspectEntityEdge } from '../../types';
import {
  Share2,
  Shield,
  Filter,
  Eye,
  FileText,
  AlertTriangle,
  Download,
  Info,
  X,
  Phone,
  Car,
  MapPin,
  User,
  Users
} from 'lucide-react';

export const SuspectEntityGraph: React.FC = () => {
  const { cases, setSelectedCaseId, setActivePage } = useApp();

  const [selectedNode, setSelectedNode] = useState<SuspectEntityNode | null>(SUSPECT_NODES[0]);
  const [selectedEdge, setSelectedEdge] = useState<SuspectEntityEdge | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showOnlyVerified, setShowOnlyVerified] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  // Position layout coordinates for visualization
  const initialNodePositions: Record<string, { x: number; y: number }> = {
    'MP-2026-0842': { x: 100, y: 150 },
    'MP-2026-0914': { x: 100, y: 350 },
    'MP-2026-0791': { x: 100, y: 550 },
    'SUSP-02': { x: 380, y: 100 },
    'PHN-01': { x: 420, y: 260 },
    'VEH-01': { x: 650, y: 150 },
    'SUSP-01': { x: 680, y: 360 },
    'LOC-01': { x: 350, y: 30 },
    'LOC-02': { x: 880, y: 200 }
  };

  const getNodeColor = (type: SuspectEntityNode['type']) => {
    switch (type) {
      case 'CASE': return '#2563eb'; // Blue
      case 'SUSPECT': return '#dc2626'; // Red
      case 'AGENT': return '#ea580c'; // Orange
      case 'VEHICLE': return '#7c3aed'; // Purple
      case 'LOCATION': return '#059669'; // Emerald
      case 'PHONE': return '#0891b2'; // Cyan
      default: return '#475569';
    }
  };

  // Convert raw mock nodes to ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    return SUSPECT_NODES
      .filter(n => filterType === 'ALL' || n.type === filterType)
      .map(n => {
        const pos = initialNodePositions[n.id] || { x: 300, y: 300 };
        const color = getNodeColor(n.type);
        const isSelected = selectedNode?.id === n.id;

        return {
          id: n.id,
          position: pos,
          data: { label: n.label, raw: n },
          style: {
            background: isSelected ? '#ffffff' : '#f8fafc',
            color: '#0f172a',
            border: `2px solid ${isSelected ? '#2563eb' : color}`,
            boxShadow: isSelected ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '11px',
            fontWeight: '700',
            width: 170
          }
        };
      });
  }, [filterType, selectedNode]);

  // Convert raw edges to ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return SUSPECT_EDGES
      .filter(e => (!showOnlyVerified || e.isVerified))
      .map(e => {
        const isSelected = selectedEdge?.id === e.id;
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.relation,
          animated: !e.isVerified,
          style: {
            stroke: e.isVerified ? '#2563eb' : '#d97706',
            strokeWidth: isSelected ? 3 : 2,
            strokeDasharray: e.isVerified ? undefined : '5,5'
          },
          labelStyle: {
            fontSize: '9px',
            fontWeight: '600',
            fill: e.isVerified ? '#1e3a8a' : '#92400e'
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.9,
            rx: 4,
            ry: 4
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: e.isVerified ? '#2563eb' : '#d97706'
          },
          data: { raw: e }
        };
      });
  }, [showOnlyVerified, selectedEdge]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync state when filters change
  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.data.raw);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdge(edge.data.raw);
    setSelectedNode(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Suspect & Entity Connection Intelligence Graph
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizing relationships between missing persons, facilitators, burner phones, vehicles, and transit nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
          >
            <option value="ALL">All Entity Types</option>
            <option value="CASE">Cases Only</option>
            <option value="SUSPECT">Suspects / Brokers</option>
            <option value="VEHICLE">Vehicles</option>
            <option value="LOCATION">Locations / Hubs</option>
            <option value="PHONE">Phone Identifiers</option>
          </select>

          <label className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyVerified}
              onChange={e => setShowOnlyVerified(e.target.checked)}
              className="rounded text-blue-600 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-semibold text-[11px]">Verified Edges Only</span>
          </label>

          <button
            onClick={() => setReportGenerated(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Network Brief</span>
          </button>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-md h-[600px] relative overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            fitView
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls className="bg-white border-slate-200 rounded-lg overflow-hidden" />
            <MiniMap
              nodeColor={n => getNodeColor(n.data?.raw?.type)}
              className="bg-slate-950 border border-slate-800 rounded-lg"
            />
          </ReactFlow>

          {/* Canvas Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-300 flex items-center space-x-3 z-10">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-1.5"></span> Case
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1.5"></span> Suspect
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 mr-1.5"></span> Vehicle
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1.5"></span> Location
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 mr-1.5"></span> Phone
            </span>
            <span className="border-l border-slate-700 pl-2 text-slate-400">
              Solid: Verified • Dashed: AI-Suggested
            </span>
          </div>
        </div>

        {/* Right Inspector Drawer (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Entity & Edge Inspector
              </h3>
              <span className="text-[10px] text-slate-400">Forensic Detail</span>
            </div>

            {selectedNode && (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                    style={{ backgroundColor: `${getNodeColor(selectedNode.type)}20`, color: getNodeColor(selectedNode.type) }}
                  >
                    {selectedNode.type} ENTITY
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-1">{selectedNode.label}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">{selectedNode.district || 'Cross-State Network'}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700">Entity Details:</span>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    {Object.entries(selectedNode.details).map(([key, val]) => (
                      <div key={key}>
                        <strong className="text-slate-800 capitalize">{key}:</strong>{' '}
                        <span>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedNode.type === 'CASE' && (
                  <button
                    onClick={() => {
                      setSelectedCaseId(selectedNode.id);
                      setActivePage('cases');
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs shadow-xs"
                  >
                    Open Case Dossier →
                  </button>
                )}
              </div>
            )}

            {selectedEdge && (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedEdge.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedEdge.isVerified ? 'VERIFIED RELATIONSHIP' : 'AI-SUGGESTED LINK'}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedEdge.relation}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">Edge ID: {selectedEdge.id}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">Supporting Evidence Reference:</span>
                  <p className="text-slate-600 text-[11px] italic leading-relaxed">
                    "{selectedEdge.evidenceRef}"
                  </p>
                </div>
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <div className="py-12 text-center text-slate-400 text-xs">
                Click any node or connection edge on the canvas to inspect evidence details.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Node coordinates and relationship weights indexed in real-time.
          </div>
        </div>
      </div>

      {/* Generated Report Modal */}
      {reportGenerated && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Case Connection & Syndicate Network Report
                </h3>
              </div>
              <button onClick={() => setReportGenerated(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Synthesized report linking <strong>MP-2026-0842 (Priya Verma)</strong> and <strong>MP-2026-0914 (Meena Kumari)</strong> through broker <strong>Ramesh Kumar ("Tiger")</strong>, vehicle <strong>DL-8C-AK-4412</strong>, and burner SIM <strong>+91 98765 43210</strong>.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <div>Network Nodes: 9 Entities</div>
              <div>Verified Corroborations: 8 Evidentiary Edges</div>
              <div>Lead Inter-District Transit Corridor: NH-24 Delhi - Ghaziabad - Meerut</div>
              <div>Report Hash: 9812acb941019ab723145ff10988019b782901a1bc3410</div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setReportGenerated(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
              >
                Print / Export Official Docket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
