
import { GoogleGenAI } from "@google/genai";

// FIX: Initialize with direct environment variable as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyMotivation = async (day: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan 1 kutipan motivasi singkat yang sangat ramah anak untuk hari ke-${day} di bulan Ramadhan. 
      Fokus pada semangat ibadah, kejujuran, atau kebaikan. Gunakan bahasa Indonesia yang ceria dan tambahkan emoji. 
      Format: "Kutipan" - "Pesan Singkat". Maksimal 30 kata.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Semangat ibadah hari ini, ya! Allah sayang anak yang rajin shalat. 🌙✨";
  }
};

export const getAIFeedback = async (studentName: string, points: number, activityCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tulis pesan apresiasi singkat untuk siswa bernama ${studentName} yang telah mencapai ${points} poin amaliah Ramadhan dengan ${activityCount} aktivitas hari ini.
      Gunakan gaya bahasa guru yang memotivasi dan penuh kasih sayang. Gunakan bahasa Indonesia.`,
    });
    return response.text;
  } catch (error) {
    return `Hebat sekali, ${studentName}! Terus semangat ibadahnya ya! 🌟`;
  }
};
