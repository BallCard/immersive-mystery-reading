import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState } from '../types';
import { Save, Upload, Trash2, X, Clock, ScrollText } from 'lucide-react';

interface SaveSlot {
  id: number;
  timestamp: string;
  sceneTitle: string;
  sceneId: string;
  evidenceCount: number;
  state: GameState;
}

interface SaveLoadSystemProps {
  gameState: GameState;
  onLoad: (state: GameState) => void;
  isOpen: boolean;
  onClose: () => void;
  sceneTitle: string;
}

const STORAGE_KEY = 'midnight_echoes_saves';

const loadSaves = (): SaveSlot[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSaves = (saves: SaveSlot[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
};

export const SaveLoadSystem: React.FC<SaveLoadSystemProps> = ({
  gameState, onLoad, isOpen, onClose, sceneTitle
}) => {
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [mode, setMode] = useState<'save' | 'load'>('save');

  useEffect(() => {
    setSaves(loadSaves());
  }, [isOpen]);

  const handleSave = (slotId: number) => {
    const existing = saves.filter(s => s.id !== slotId);
    const newSlot: SaveSlot = {
      id: slotId,
      timestamp: new Date().toLocaleString('zh-CN'),
      sceneTitle,
      sceneId: gameState.currentSceneId,
      evidenceCount: gameState.discoveredEvidenceIds.length,
      state: { ...gameState },
    };
    const updated = [...existing, newSlot].sort((a, b) => a.id - b.id);
    saveSaves(updated);
    setSaves(updated);
  };

  const handleLoad = (slot: SaveSlot) => {
    onLoad(slot.state);
    onClose();
  };

  const handleDelete = (slotId: number) => {
    const updated = saves.filter(s => s.id !== slotId);
    saveSaves(updated);
    setSaves(updated);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-noir-950/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-noir-900 border border-white/10 shadow-2xl rounded-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('save')}
                  className={`mono-label text-xs flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                    mode === 'save' ? 'border-detective-red text-detective-red' : 'border-transparent text-noir-600 hover:text-noir-400'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" /> 存档
                </button>
                <button
                  onClick={() => setMode('load')}
                  className={`mono-label text-xs flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                    mode === 'load' ? 'border-detective-red text-detective-red' : 'border-transparent text-noir-600 hover:text-noir-400'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> 读档
                </button>
              </div>
              <button onClick={onClose} className="text-noir-600 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slots */}
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(slotId => {
                const slot = saves.find(s => s.id === slotId);
                return (
                  <div
                    key={slotId}
                    className="flex items-center gap-4 p-3 border border-white/5 rounded bg-noir-800/50 hover:border-white/10 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center border border-white/10 rounded text-[10px] font-mono text-noir-600">
                      {slotId}
                    </div>

                    {slot ? (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{slot.sceneTitle}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[9px] font-mono text-noir-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {slot.timestamp}
                            </span>
                            <span className="text-[9px] font-mono text-noir-400 flex items-center gap-1">
                              <ScrollText className="w-2.5 h-2.5" /> {slot.evidenceCount} 条线索
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {mode === 'load' && (
                            <button
                              onClick={() => handleLoad(slot)}
                              className="p-1.5 text-noir-400 hover:text-detective-red transition-colors"
                              title="读取"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                          {mode === 'save' && (
                            <button
                              onClick={() => handleSave(slotId)}
                              className="p-1.5 text-noir-400 hover:text-detective-red transition-colors"
                              title="覆盖保存"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(slotId)}
                            className="p-1.5 text-noir-400 hover:text-red-400 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <p className="text-sm text-noir-600 italic">空存档位</p>
                        </div>
                        {mode === 'save' && (
                          <button
                            onClick={() => handleSave(slotId)}
                            className="p-1.5 text-noir-400 hover:text-detective-red transition-colors"
                            title="保存"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-4">
              <p className="mono-label text-[8px] text-noir-600 text-center">
                数据保存在本地浏览器中
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
