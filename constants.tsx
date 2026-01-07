
import React from 'react';
import { LanguageConfig, Voice } from './types';

export const LANGUAGES: LanguageConfig[] = [
  { id: 'Hausa', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬' },
  { id: 'Yoruba', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬' },
  { id: 'Igbo', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  { id: 'English', name: 'English', nativeName: 'English Language', flag: '🇺🇸' },
  { id: 'Arabic', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const VOICES: Voice[] = [
  { id: 'Algenib', name: 'Algenib', gender: 'male', icon: '♂️' },
  { id: 'Puck', name: 'Puck', gender: 'male', icon: '♂️' },
  { id: 'Charon', name: 'Charon', gender: 'male', icon: '♂️' },
  { id: 'Kore', name: 'Kore', gender: 'female', icon: '♀️' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'female', icon: '♀️' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'female', icon: '♀️' },
];

export const MAX_WORDS = 50000;
