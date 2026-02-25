
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly when initializing.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProjectInsights = async (retryCount = 0): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Analyze this construction project state: 274 total tasks, 10 in progress, 5 overdue. What are the key priorities and risks? Return a short, punchy 3-bullet summary.",
      config: {
        systemInstruction: "You are an expert construction project consultant. Provide concise, high-value advice.",
        temperature: 0.7,
      },
    });
    // The response.text property (not a method) returns the string output.
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Robust check for 429 Rate Limit / Quota Exceeded errors
    // The error object structure can vary, so we check multiple properties including the specific JSON structure logged
    const isRateLimit = 
      error.status === 429 || 
      error?.error?.code === 429 || 
      error?.status === "RESOURCE_EXHAUSTED" ||
      (error.message && (error.message.includes('429') || error.message.includes('quota')));

    if (isRateLimit) {
      if (retryCount < 3) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Gemini API Quota exceeded. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getProjectInsights(retryCount + 1);
      } else {
        return "AI Usage Limit Reached. Please try again later.";
      }
    }

    return "Unable to load AI insights. Please check connection.";
  }
};
