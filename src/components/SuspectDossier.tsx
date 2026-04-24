import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suspect } from '../types';
import { User, AlertCircle, CheckCircle2, ShieldQuestion, Save, PenLine, ChevronDown, ChevronUp, Link as LinkIcon, Eye, UserCheck } from 'lucide-react';

interface SuspectDossierProps {
  suspects: Suspect[];
  notes: Record<string, string>;
  onUpdateNote: (id: string, note: string) => void;
  onUpdateStatus: (id: string, status: Suspect['status']) => void;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'innocent': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'suspicious': return <AlertCircle className="w-4 h-4 text-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />;
    case 'guilty': return <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />;
    default: return <ShieldQuestion className="w-4 h-4 text-noir-400" />;
  }
};

const STATUS_OPTIONS: { value: Suspect['status']; label: string }[] = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'suspicious', label: 'Suspicious' },
  { value: 'guilty', label: 'Guilty' },
  { value: 'innocent', label: 'Innocent' },
];

interface SuspectCardProps {
  key?: React.Key;
  suspect: Suspect;
  initialNote: string | undefined;
  onSaveNote: (id: string, note: string) => void;
  onUpdateStatus: (id: string, status: Suspect['status']) => void;
  idx: number;
}

const SuspectCard = ({
  suspect,
  initialNote,
  onSaveNote,
  onUpdateStatus,
  idx
}: SuspectCardProps) => {
  const [note, setNote] = useState(initialNote || '');
  const [isCasesExpanded, setIsCasesExpanded] = useState(false);
  const [showAlibi, setShowAlibi] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-noir-900 border border-noir-600 rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-2xl hover:border-noir-400 transition-colors"
    >
      {/* Mugshot Area */}
      <div className="w-full sm:w-40 aspect-square sm:aspect-auto bg-noir-800 relative overflow-hidden grayscale contrast-125 brightness-90 group-hover:grayscale-0 transition-all duration-700 border-r border-noir-600">
        {suspect.imageUrl ? (
          <img src={suspect.imageUrl} alt={suspect.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <User className="w-20 h-20" />
          </div>
        )}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-noir-950/80 text-[8px] font-mono tracking-tighter border border-white/5 rounded">
          REF: {suspect.id.toUpperCase()}
        </div>
      </div>

      {/* Data area */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white font-serif italic">{suspect.name}</h3>
            <span className="mono-label text-[9px] text-detective-red opacity-80">{suspect.role}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5">
            <StatusIcon status={suspect.status} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-noir-400">{suspect.status}</span>
          </div>
        </div>

        <p className="text-xs text-noir-200 leading-relaxed font-serif italic mb-6 border-l border-detective-red/20 pl-4 bg-white/[0.01] py-2">
          {suspect.bio}
        </p>

        {/* Related Cases Section */}
        <div className="mb-4 border-b border-white/5 pb-2">
          <button
            onClick={() => setIsCasesExpanded(!isCasesExpanded)}
            className="w-full flex items-center justify-between py-2 text-left group/btn"
          >
            <span className="mono-label text-[8px] flex items-center gap-1 opacity-50 group-hover/btn:opacity-100 transition-opacity uppercase">
              <LinkIcon className="w-2 h-2" /> Related Cases
            </span>
            {isCasesExpanded ? <ChevronUp className="w-3 h-3 text-noir-600" /> : <ChevronDown className="w-3 h-3 text-noir-600" />}
          </button>
          <AnimatePresence>
            {isCasesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-2 space-y-2">
                  {(!suspect.relatedCases || suspect.relatedCases.length === 0) ? (
                    <p className="text-[10px] text-noir-600 italic">No linked dossiers found in current archives.</p>
                  ) : (
                    suspect.relatedCases.map((c) => (
                      <div key={c.id} className="p-2 bg-white/[0.02] border border-white/5 rounded text-[10px] font-mono">
                        <span className="text-detective-gold mr-2">[{c.id}]</span>
                        <span className="text-noir-300">{c.description}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notes Section */}
        <div className="flex-1 flex flex-col space-y-2 mb-4 bg-white/[0.02] p-3 rounded border border-white/5">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[8px] flex items-center gap-1 opacity-50">
              <PenLine className="w-2 h-2" /> Detective Notes
            </span>
            <button
              onClick={() => onSaveNote(suspect.id, note)}
              className="text-[8px] font-mono flex items-center gap-1 text-noir-400 hover:text-white transition-colors"
            >
              <Save className="w-2 h-2" /> Save Note
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="输入你的观察记录..."
            className="flex-1 bg-transparent border-none resize-none text-[11px] text-noir-200 placeholder:text-noir-600 focus:ring-0 font-serif leading-relaxed min-h-[60px]"
          />
        </div>

        {/* Alibi Panel */}
        <AnimatePresence>
          {showAlibi && suspect.alibi && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-detective-red/5 border border-detective-red/20 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3 h-3 text-detective-red" />
                  <span className="mono-label text-[9px] text-detective-red uppercase">Alibi / 不在场证明</span>
                </div>
                <p className="text-[11px] text-noir-200 leading-relaxed font-serif italic pl-5 border-l border-detective-red/20">
                  {suspect.alibi}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Menu */}
        <AnimatePresence>
          {showStatusMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white/[0.03] border border-white/10 rounded p-2 flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onUpdateStatus(suspect.id, opt.value);
                      setShowStatusMenu(false);
                    }}
                    className={`text-[9px] font-mono px-3 py-1.5 rounded uppercase tracking-tighter transition-all ${
                      suspect.status === opt.value
                        ? 'bg-detective-red/20 text-detective-red border border-detective-red/30'
                        : 'bg-white/5 hover:bg-white/10 text-noir-300 border border-transparent'
                    }`}
                  >
                    <span className="mr-1.5"><StatusIcon status={opt.value} /></span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-4 border-t border-white/5 flex gap-2">
          <button
            onClick={() => { setShowAlibi(!showAlibi); setShowStatusMenu(false); }}
            className={`text-[9px] font-mono px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded uppercase tracking-tighter flex items-center gap-1.5 ${
              showAlibi ? 'text-detective-gold' : ''
            }`}
          >
            <Eye className="w-3 h-3" />
            {showAlibi ? 'Hide Alibi' : 'View Alibi'}
          </button>
          <button
            onClick={() => { setShowStatusMenu(!showStatusMenu); setShowAlibi(false); }}
            className={`text-[9px] font-mono px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded uppercase tracking-tighter text-detective-red flex items-center gap-1.5 ${
              showStatusMenu ? 'ring-1 ring-detective-red/30' : ''
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Mark as...
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const SuspectDossier: React.FC<SuspectDossierProps> = ({ suspects, notes, onUpdateNote, onUpdateStatus }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {suspects.map((suspect, idx) => (
        <SuspectCard
          key={suspect.id}
          suspect={suspect}
          initialNote={notes[suspect.id]}
          onSaveNote={onUpdateNote}
          onUpdateStatus={onUpdateStatus}
          idx={idx}
        />
      ))}
    </div>
  );
};
