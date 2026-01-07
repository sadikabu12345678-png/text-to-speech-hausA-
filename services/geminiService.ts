
import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData, audioBufferToWav } from "./audioUtils";

export async function generateTTS(
  text: string,
  language: string,
  voiceName: string
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  
  // Prompt refinement based on language
  const prompt = `Speak the following text in ${language}: ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to receive audio data from AI.");
  }

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 24000,
  });
  
  const decodedData = decode(base64Audio);
  const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
  const wavBlob = audioBufferToWav(audioBuffer);
  
  return URL.createObjectURL(wavBlob);
}
