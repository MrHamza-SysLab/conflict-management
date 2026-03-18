export type CharacterId = 'ali' | 'sara' | 'manager' | 'narrator';
export type Emotion = 'neutral' | 'happy' | 'frustrated' | 'confident' | 'calm' | 'serious';
export type DecisionType = 'descriptive' | 'image' | 'voice' | 'video';
export type SceneId = 'splash' | 'intro' | 'announcement' | 'ali_upset' | 'meeting_conflict' | 'ali_rebuttal' | 'sara_insist' | 'tension_peak' | 'intervention' | 'resolution' | 'performance_review' | 'voicemail' | 'security_cam' | 'score';

export interface Choice {
  text: string;
  nextScene: SceneId;
  impact: {
    communication: number;
    fairness: number;
    leadership: number;
  };
}

export interface Scene {
  id: SceneId;
  background: 'office' | 'meeting' | 'manager_office';
  character?: CharacterId;
  secondaryCharacter?: CharacterId;
  emotion?: Emotion;
  secondaryEmotion?: Emotion;
  dialogue: string;
  choices?: Choice[];
  autoNext?: SceneId;
  layout?: 'single' | 'dual' | 'choice';
  type?: DecisionType;
  mediaUrl?: string;
  mediaPrompt?: string;
}

export const SCENES: Record<SceneId, Scene> = {
  splash: {
    id: 'splash',
    background: 'office',
    dialogue: 'Bank Conflict: Leadership Sim',
    layout: 'single',
  },
  intro: {
    id: 'intro',
    background: 'manager_office',
    dialogue: "Welcome, Manager. In this simulation, you will face a real-world leadership challenge. A promotion has sparked a conflict between a veteran employee and a rising star. Your goal is to resolve the tension and maintain team productivity.",
    layout: 'single',
    autoNext: 'announcement',
  },
  announcement: {
    id: 'announcement',
    background: 'office',
    character: 'manager',
    emotion: 'serious',
    dialogue: "Team, I'm pleased to announce that Sara Ahmed has been promoted to Assistant Manager! Her analytical skills have been outstanding.",
    layout: 'single',
    autoNext: 'ali_upset',
  },
  ali_upset: {
    id: 'ali_upset',
    background: 'office',
    character: 'ali',
    secondaryCharacter: 'sara',
    emotion: 'frustrated',
    secondaryEmotion: 'neutral',
    dialogue: "(Ali looks stunned) Six years... I've handled the biggest clients for six years, and they pick the newcomer?",
    layout: 'dual',
    choices: [
      {
        text: "Congratulate Sara publicly",
        nextScene: 'meeting_conflict',
        impact: { communication: 1, fairness: 2, leadership: 1 }
      },
      {
        text: "Ask Ali to see you later",
        nextScene: 'meeting_conflict',
        impact: { communication: 3, fairness: 2, leadership: 3 }
      }
    ]
  },
  meeting_conflict: {
    id: 'meeting_conflict',
    background: 'meeting',
    character: 'sara',
    secondaryCharacter: 'ali',
    emotion: 'confident',
    secondaryEmotion: 'frustrated',
    dialogue: "Ali, I've reviewed the client data. Could you please submit the detailed relationship report by tomorrow morning?",
    layout: 'dual',
    autoNext: 'ali_rebuttal',
  },
  ali_rebuttal: {
    id: 'ali_rebuttal',
    background: 'meeting',
    character: 'ali',
    secondaryCharacter: 'sara',
    emotion: 'frustrated',
    secondaryEmotion: 'neutral',
    dialogue: "Tomorrow morning? Sara, these reports take days to compile correctly. I have three client meetings scheduled for today.",
    layout: 'dual',
    autoNext: 'sara_insist',
  },
  sara_insist: {
    id: 'sara_insist',
    background: 'meeting',
    character: 'sara',
    secondaryCharacter: 'ali',
    emotion: 'serious',
    secondaryEmotion: 'frustrated',
    dialogue: "I understand, but the regional head needs the summary for the quarterly review. We need to prioritize this.",
    layout: 'dual',
    autoNext: 'tension_peak',
  },
  tension_peak: {
    id: 'tension_peak',
    background: 'meeting',
    character: 'ali',
    secondaryCharacter: 'sara',
    emotion: 'frustrated',
    secondaryEmotion: 'neutral',
    dialogue: "Maybe if promotions were based on actual field experience, you'd understand that these reports take more than a night, 'Assistant Manager'.",
    layout: 'dual',
    choices: [
      {
        text: "Intervene immediately",
        nextScene: 'intervention',
        impact: { communication: 2, fairness: 1, leadership: 2 }
      },
      {
        text: "Call for a private meeting",
        nextScene: 'intervention',
        impact: { communication: 3, fairness: 3, leadership: 3 }
      }
    ]
  },
  intervention: {
    id: 'intervention',
    background: 'manager_office',
    character: 'manager',
    emotion: 'serious',
    dialogue: "Ali, Sara, we need to talk about team dynamics. Ali, your experience is vital, but Sara's new role requires cooperation.",
    layout: 'single',
    choices: [
      {
        text: "Explain promotion criteria",
        nextScene: 'resolution',
        impact: { communication: 3, fairness: 3, leadership: 2 }
      },
      {
        text: "Enforce hierarchy",
        nextScene: 'resolution',
        impact: { communication: 1, fairness: 1, leadership: 2 }
      }
    ]
  },
  resolution: {
    id: 'resolution',
    background: 'office',
    character: 'sara',
    secondaryCharacter: 'ali',
    emotion: 'calm',
    secondaryEmotion: 'neutral',
    dialogue: "Thank you for the support, Mr. Ahmed. Ali and I have agreed on a new reporting workflow that respects his client time.",
    layout: 'dual',
    autoNext: 'performance_review',
  },
  performance_review: {
    id: 'performance_review',
    background: 'manager_office',
    dialogue: "Before we finalize, let's look at the quarterly performance data. This chart shows Ali's client retention vs Sara's efficiency gains.",
    layout: 'single',
    type: 'image',
    mediaUrl: '/chart.jpg',
    choices: [
      {
        text: "Prioritize Ali's retention (Veteran focus)",
        nextScene: 'voicemail',
        impact: { communication: 2, fairness: 1, leadership: 2 }
      },
      {
        text: "Prioritize Sara's efficiency (Future focus)",
        nextScene: 'voicemail',
        impact: { communication: 2, fairness: 3, leadership: 2 }
      }
    ]
  },
  voicemail: {
    id: 'voicemail',
    background: 'manager_office',
    dialogue: "You have one new voicemail. It's from a high-value client who worked with Ali for years. Listen carefully to their tone.",
    layout: 'single',
    type: 'voice',
    mediaPrompt: "A frustrated client saying: 'Hello, this is Mr. Khan. I've been trying to reach Ali all day but I keep getting redirected to this new assistant, Sara. I've worked with Ali for 5 years, I don't want to start over with someone new.'",
    choices: [
      {
        text: "Reassure the client personally",
        nextScene: 'security_cam',
        impact: { communication: 3, fairness: 2, leadership: 3 }
      },
      {
        text: "Let Sara handle the transition",
        nextScene: 'security_cam',
        impact: { communication: 1, fairness: 2, leadership: 1 }
      }
    ]
  },
  security_cam: {
    id: 'security_cam',
    background: 'office',
    dialogue: "A security alert! There was a heated argument in the breakroom. Watch the footage to see who started it.",
    layout: 'single',
    type: 'video',
    mediaUrl: '/mixkit-slowly-approaching-a-clock-on-a-black-background-28897-full-hd.mp4',
    mediaPrompt: "A short video of a clock on a black background.",
    choices: [
      {
        text: "Issue a formal warning to Ali",
        nextScene: 'score',
        impact: { communication: 1, fairness: 3, leadership: 2 }
      },
      {
        text: "Mediate a final reconciliation",
        nextScene: 'score',
        impact: { communication: 3, fairness: 2, leadership: 3 }
      }
    ]
  },
  score: {
    id: 'score',
    background: 'manager_office',
    dialogue: "Simulation Complete. Let's see how you performed as a Branch Manager.",
    layout: 'single',
  }
};
