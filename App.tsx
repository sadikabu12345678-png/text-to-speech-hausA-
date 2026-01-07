
import React, { useState, useCallback, useMemo } from 'react';
import { LANGUAGES, VOICES, MAX_WORDS } from './constants';
import { AppState, Language } from './types';
import { generateTTS } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    text: '',
    language: 'Hausa',
    selectedVoice: 'Algenib',
    isGenerating: false,
    audioUrl: null,
    error: null,
  });

  const wordCount = useMemo(() => {
    return state.text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [state.text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, text: e.target.value }));
  };

  const handleGenerate = async () => {
    if (!state.text.trim()) {
      setState(prev => ({ ...prev, error: "Please enter some text." }));
      return;
    }
    if (wordCount > MAX_WORDS) {
      setState(prev => ({ ...prev, error: `Word limit exceeded. Maximum is ${MAX_WORDS} words.` }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, audioUrl: null }));

    try {
      const url = await generateTTS(state.text, state.language, state.selectedVoice);
      setState(prev => ({ ...prev, audioUrl: url, isGenerating: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Failed to generate audio. Please try again later." 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-2">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Muryar AI</h1>
          <p className="text-lg text-emerald-600 font-medium">Multi-Language Text-to-Speech (Up to 50k Words)</p>
        </div>

        {/* Input Card */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Input Text</h2>
            <span className={`text-xs font-medium px-2 py-1 rounded ${wordCount > MAX_WORDS ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
              {wordCount.toLocaleString()} / {MAX_WORDS.toLocaleString()} words
            </span>
          </div>
          <textarea
            value={state.text}
            onChange={handleTextChange}
            placeholder="Rubuta sakon ka a nan..."
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none text-slate-800"
          />
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setState(prev => ({ ...prev, language: lang.id }))}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-1 ${
                state.language === lang.id
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-bold">{lang.name}</span>
              <span className="text-[10px] opacity-70">{lang.nativeName}</span>
            </button>
          ))}
        </div>

        {/* Voice Selection */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border-slate-200">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Speaker Voice</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setState(prev => ({ ...prev, selectedVoice: voice.id }))}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  state.selectedVoice === voice.id
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                <span className={`text-lg p-1 rounded-lg ${state.selectedVoice === voice.id ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                  {voice.icon}
                </span>
                <span className="font-semibold">{voice.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Player */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating || !state.text}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-white font-bold text-lg transition-all shadow-lg ${
              state.isGenerating || !state.text
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {state.isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ina Sarrafawa...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate {state.language} Audio
              </>
            )}
          </button>

          {state.audioUrl && (
            <div className="flex-1 w-full bg-emerald-50 p-4 rounded-2xl flex items-center gap-4 border border-emerald-100">
              <audio controls src={state.audioUrl} className="flex-1 h-10" />
              <a 
                href={state.audioUrl} 
                download={`muryar-ai-${state.language}-${state.selectedVoice}.wav`}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                title="Saukowa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-medium">
            {state.error}
          </div>
        )}

        {/* Footer info */}
        <p className="text-center text-slate-400 text-sm pb-8">
          Powered by Gemini AI • Premium TTS Technology
        </p>
      </div>
    </div>
  );
};

export default App;
