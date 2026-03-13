import React from 'react';
import { Handle, Position } from '@xyflow/react';
import * as Icons from 'lucide-react';

export default function CustomNode({ data }: { data: any }) {
  // Dynamically get the icon component from lucide-react based on data.icon string
  // Fallback to Box if not found
  const IconComponent = Icons[data.icon as keyof typeof Icons] as React.ElementType || Icons.Box;

  return (
    <div className={`rx-node ${data.variant || 'core'}`}>
      <Handle type="target" position={Position.Top} id="top" style={{ background: 'transparent', border: 'none' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: 'transparent', border: 'none' }} />
      
      <div className="rx-node-header">
        <div className="rx-node-icon">
          <IconComponent size={20} strokeWidth={1.5} />
        </div>
        <div className="rx-node-title">
          {data.label}
        </div>
      </div>
      
      {data.description && (
        <div className="rx-node-desc">
          {data.description}
        </div>
      )}

      {/* TARGET HANDLES */}
      <Handle type="target" position={Position.Top} id="t-top" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="t-bottom" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="t-left" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="t-right" style={{ opacity: 0 }} />

      {/* SOURCE HANDLES */}
      <Handle type="source" position={Position.Top} id="s-top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="s-bottom" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="s-left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="s-right" style={{ opacity: 0 }} />
    </div>
  );
}
