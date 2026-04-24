import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Suspect, CharacterRelation } from '../types';

interface RelationshipMapProps {
  suspects: Suspect[];
  relations: CharacterRelation[];
}

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  ishigami: { x: 25, y: 30 },
  yasuko: { x: 55, y: 25 },
  misato: { x: 75, y: 35 },
  togashi: { x: 55, y: 70 },
  yukawa: { x: 20, y: 70 },
  kusanagi: { x: 40, y: 85 },
};

const RELATION_COLORS: Record<string, string> = {
  love: '#EC4899',
  family: '#8B5CF6',
  friend: '#3B82F6',
  colleague: '#10B981',
  enemy: '#EF4444',
  case: '#F59E0B',
};

export const RelationshipMap: React.FC<RelationshipMapProps> = ({ suspects, relations }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredRelation, setHoveredRelation] = useState<number | null>(null);

  const isRelationHighlighted = (rel: CharacterRelation, idx: number) => {
    if (hoveredRelation === idx) return true;
    if (hoveredNode && (rel.from === hoveredNode || rel.to === hoveredNode)) return true;
    return false;
  };

  return (
    <div className="p-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {Object.entries(RELATION_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
            <span className="mono-label text-[8px] opacity-60">
              {type === 'love' ? '暗恋' : type === 'family' ? '家人' : type === 'friend' ? '朋友' : type === 'colleague' ? '同事' : type === 'enemy' ? '敌对' : '案件'}
            </span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="relative w-full aspect-square max-w-2xl mx-auto bg-noir-900/50 border border-white/5 rounded-lg overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {[20, 40, 60, 80].map(v => (
            <React.Fragment key={v}>
              <line x1={`${v}%`} y1="0" x2={`${v}%`} y2="100%" stroke="white" strokeWidth="0.5" />
              <line x1="0" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke="white" strokeWidth="0.5" />
            </React.Fragment>
          ))}
        </svg>

        {/* Relations (SVG lines) */}
        <svg className="absolute inset-0 w-full h-full z-10">
          {relations.map((rel, idx) => {
            const from = NODE_POSITIONS[rel.from];
            const to = NODE_POSITIONS[rel.to];
            if (!from || !to) return null;
            const highlighted = isRelationHighlighted(rel, idx);
            const color = RELATION_COLORS[rel.type] || '#F59E0B';

            return (
              <g key={idx}>
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: highlighted ? 0.8 : 0.2 }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  x1={`${from.x}%`} y1={`${from.y}%`}
                  x2={`${to.x}%`} y2={`${to.y}%`}
                  stroke={color}
                  strokeWidth={highlighted ? 2 : 1}
                  strokeDasharray={rel.type === 'case' ? '4 4' : 'none'}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredRelation(idx)}
                  onMouseLeave={() => setHoveredRelation(null)}
                />
                {/* Label on midpoint */}
                {highlighted && (
                  <motion.text
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x={`${(from.x + to.x) / 2}%`}
                    y={`${(from.y + to.y) / 2 - 2}%`}
                    textAnchor="middle"
                    className="text-[8px] fill-noir-200 font-mono"
                  >
                    {rel.label}
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Character nodes */}
        {suspects.map((suspect, idx) => {
          const pos = NODE_POSITIONS[suspect.id];
          if (!pos) return null;

          return (
            <motion.div
              key={suspect.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
              className={`absolute z-20 flex flex-col items-center cursor-pointer group ${
                suspect.status === 'suspicious' ? '' : ''
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredNode(suspect.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all duration-300 ${
                hoveredNode === suspect.id
                  ? 'border-detective-red shadow-[0_0_20px_rgba(197,48,48,0.4)] scale-110'
                  : suspect.status === 'suspicious'
                    ? 'border-amber-500/50'
                    : suspect.status === 'guilty'
                      ? 'border-red-600/50'
                      : 'border-white/20'
              } bg-noir-800`}>
                {suspect.imageUrl ? (
                  <img src={suspect.imageUrl} alt={suspect.name} className="w-full h-full object-cover grayscale" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-noir-600 text-xs font-bold">
                    {suspect.name[0]}
                  </div>
                )}
              </div>

              {/* Name label */}
              <span className={`mt-1 mono-label text-[9px] whitespace-nowrap transition-colors ${
                hoveredNode === suspect.id ? 'text-white' : 'text-noir-400'
              }`}>
                {suspect.name}
              </span>
              <span className="text-[7px] text-noir-600 font-mono whitespace-nowrap">
                {suspect.role.length > 8 ? suspect.role.substring(0, 8) + '…' : suspect.role}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
