
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFacilityInfo = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a campus guide for V-Map. User asked: "${query}". 
      Briefly describe what they might find or provide helpful context about campus blocks (Autonomous, Smart, IT, Media, Day, Evening, GB). 
      Keep it under 50 words.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Welcome to V-Map! Search for blocks and labs to find your way.";
  }
};
