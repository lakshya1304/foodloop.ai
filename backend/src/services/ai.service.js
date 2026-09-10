"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const genai_1 = require("@google/genai");
const ai = process.env.GEMINI_API_KEY ? new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const cache = new Map();
class AiService {
    async ocrExtract(input) {
        if (!ai) {
            throw new Error('AI service unavailable');
        }
        const cacheKey = `ocr-${input.text || ''}-${input.imageParts?.length || 0}`;
        if (cache.has(cacheKey))
            return cache.get(cacheKey);
        const prompt = `You are a food logistics AI. Extract the following information from the provided product label text or image:
      1. product_name
      2. manufacturing_date (ISO 8601 string)
      3. expiry_date (ISO 8601 string)
      4. batch_number
      Return ONLY a JSON object with these keys. If a value is not found, return null for it.
      
      Label Text: ${input.text || 'Not provided'}
      `;
        const contents = [prompt];
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
    async demandPrediction(input) {
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
        if (cache.has(cacheKey))
            return cache.get(cacheKey);
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
}
exports.AiService = AiService;
//# sourceMappingURL=ai.service.js.map