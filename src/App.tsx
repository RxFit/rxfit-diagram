import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Edge,
  type Node,
  type Connection,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import './index.css';

const initialNodes: Node[] = [
  // -------------------------
  // GROUPS (Background Areas)
  // -------------------------
  {
    id: 'group-people',
    type: 'custom',
    position: { x: -350, y: 100 },
    data: { label: 'People & Operators', variant: 'group' },
    style: { width: 320, height: 400 },
    zIndex: -1,
  },
  {
    id: 'group-db',
    type: 'custom',
    position: { x: 50, y: -250 },
    data: { label: 'Data & Source of Truth', variant: 'group' },
    style: { width: 400, height: 260 },
    zIndex: -1,
  },
  {
    id: 'group-core',
    type: 'custom',
    position: { x: 50, y: 100 },
    data: { label: 'Client Services Interface', variant: 'group' },
    style: { width: 400, height: 400 },
    zIndex: -1,
  },
  {
    id: 'group-agent',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: { label: 'Agentic Layer', variant: 'group' },
    style: { width: 380, height: 400 },
    zIndex: -1,
  },
  {
    id: 'group-comms',
    type: 'custom',
    position: { x: -350, y: 560 },
    data: { label: 'Heart of Communications', variant: 'group' },
    style: { width: 320, height: 280 },
    zIndex: -1,
  },
  {
    id: 'group-marketing',
    type: 'custom',
    position: { x: 500, y: 560 },
    data: { label: 'Top-of-Funnel (SEO/AEO)', variant: 'group' },
    style: { width: 380, height: 380 },
    zIndex: -1,
  },
  {
    id: 'group-billing',
    type: 'custom',
    position: { x: 50, y: 560 },
    data: { label: 'Tri-Pillar Billing System', variant: 'group' },
    style: { width: 400, height: 380 },
    zIndex: -1,
  },

  // -------------------------
  // NODES
  // -------------------------

  // Database / Source of Truth
  { id: 'drive', type: 'custom', position: { x: 80, y: -200 }, data: { label: 'Google Drive', description: 'Database/Brain Orchestrator', variant: 'data', icon: 'HardDrive' }, parentId: 'group-db', extent: 'parent' },
  { id: 'github', type: 'custom', position: { x: 80, y: -100 }, data: { label: 'GitHub', description: 'Rules & Systems Orchestrator', variant: 'data', icon: 'Github' }, parentId: 'group-db', extent: 'parent' },
  { id: 'calendar', type: 'custom', position: { x: 80, y: 0 }, data: { label: 'Google Calendar', description: 'Workload & Attendance Truth', variant: 'data', icon: 'CalendarDays' }, parentId: 'group-db', extent: 'parent' },

  // People
  { id: 'clients', type: 'custom', position: { x: 40, y: 60 }, data: { label: 'Clients', description: 'End-users', variant: 'team', icon: 'Users' }, parentId: 'group-people', extent: 'parent' },
  { id: 'exec', type: 'custom', position: { x: 40, y: 160 }, data: { label: 'Exec Team', description: 'Danny, Korab, Oscar', variant: 'team', icon: 'Briefcase' }, parentId: 'group-people', extent: 'parent' },
  { id: 'trainers', type: 'custom', position: { x: 40, y: 260 }, data: { label: 'Service Professionals', description: 'Trainers & Staff', variant: 'team', icon: 'Dumbbell' }, parentId: 'group-people', extent: 'parent' },

  // Comms
  { id: 'twilio', type: 'custom', position: { x: 40, y: 160 }, data: { label: 'Twilio', description: 'Ops Comms & Remote Control', variant: 'comms', icon: 'MessageSquareShare' }, parentId: 'group-comms', extent: 'parent' },
  { id: 'gchat', type: 'custom', position: { x: 40, y: 60 }, data: { label: 'Google Chat', description: 'Admin/Trainer Internal Comms', variant: 'comms', icon: 'MessageCircle' }, parentId: 'group-comms', extent: 'parent' },
  { id: 'phone', type: 'custom', position: { x: -310, y: 880 }, data: { label: 'Danny\'s Phone', description: 'Ultimate Remote Control', variant: 'team', icon: 'Smartphone' } },

  // Client Services Interface
  { id: 'cc', type: 'custom', position: { x: 80, y: 60 }, data: { label: 'RxFit Command Center', description: 'RxFit Concierge', variant: 'core', icon: 'Laptop' }, parentId: 'group-core', extent: 'parent' },
  { id: 'virtual', type: 'custom', position: { x: 80, y: 170 }, data: { label: 'Virtual Services', description: 'Wellness App, Corporate', variant: 'core', icon: 'Globe' }, parentId: 'group-core', extent: 'parent' },
  { id: 'wrapped-chat', type: 'custom', position: { x: 80, y: 280 }, data: { label: 'Wrapped Google Chat', description: 'Embedded Communications', variant: 'comms', icon: 'MessageCirclePlus' }, parentId: 'group-core', extent: 'parent' },

  // Agentic Layer
  { id: 'jade', type: 'custom', position: { x: 40, y: 60 }, data: { label: 'RxFit-MCP (JADE v3)', description: 'Operations Engine', variant: 'agent', icon: 'Bot' }, parentId: 'group-agent', extent: 'parent' },
  { id: 'wrapups', type: 'custom', position: { x: 40, y: 170 }, data: { label: 'Wrap-ups', description: 'Morning/EOD Tasks', variant: 'agent', icon: 'Workflow' }, parentId: 'group-agent', extent: 'parent' },
  { id: 'antigravity', type: 'custom', position: { x: 40, y: 280 }, data: { label: 'Antigravity', description: 'Interchangeable Agent Tool', variant: 'agent', icon: 'Sparkles' }, parentId: 'group-agent', extent: 'parent' },

  // Billing (Tri-Pillar)
  { id: 'stripe', type: 'custom', position: { x: 80, y: 60 }, data: { label: 'Stripe', description: 'Payment Verification', variant: 'finance', icon: 'CreditCard' }, parentId: 'group-billing', extent: 'parent' },
  { id: 'billing-engine', type: 'custom', position: { x: 80, y: 170 }, data: { label: 'Billing Sync Engine', description: 'Aggregator', variant: 'finance', icon: 'RefreshCw' }, parentId: 'group-billing', extent: 'parent' },
  { id: 'payroll', type: 'custom', position: { x: 80, y: 280 }, data: { label: 'Team Payroll', description: 'Determines Payouts', variant: 'finance', icon: 'CircleDollarSign' }, parentId: 'group-billing', extent: 'parent' },

  // Marketing (SEO/AEO)
  { id: 'website', type: 'custom', position: { x: 60, y: 60 }, data: { label: 'rxfit.co Website', description: 'Traffic Hub', variant: 'core', icon: 'Layout' }, parentId: 'group-marketing', extent: 'parent' },
  { id: 'seo', type: 'custom', position: { x: 60, y: 150 }, data: { label: 'SEO Agent', description: 'Generates Audits', variant: 'agent', icon: 'Search' }, parentId: 'group-marketing', extent: 'parent' },
  { id: 'audits', type: 'custom', position: { x: 60, y: 230 }, data: { label: 'Weekly Audits', description: 'Must-Dos / Recurring', variant: 'core', icon: 'FileText' }, parentId: 'group-marketing', extent: 'parent' },
  { id: 'oscar', type: 'custom', position: { x: 60, y: 310 }, data: { label: 'Oscar CRM', description: 'Lead Processing', variant: 'core', icon: 'Database' }, parentId: 'group-marketing', extent: 'parent' },
];

const initialEdges: Edge[] = [
  // Drive & GitHub
  { id: 'e-drive-github', source: 'drive', target: 'github', animated: true, style: { strokeDasharray: '5' } },

  // Infinite Context Wrapups
  { id: 'e-drive-wrapups', source: 'drive', target: 'wrapups', sourceHandle: 's-right', targetHandle: 't-left', animated: true, label: 'Infinite Context', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-github-wrapups', source: 'github', target: 'wrapups', sourceHandle: 's-right', targetHandle: 't-left', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },

  // Wrapups Assigning Tasks
  { id: 'e-wrapups-exec', source: 'wrapups', target: 'exec', targetHandle: 't-right', label: 'Assigns Tasks', markerEnd: { type: MarkerType.ArrowClosed } },

  // Clients to Services
  { id: 'e-clients-cc', source: 'clients', target: 'cc', sourceHandle: 's-right', targetHandle: 't-left', label: 'In-Person', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-clients-virtual', source: 'clients', target: 'virtual', sourceHandle: 's-right', targetHandle: 't-left', label: 'Remote', markerEnd: { type: MarkerType.ArrowClosed } },

  // Wrapped Chat
  { id: 'e-cc-wrapped', source: 'cc', target: 'wrapped-chat', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-wrapped-gchat', source: 'wrapped-chat', target: 'gchat', sourceHandle: 's-right', animated: true },

  // Comms
  { id: 'e-exec-gchat', source: 'exec', target: 'gchat', label: 'Work Comms' },
  { id: 'e-trainers-gchat', source: 'trainers', target: 'gchat' },
  
  // Phone -> Twilio -> JADE
  { id: 'e-phone-twilio', source: 'phone', target: 'twilio', sourceHandle: 's-right', targetHandle: 't-left', label: 'Voice/Text Control', markerEnd: { type: MarkerType.ArrowClosed }, animated: true },
  { id: 'e-twilio-jade', source: 'twilio', target: 'jade', label: 'Remote Execution', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-jade-twilio', source: 'jade', target: 'twilio', sourceHandle: 's-left', targetHandle: 't-right', label: 'Alerts', animated: true },

  // Marketing
  { id: 'e-seo-audits', source: 'seo', target: 'audits', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-audits-exec', source: 'audits', target: 'exec', targetHandle: 't-right', label: 'Emails exec' },
  { id: 'e-exec-website', source: 'exec', target: 'website', sourceHandle: 's-right', targetHandle: 't-left', label: 'Updates' },
  { id: 'e-website-oscar', source: 'website', target: 'oscar', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Feeds Leads' },
  { id: 'e-oscar-twilio', source: 'oscar', target: 'twilio', sourceHandle: 's-left', targetHandle: 't-right', label: 'Texts Leads' },

  // Billing
  { id: 'e-cc-billing', source: 'cc', target: 'billing-engine', sourceHandle: 's-right', targetHandle: 't-left', label: 'Rates/Intent', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-calendar-billing', source: 'calendar', target: 'billing-engine', sourceHandle: 's-right', targetHandle: 't-top', label: 'Attendance', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-stripe-billing', source: 'stripe', target: 'billing-engine', markerEnd: { type: MarkerType.ArrowClosed }, label: 'Payment Verify' },
  { id: 'e-billing-payroll', source: 'billing-engine', target: 'payroll', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-payroll-trainers', source: 'payroll', target: 'trainers', sourceHandle: 's-left', targetHandle: 't-right', label: 'Payouts', animated: true },

  // People & Data
  { id: 'e-trainers-calendar', source: 'trainers', target: 'calendar', sourceHandle: 's-right', targetHandle: 't-bottom' },
  { id: 'e-exec-calendar', source: 'exec', target: 'calendar', sourceHandle: 's-right', targetHandle: 't-left' }
];

const nodeTypes = {
  custom: CustomNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <>
      <div className="app-header">
        <div className="app-title">
          <div className="pulse-dot"></div>
          RxFit Headless Enterprise
        </div>
      </div>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-right"
        >
          <Background color="rgba(255, 255, 255, 0.05)" gap={24} size={2} />
          <Controls />
          <MiniMap 
            nodeColor={(n) => {
              if (n.data?.variant === 'group') return 'rgba(255,255,255,0.05)';
              return '#10b981';
            }} 
          />
        </ReactFlow>
      </div>
    </>
  );
}
