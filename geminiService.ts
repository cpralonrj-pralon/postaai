
import { GoogleGenAI, Type } from "@google/genai";
import { ContentIdea } from "./types";

console.log('Initializing Gemini Service...');
const apiKey = process.env.GEMINI_API_KEY || 'AIza...'; // Fallback or placeholder
const ai = new GoogleGenAI({ apiKey });

export async function generateContentIdeas(niche: string, goal: string): Promise<ContentIdea[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Generate 6 diverse content ideas for a social media creator in the niche "${niche}" with the goal of "${goal}". 
      Return the ideas in JSON format.
      Types should be: Reels, Carousel, Story, Static, Promo.
      For Reels: include a 'hook'.
      For Story: include 'structure' (array of strings).
      For Promo: include 'cta'.
      All titles and text must be in Portuguese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              description: { type: Type.STRING },
              structure: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cta: { type: Type.STRING }
            },
            required: ["id", "type", "title"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating ideas:", error);
    return [];
  }
}
