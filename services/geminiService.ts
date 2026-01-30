
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameStrategy = async (gameTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a brief, futuristic, high-tech sounding strategy guide for a retro game called "${gameTitle}". 
      Include 3 pro-tips and a small piece of "lore" about the game's origin in a cyberpunk future. Keep it concise.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to establish uplink with AI strategist. Please check your connection.";
  }
};
