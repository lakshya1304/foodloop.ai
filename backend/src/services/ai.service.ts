import { GoogleGenAI } from '@google/genai';
import { OcrInput, DemandPredictionInput, AnalyzeQualityInput } from '../schemas/ai.schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

const cache = new Map<string, any>();

export class AiService {
  async ocrExtract(input: OcrInput) {
    if (!ai) {
      throw new Error('AI service unavailable');
    }

    const cacheKey = `ocr-${input.text || ''}-${input.imageParts?.length || 0}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const prompt = `You are a food logistics AI. Extract the following information from the provided product label text or image:
      1. product_name
      2. manufacturing_date (ISO 8601 string)
      3. expiry_date (ISO 8601 string)
      4. batch_number
      Return ONLY a JSON object with these keys. If a value is not found, return null for it.
      
      Label Text: ${input.text || 'Not provided'}
      `;

    const contents: any[] = [prompt];
    if (input.imageParts && input.imageParts.length > 0) {
      contents.push(...input.imageParts);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    if (!response.text) {
        throw new Error("No text returned from Gemini");
    }
    const result = JSON.parse(response.text);
    cache.set(cacheKey, result);
    return result;
  }

  async demandPrediction(input: DemandPredictionInput) {
    if (!ai) {
      return {
        predictedDemand: 850,
        recommendedProduction: 870,
        expectedSurplus: 20,
        confidence: 0.9,
        aiReasoning: "Fallback reasoning due to missing API key."
      };
    }

    const cacheKey = `demand-${input.kitchenId || ''}-${input.targetDate || ''}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const prompt = `You are an AI for FoodLoop. Based on historical demand: ${JSON.stringify(input.historicalDemand || {})}. Predict demand for tomorrow. Return JSON with:
        predictedDemand (number), recommendedProduction (number), expectedSurplus (number), confidence (number 0-1), aiReasoning (string)`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    if (!response.text) {
        throw new Error("No response from AI");
    }

    const result = JSON.parse(response.text);
    cache.set(cacheKey, result);
    return result;
  }

  async analyzeQuality(input: AnalyzeQualityInput) {
    if (!ai) {
      return {
        quality_status: "REVIEW_REQUIRED",
        visible_issues: ["AI service unavailable, manual review required"],
        confidence: 0.0,
        recommendation: "Manual inspection required"
      };
    }

    const prompt = `You are a food quality AI inspector. Analyze the provided image of food.
      Return ONLY a JSON object with:
      1. quality_status (string: SAFE, WARNING, SPOILED, REVIEW_REQUIRED)
      2. visible_issues (array of strings, describe what you see if anything looks bad)
      3. confidence (number 0-1)
      4. recommendation (string: short recommendation)
      `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt, ...input.imageParts],
        config: { responseMimeType: 'application/json' }
    });

    if (!response.text) {
        throw new Error("No response from AI");
    }

    return JSON.parse(response.text);
  }

  async getRecommendations(kitchenId?: string) {
    let recommendations = await prisma.aIRecommendation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    // Fallback recommendations if none in DB
    if (recommendations.length === 0) {
       recommendations = [
         {
           id: "rec-1",
           title: "Reduce Lunch Production",
           description: "Reduce tomorrow's lunch production by 8%.",
           context: null,
           createdAt: new Date()
         },
         {
           id: "rec-2",
           title: "Expiring Vegetables",
           description: "18 kg of vegetables are approaching expiry. Prioritize them in tomorrow's menu.",
           context: null,
           createdAt: new Date()
         }
       ] as any;
    }
    return recommendations;
  }
}
