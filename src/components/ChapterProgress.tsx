import React from 'react';
import { motion } from 'motion/react';

const ACTS = [
  { id: 'act1', label: '第一幕', range: ['start', 'part1_end'] },
  { id: 'act2', label: '第二幕', range: ['investigation_start', 'homeless_missing'] },
  { id: 'act3', label: '第三幕', range: ['part3_start', 'ending'] },
];

const SCENE_ORDER = [
  'start', 'calendar_check', 'bentou_shop', 'school_path', 'river_thinking',
  'school_arrival', 'class_scene', 'judo_club', 'after_school', 'knock_door',
  'observe_first', 'cockroach_excuse', 'direct_question', 'call_decision',
  'phone_call', 'call_police', 'offer_help', 'solution_proposal',
  'accept_help', 'ishigami_action', 'surrender', 'part1_end',
  'investigation_start', 'identify_body', 'investigation_progress',
  'alibi_check', 'kusanagi_thinking', 'ishigami_interview', 'yukawa_intro',
  'yukawa_ishigami_meet', 'genius_conversation', 'yukawa_suspicion',
  'yukawa_homeless_visit', 'homeless_missing',
  'part3_start', 'yukawa_deduction', 'river_twilight', 'yukawa_confront',
  'ishigami_realization', 'final_letter', 'ishigami_surrender',
  'ishigami_interrogation', 'truth_weight', 'yasuko_decision', 'devotion', 'ending',
];

interface ChapterProgressProps {
  currentSceneId: string;
}

export const ChapterProgress: React.FC<ChapterProgressProps> = ({ currentSceneId }) => {
  const currentIdx = SCENE_ORDER.indexOf(currentSceneId);
  const currentActIdx = ACTS.findIndex(act => {
    const startIdx = SCENE_ORDER.indexOf(act.range[0]);
    const endIdx = SCENE_ORDER.indexOf(act.range[1]);
    return currentIdx >= startIdx && currentIdx <= endIdx;
  });

  return (
    <div className="px-4 py-3 border-t border-noir-600">
      <div className="flex items-center gap-2 mb-2">
        {ACTS.map((act, i) => {
          const isPast = i < currentActIdx;
          const isCurrent = i === currentActIdx;
          return (
            <React.Fragment key={act.id}>
              <div className="flex items-center gap-2 flex-1">
                <motion.div
                  animate={{
                    backgroundColor: isCurrent ? '#C53030' : isPast ? '#CBD5E0' : 'transparent',
                    scale: isCurrent ? 1.2 : 1,
                  }}
                  className="w-2 h-2 rounded-full border border-white/20 shrink-0"
                />
                <span className={`text-[9px] font-mono tracking-wider truncate ${
                  isCurrent ? 'text-detective-red' : isPast ? 'text-noir-400' : 'text-noir-600'
                }`}>
                  {act.label}
                </span>
                <div className={`flex-1 h-px ${isPast ? 'bg-noir-400' : 'bg-noir-700'}`} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="w-full h-1 bg-noir-800 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${Math.max(2, (currentIdx / (SCENE_ORDER.length - 1)) * 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-detective-red to-detective-red/60 rounded-full"
        />
      </div>
    </div>
  );
};
