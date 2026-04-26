export interface Evidence {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  dateFound: string;
  type: 'document' | 'object' | 'photo' | 'testimony';
  /** 解锁该证据详情所需的场景 ID */
  unlockedAtSceneId: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  status: 'innocent' | 'suspicious' | 'guilty' | 'unknown';
  relatedCases?: { id: string; description: string }[];
  alibi?: string;
  /** 解锁该嫌疑人档案所需的场景 ID */
  unlockedAtSceneId: string;
}

export interface Choice {
  id: string;
  text: string;
  targetSceneId: string;
  requirement?: {
    evidenceId?: string;
    actionPerformed?: string;
  };
}

export interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  radius: number;
  label: string;
  discoveryEvidenceId?: string;
  targetSceneId?: string;
}

export interface Scene {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  choices: Choice[];
  hotspots?: Hotspot[];
  autoProgress?: boolean;
  ambientEffect?: 'rain' | 'fog' | 'smoke';
}

export interface CaseRecord {
  id: string;
  title: string;
  completionDate: string;
  summary: string;
  evidenceCount: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'story' | 'evidence' | 'investigation';
  sceneId: string;
  icon?: string;
}

export interface CharacterRelation {
  from: string;
  to: string;
  label: string;
  type: 'love' | 'family' | 'friend' | 'colleague' | 'enemy' | 'case';
  /** 解锁该关系所需的场景 ID */
  unlockedAtSceneId: string;
}

export interface GameState {
  currentSceneId: string;
  discoveredEvidenceIds: string[];
  interactedSuspectIds: string[];
  journalEntries: string[];
  suspectNotes: Record<string, string>;
  archivedCases: CaseRecord[];
}
