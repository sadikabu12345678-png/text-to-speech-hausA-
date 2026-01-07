
export type Language = 'Hausa' | 'Yoruba' | 'Igbo' | 'English' | 'Arabic';

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  icon: string;
}

export interface LanguageConfig {
  id: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export interface AppState {
  text: string;
  language: Language;
  selectedVoice: string;
  isGenerating: boolean;
  audioUrl: string | null;
  error: string | null;
}
