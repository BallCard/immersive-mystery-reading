import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scene, Choice, Hotspot } from '../types';
import { Search, Eye } from 'lucide-react';

interface NarrativeEngineProps {
  scene: Scene;
  onChoice: (choice: Choice) => void;
  onHotspotClick: (hotspot: Hotspot) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export const NarrativeEngine: React.FC<NarrativeEngineProps> = ({
  scene,
  onChoice,
  onHotspotClick,
  onTypingChange
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneIdRef = useRef<string>('');

  const skipTyping = useCallback(() => {
    if (!isTyping) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayText(scene.text);
    setIsTyping(false);
    onTypingChange?.(false);
  }, [isTyping, scene.text, onTypingChange]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentSceneId = scene.id;
    sceneIdRef.current = currentSceneId;

    // Reset state
    setDisplayText('');
    setIsTyping(true);
    onTypingChange?.(true);

    const text = scene.text;
    let index = 0;

    intervalRef.current = setInterval(() => {
      // Guard: if scene changed, stop
      if (sceneIdRef.current !== currentSceneId) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      if (index < text.length) {
        index++;
        setDisplayText(text.substring(0, index));
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        onTypingChange?.(false);
      }
    }, 25);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [scene.id]);

  // Keyboard navigation: 1-9 to select choice, Space/Enter to skip typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          skipTyping();
        }
        return;
      }
      const num = parseInt(e.key);
      if (num >= 1 && num <= scene.choices.length) {
        e.preventDefault();
        onChoice(scene.choices[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, scene.choices, onChoice, skipTyping]);

  // Update display when scene text is fully typed (for scene changes)
  useEffect(() => {
    if (!isTyping) {
      setDisplayText(scene.text);
    }
  }, [scene.text, isTyping]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8 space-y-6"
      >
        {/* Immersive Scene Area */}
        <div className="relative group flex-1 min-h-[400px] flex flex-col">
          <div
            className="relative flex-1 rounded-sm overflow-hidden border border-white/5 bg-noir-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] h-full"
          >
            {scene.imageUrl ? (
              <>
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspots - always visible when they exist */}
                {scene.hotspots?.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => onHotspotClick(spot)}
                    className="absolute z-20 flex items-center justify-center hover:scale-125 transition-transform"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.radius}px`, height: `${spot.radius}px`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="w-2 h-2 bg-detective-red rounded-full animate-ping" />
                    <div className="absolute inset-0 border border-detective-red/50 rounded-full bg-detective-red/10" />
                    <span className="absolute top-full mt-2 bg-noir-950 text-[10px] px-2 py-0.5 rounded border border-white/10 whitespace-nowrap shadow-xl">
                      {spot.label}
                    </span>
                  </button>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-noir-800">
                <Search className="w-12 h-12 text-noir-700 animate-pulse" />
              </div>
            )}

            {/* Narrative Overlay on image */}
            <div
              className="absolute bottom-0 left-0 right-0 p-8 md:p-10 bg-gradient-to-t from-noir-950 via-noir-950/90 to-transparent cursor-pointer"
              onClick={skipTyping}
            >
              <div className="status-chip mb-4">场景：{scene.title}</div>
              <div className="min-h-[80px]">
                <p className="narrative-text whitespace-pre-wrap">
                  {displayText}
                  {isTyping && <span className="inline-block w-2 h-6 bg-detective-red ml-1 animate-pulse" />}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Choices Area */}
        <div className="min-h-[140px]">
          {!isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8"
            >
              {scene.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice)}
                  className="px-6 py-3 bg-transparent border border-noir-700 text-noir-200 rounded-lg hover:border-detective-red hover:text-detective-red transform hover:-translate-y-1 transition-all duration-300 font-sans text-xs uppercase tracking-widest flex items-center justify-center gap-3 group"
                  id={`choice-${choice.id}`}
                >
                  <span className="w-1.5 h-1.5 bg-noir-700 group-hover:bg-detective-red rounded-full transition-colors" />
                  {choice.text}
                </button>
              ))}

              {scene.hotspots && scene.hotspots.length > 0 && (
                <div className="md:col-span-2 text-center py-2 flex items-center justify-center gap-2 opacity-50">
                  <Eye className="w-3 h-3" />
                  <span className="mono-label text-[8px]">点击红色标记获取更多线索</span>
                </div>
              )}

              {/* Keyboard hint */}
              <div className="md:col-span-2 text-center opacity-30">
                <span className="mono-label text-[8px]">
                  {isTyping ? '空格/回车跳过 · ' : ''}数字键选择选项
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
