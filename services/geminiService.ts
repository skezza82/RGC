
import { GoogleGenAI } from "@google/genai";

export const geminiService = {
  generateTetrisBackground: async (): Promise<string | null> => {
    if (!process.env.API_KEY) return null;
    
    // Initializing Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: "A futuristic retro-synthwave inspired digital background featuring abstract falling neon blocks similar to Tetris, cybernetic aesthetic, cyan and purple glow, 4k resolution, 16:9" }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
          // Note: responseMimeType is NOT set here to prevent errors with the nano banana series models.
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate background:", error);
    }
    return null;
  }
};
