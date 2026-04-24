import React from 'react';
import { motion } from 'motion/react';
import { TimelineEvent } from '../types';
import { BookOpen, Fingerprint, Search, ChevronRight } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  currentSceneId: string;
  onJumpToScene: (sceneId: string) => void;
  discoveredSceneIds: string[];
}

const typeConfig = {
  story: { icon: BookOpen, color: 'text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-400/10' },
  evidence: { icon: Fingerprint, color: 'text-detective-red', border: 'border-detective-red/30', bg: 'bg-detective-red/10' },
  investigation: { icon: Search, color: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10' },
};

export const Timeline: React.FC<TimelineProps> = ({ events, currentSceneId, onJumpToScene, discoveredSceneIds }) => {
  return (
    <div className="relative px-6 py-4">
      {/* Legend */}
      <div className="flex gap-4 mb-8 justify-center">
        {Object.entries(typeConfig).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
            <span className="mono-label text-[8px] opacity-60">
              {type === 'story' ? '故事' : type === 'evidence' ? '证据' : '调查'}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-detective-red/50 via-noir-600 to-transparent" />

        <div className="space-y-1">
          {events.map((event, idx) => {
            const isDiscovered = discoveredSceneIds.includes(event.sceneId);
            const isCurrent = currentSceneId === event.sceneId;
            const cfg = typeConfig[event.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative flex items-start gap-4 pl-1 group cursor-pointer ${
                  !isDiscovered ? 'opacity-30' : ''
                }`}
                onClick={() => isDiscovered && onJumpToScene(event.sceneId)}
              >
                {/* Dot */}
                <div className={`relative z-10 w-[10px] h-[10px] rounded-full mt-1.5 shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-detective-red shadow-[0_0_12px_rgba(197,48,48,0.6)] scale-125'
                    : isDiscovered
                      ? `${cfg.bg} border-2 ${cfg.border}`
                      : 'bg-noir-700 border border-noir-600'
                }`} />

                {/* Card */}
                <div className={`flex-1 pb-6 ${isDiscovered ? 'group-hover:bg-white/[0.02]' : ''} transition-colors rounded-lg p-3 -mt-1`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="mono-label text-[8px] opacity-40">{event.date}</span>
                    {isCurrent && (
                      <span className="text-[8px] font-mono text-detective-red bg-detective-red/10 px-1.5 py-0.5 rounded">
                        当前
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${cfg.color}`} />
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold tracking-tight mb-0.5 ${
                        isCurrent ? 'text-detective-red' : 'text-white'
                      }`}>
                        {isDiscovered || isCurrent ? event.title : '???'}
                      </h4>
                      <p className="text-[11px] text-noir-400 leading-relaxed">
                        {isDiscovered || isCurrent ? event.description : '尚未发现'}
                      </p>
                    </div>
                    {isDiscovered && !isCurrent && (
                      <ChevronRight className="w-3.5 h-3.5 text-noir-600 group-hover:text-detective-red transition-colors shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
