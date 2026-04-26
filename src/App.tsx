/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, ScrollText, Settings, Play, Archive, Clock, GitBranch, Save } from 'lucide-react';
import { Scene, Choice, GameState, Evidence, Suspect, Hotspot, CaseRecord } from './types';
import { INITIAL_SCENES, INITIAL_EVIDENCE, INITIAL_SUSPECTS, TIMELINE_EVENTS, CHARACTER_RELATIONS } from './constants';
import { NarrativeEngine } from './components/NarrativeEngine';
import { EvidenceBoard } from './components/EvidenceBoard';
import { SuspectDossier } from './components/SuspectDossier';
import { RainOverlay, FogOverlay } from './components/AtmosphericEffects';
import { AudioManager } from './components/AudioManager';
import { CaseArchive } from './components/CaseArchive';
import { ChapterProgress } from './components/ChapterProgress';
import { Timeline } from './components/Timeline';
import { RelationshipMap } from './components/RelationshipMap';
import { SaveLoadSystem } from './components/SaveLoadSystem';

const TAB_OPTIONS = [
  { id: 'scene', label: '故事', icon: Search },
  { id: 'evidence', label: '证据', icon: ScrollText },
  { id: 'suspects', label: '嫌疑人', icon: Users },
  { id: 'timeline', label: '时间线', icon: Clock },
  { id: 'relations', label: '关系图', icon: GitBranch },
  { id: 'archives', label: '档案', icon: Archive },
];

// Scenes that belong to each act
const ACT1_SCENES = ['start','calendar_check','bentou_shop','school_path','river_thinking','school_arrival','class_scene','judo_club','after_school','knock_door','observe_first','cockroach_excuse','direct_question','call_decision','phone_call','call_police','offer_help','solution_proposal','accept_help','ishigami_action','surrender','part1_end'];
const ACT2_SCENES = ['investigation_start','identify_body','investigation_progress','alibi_check','kusanagi_thinking','ishigami_interview','yukawa_intro','yukawa_ishigami_meet','genius_conversation','yukawa_suspicion','yukawa_homeless_visit','homeless_missing'];
const ACT3_SCENES = ['part3_start','yukawa_deduction','river_twilight','yukawa_confront','ishigami_realization','final_letter','ishigami_surrender','ishigami_interrogation','truth_weight','yasuko_decision','devotion','ending'];

function getActLabel(sceneId: string): string {
  if (ACT1_SCENES.includes(sceneId)) return '第一幕 · 命案之夜';
  if (ACT2_SCENES.includes(sceneId)) return '第二幕 · 调查';
  if (ACT3_SCENES.includes(sceneId)) return '第三幕 · 真相';
  return '序章';
}

// Track visited scenes
function getVisitedSceneIds(gameState: GameState): string[] {
  // Include current + all scenes we can infer were visited
  const { currentSceneId } = gameState;
  const allScenes = [...ACT1_SCENES, ...ACT2_SCENES, ...ACT3_SCENES];
  const currentIdx = allScenes.indexOf(currentSceneId);
  if (currentIdx === -1) return [currentSceneId];
  return allScenes.slice(0, currentIdx + 1);
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: 'start',
    discoveredEvidenceIds: [],
    interactedSuspectIds: [],
    journalEntries: [],
    suspectNotes: {},
    archivedCases: [],
  });

  const [activeTab, setActiveTab] = useState('scene');
  const [hasStarted, setHasStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [suspectStatuses, setSuspectStatuses] = useState<Record<string, Suspect['status']>>(
    Object.fromEntries(INITIAL_SUSPECTS.map(s => [s.id, s.status]))
  );

  const currentScene = useMemo(() => INITIAL_SCENES[gameState.currentSceneId], [gameState.currentSceneId]);

  const discoveredEvidence = useMemo(() =>
    INITIAL_EVIDENCE.filter(e => gameState.discoveredEvidenceIds.includes(e.id)),
    [gameState.discoveredEvidenceIds]
  );

  const visitedSceneIds = useMemo(() => getVisitedSceneIds(gameState), [gameState]);

  const currentActLabel = useMemo(() => getActLabel(gameState.currentSceneId), [gameState.currentSceneId]);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((msg: string, duration = 3000) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), duration);
  }, []);

  const handleChoice = (choice: Choice) => {
    if (choice.id === 'c2' && !gameState.discoveredEvidenceIds.includes('letter_1')) {
      discoverEvidence('letter_1');
    }

    setGameState(prev => ({
      ...prev,
      currentSceneId: choice.targetSceneId,
      interactedSuspectIds: [...new Set([...prev.interactedSuspectIds, 'unknown_informant'])]
    }));
    setActiveTab('scene');
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const discoverEvidence = (id: string) => {
    if (gameState.discoveredEvidenceIds.includes(id)) return;

    const item = INITIAL_EVIDENCE.find(e => e.id === id);
    setGameState(prev => ({
      ...prev,
      discoveredEvidenceIds: [...prev.discoveredEvidenceIds, id]
    }));
    showNotification(`发现新证据: ${item?.name}`);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.discoveryEvidenceId) {
      discoverEvidence(hotspot.discoveryEvidenceId);
    }
    if (hotspot.targetSceneId) {
      setGameState(prev => ({ ...prev, currentSceneId: hotspot.targetSceneId! }));
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const updateSuspectNote = (suspectId: string, note: string) => {
    setGameState(prev => ({
      ...prev,
      suspectNotes: {
        ...prev.suspectNotes,
        [suspectId]: note
      }
    }));
    showNotification('笔记已保存', 2000);
  };

  const updateSuspectStatus = (suspectId: string, status: Suspect['status']) => {
    setSuspectStatuses(prev => ({ ...prev, [suspectId]: status }));
    const statusLabels: Record<string, string> = { innocent: '无辜', suspicious: '嫌疑人', guilty: '有罪', unknown: '未知' };
    showNotification(`状态已更新: ${statusLabels[status]}`, 2000);
  };

  const suspectsWithStatus = useMemo(() =>
    INITIAL_SUSPECTS.map(s => ({ ...s, status: suspectStatuses[s.id] || s.status })),
    [suspectStatuses]
  );

  const handleArchiveCase = () => {
    const newRecord: CaseRecord = {
      id: `CASE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      title: currentScene.title,
      completionDate: new Date().toLocaleDateString(),
      summary: currentScene.text.substring(0, 80) + '...',
      evidenceCount: gameState.discoveredEvidenceIds.length
    };

    setGameState(prev => ({
      ...prev,
      archivedCases: [newRecord, ...prev.archivedCases],
      currentSceneId: 'start',
      discoveredEvidenceIds: [],
      interactedSuspectIds: [],
    }));

    setActiveTab('archives');
    showNotification('案卷已归档');
  };

  const handleJumpToScene = (sceneId: string) => {
    setGameState(prev => ({ ...prev, currentSceneId: sceneId }));
    setActiveTab('scene');
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleLoadGame = (state: GameState) => {
    setGameState(state);
    setActiveTab('scene');
    showNotification('存档已读取');
  };

  // Determine if fog should be shown
  const showFog = currentScene?.ambientEffect === 'fog';

  // Auto-progress for scenes marked with autoProgress
  useEffect(() => {
    if (currentScene?.autoProgress && currentScene.choices.length > 0) {
      const timer = setTimeout(() => {
        handleChoice(currentScene.choices[0]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentSceneId]);

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-noir-950 overflow-hidden cursor-pointer" onClick={() => setHasStarted(true)}>
        <div className="grain-overlay" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 z-10 p-6"
        >
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              嫌疑人X的献身
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mono-label text-base tracking-[0.3em] text-detective-red"
            >
              THE DEVOTION OF SUSPECT X
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="pt-8"
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); setHasStarted(true); }}
              className="group relative px-12 py-4 bg-transparent border border-white/20 hover:border-detective-red hover:text-detective-red text-white overflow-hidden transition-all duration-500"
              id="start-button"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-detective-red/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-3 font-mono text-sm tracking-widest">
                开始阅读 <Play className="w-4 h-4 fill-current" />
              </span>
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 3 }}
            className="mono-label text-[10px] tracking-widest"
          >
            点击任意处开始
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-12 space-y-4"
        >
          <div className="w-32 h-1 bg-white" />
          <p className="mono-label text-xs">CASE: 富㭴慎二被杀案</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2.8 }}
          className="absolute top-12 right-12 text-right"
        >
          <p className="mono-label text-xs">东京 · 江东区</p>
          <p className="mono-label text-xs opacity-50">三月</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-noir-950 overflow-hidden font-sans relative">
      <div className="grain-overlay" />
      <RainOverlay />
      {showFog && <FogOverlay />}

      {/* Sidebar navigation */}
      <aside className="w-16 md:w-20 bg-noir-950 border-r border-noir-600 flex flex-col items-center py-6 z-30 shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 bg-detective-red rounded rotate-45 flex items-center justify-center transform hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(197,48,48,0.3)] mb-6">
          <span className="text-white -rotate-45 font-bold text-lg">X</span>
        </div>

        {/* Chapter progress */}
        <div className="w-full px-2 mb-4">
          <ChapterProgress currentSceneId={gameState.currentSceneId} />
        </div>

        {/* Nav tabs */}
        <nav className="flex-1 flex flex-col items-center space-y-2">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2.5 rounded-lg transition-all duration-300 relative group
                ${activeTab === tab.id ? 'text-detective-red bg-white/5' : 'text-noir-600 hover:text-noir-200'}`}
              title={tab.label}
              id={`nav-tab-${tab.id}`}
            >
              <tab.icon className="w-5 h-5" />
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="absolute right-0 top-1/4 w-1 h-1/2 bg-detective-red rounded-full" />
              )}
              {/* Tooltip */}
              <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-noir-900 text-[10px] font-mono px-2 py-1 rounded border border-white/5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-2">
          <button
            onClick={() => setShowSaveLoad(true)}
            className="p-2.5 text-noir-600 hover:text-detective-red transition-colors relative group"
            title="存档/读档"
          >
            <Save className="w-5 h-5" />
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-noir-900 text-[10px] font-mono px-2 py-1 rounded border border-white/5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              存档
            </span>
          </button>
          <button className="p-2.5 text-noir-600 hover:text-noir-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header Bar */}
        <header className="h-14 border-b border-noir-600 flex items-center justify-between px-6 bg-noir-950/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="status-chip">案件 #富㭴慎二</div>
            <div className="hidden sm:flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-noir-700 rounded-full" />)}
            </div>
            <span className="text-[10px] font-mono text-noir-400 hidden md:inline">{currentActLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono text-noir-400">
              <span className="flex items-center gap-1">
                <ScrollText className="w-3 h-3" /> {gameState.discoveredEvidenceIds.length} 条线索
              </span>
            </div>
            <button
              onClick={handleArchiveCase}
              className="text-[9px] font-mono border border-detective-red/30 text-detective-red px-3 py-1 rounded hover:bg-detective-red hover:text-white transition-all uppercase tracking-[0.1em]"
            >
              结案归档
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_center,_#1A1A1D_0%,_#0A0A0B_100%)]">
          <AnimatePresence mode="wait">
            {activeTab === 'scene' && (
              <motion.div
                key="scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <NarrativeEngine
                  scene={currentScene}
                  onChoice={handleChoice}
                  onHotspotClick={handleHotspotClick}
                  onTypingChange={setIsTyping}
                />
              </motion.div>
            )}

            {activeTab === 'evidence' && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto py-12 px-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">证据收集</h2>
                  <p className="mono-label opacity-40">已发现的线索与物证 ({discoveredEvidence.length})</p>
                </div>
                <EvidenceBoard evidence={discoveredEvidence} visitedSceneIds={visitedSceneIds} currentSceneId={gameState.currentSceneId} />
              </motion.div>
            )}

            {activeTab === 'suspects' && (
              <motion.div
                key="suspects"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto py-12 px-6"
              >
                <div className="mb-12 px-6">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">嫌疑人档案</h2>
                  <p className="mono-label opacity-40">案件相关人员资料</p>
                </div>
                <SuspectDossier
                  suspects={suspectsWithStatus}
                  notes={gameState.suspectNotes}
                  onUpdateNote={updateSuspectNote}
                  onUpdateStatus={updateSuspectStatus}
                  visitedSceneIds={visitedSceneIds}
                  currentSceneId={gameState.currentSceneId}
                />
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto py-12"
              >
                <div className="mb-12 px-6">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">事件时间线</h2>
                  <p className="mono-label opacity-40">案件关键节点</p>
                </div>
                <Timeline
                  events={TIMELINE_EVENTS}
                  currentSceneId={gameState.currentSceneId}
                  onJumpToScene={handleJumpToScene}
                  discoveredSceneIds={visitedSceneIds}
                />
              </motion.div>
            )}

            {activeTab === 'relations' && (
              <motion.div
                key="relations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto py-12"
              >
                <div className="mb-8 px-6">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">人物关系</h2>
                  <p className="mono-label opacity-40">悬停节点查看关联 · 悬停连线查看关系</p>
                </div>
                <RelationshipMap
                  suspects={suspectsWithStatus}
                  relations={CHARACTER_RELATIONS}
                  visitedSceneIds={visitedSceneIds}
                  currentSceneId={gameState.currentSceneId}
                />
              </motion.div>
            )}

            {activeTab === 'archives' && (
              <motion.div
                key="archives"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto py-12 px-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-bold tracking-tighter mb-2 italic">案件档案</h2>
                  <p className="mono-label opacity-40">已完结的案件记录</p>
                </div>
                <CaseArchive cases={gameState.archivedCases} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-detective-red text-white px-6 py-3 rounded-full shadow-2xl font-mono text-sm tracking-widest flex items-center gap-3 border border-white/20"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="fixed bottom-0 right-0 p-4 z-40 pointer-events-none">
        <div className="flex items-center gap-4 text-noir-400 font-mono text-[9px] uppercase tracking-widest opacity-50">
          <span>隅田川</span>
          <div className="w-px h-2 bg-noir-700" />
          <span>江东区森下</span>
        </div>
      </footer>

      {/* Audio */}
      <AudioManager
        currentSceneId={gameState.currentSceneId}
        isTyping={isTyping}
        isTransitioning={isTransitioning}
      />

      {/* Save/Load modal */}
      <SaveLoadSystem
        gameState={gameState}
        onLoad={handleLoadGame}
        isOpen={showSaveLoad}
        onClose={() => setShowSaveLoad(false)}
        sceneTitle={currentScene?.title || ''}
      />
    </div>
  );
}
