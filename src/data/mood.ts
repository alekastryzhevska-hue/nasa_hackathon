// Mood check-in data for the Mind tab. Copied from design/mood-data.json (design owns
// that file; keep in sync). Model follows Apple HealthKit "State of Mind".

export type MoodGroup = 'unpleasant' | 'neutral' | 'pleasant'

export interface MoodStep {
  id: string
  title: string
  group: MoodGroup
  valence: number
  // CSS variable from design-system/tokens.css and the same color as hex (for SVG).
  token: string
  color: string
}

export const MOOD_STEPS: MoodStep[] = [
  { id: 'veryUnpleasant', title: 'Very Unpleasant', group: 'unpleasant', valence: -1.0, token: 'var(--mood-very-unpleasant)', color: '#9a86e0' },
  { id: 'unpleasant', title: 'Unpleasant', group: 'unpleasant', valence: -0.66, token: 'var(--mood-unpleasant)', color: '#8d94e6' },
  { id: 'slightlyUnpleasant', title: 'Slightly Unpleasant', group: 'unpleasant', valence: -0.33, token: 'var(--mood-slightly-unpleasant)', color: '#7ea7e6' },
  { id: 'neutral', title: 'Neutral', group: 'neutral', valence: 0.0, token: 'var(--mood-neutral)', color: '#67b5e1' },
  { id: 'slightlyPleasant', title: 'Slightly Pleasant', group: 'pleasant', valence: 0.33, token: 'var(--mood-slightly-pleasant)', color: '#7fc4b8' },
  { id: 'pleasant', title: 'Pleasant', group: 'pleasant', valence: 0.66, token: 'var(--mood-pleasant)', color: '#e2b85e' },
  { id: 'veryPleasant', title: 'Very Pleasant', group: 'pleasant', valence: 1.0, token: 'var(--mood-very-pleasant)', color: '#f2c75c' },
]

export const MOOD_LABELS: Record<string, string> = {
  amazed: 'Amazed',
  amused: 'Amused',
  angry: 'Angry',
  annoyed: 'Annoyed',
  anxious: 'Anxious',
  ashamed: 'Ashamed',
  brave: 'Brave',
  calm: 'Calm',
  confident: 'Confident',
  content: 'Content',
  disappointed: 'Disappointed',
  discouraged: 'Discouraged',
  disgusted: 'Disgusted',
  drained: 'Drained',
  embarrassed: 'Embarrassed',
  excited: 'Excited',
  frustrated: 'Frustrated',
  grateful: 'Grateful',
  guilty: 'Guilty',
  happy: 'Happy',
  hopeful: 'Hopeful',
  hopeless: 'Hopeless',
  indifferent: 'Indifferent',
  irritated: 'Irritated',
  jealous: 'Jealous',
  joyful: 'Joyful',
  lonely: 'Lonely',
  overwhelmed: 'Overwhelmed',
  passionate: 'Passionate',
  peaceful: 'Peaceful',
  proud: 'Proud',
  relieved: 'Relieved',
  sad: 'Sad',
  satisfied: 'Satisfied',
  scared: 'Scared',
  stressed: 'Stressed',
  surprised: 'Surprised',
  worried: 'Worried',
}

// Chips shown for each group, in display order.
export const MOOD_LABEL_GROUPS: Record<MoodGroup, string[]> = {
  unpleasant: ['stressed', 'anxious', 'worried', 'sad', 'drained', 'overwhelmed', 'frustrated', 'irritated', 'annoyed', 'angry', 'disappointed', 'discouraged', 'lonely', 'scared', 'hopeless', 'guilty', 'ashamed', 'embarrassed', 'jealous', 'disgusted'],
  neutral: ['indifferent', 'calm', 'content', 'peaceful', 'satisfied', 'drained', 'surprised', 'hopeful', 'stressed', 'worried'],
  pleasant: ['happy', 'joyful', 'grateful', 'calm', 'peaceful', 'content', 'satisfied', 'proud', 'confident', 'hopeful', 'relieved', 'excited', 'passionate', 'amazed', 'amused', 'surprised', 'brave'],
}

export const MOOD_DEFAULT_STEP = 5
export const MOOD_DEFAULT_LABELS = ['happy', 'grateful']

// The health rules use a 1–5 mood score; the check-in has 7 steps.
export const moodScore = (stepIndex: number) => Math.round(1 + (stepIndex * 4) / 6)
