"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const genai_1 = require("@google/genai");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ai = process.env.GEMINI_API_KEY ? new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const cache = new Map();
class AiService {
    async ocrExtract(fileBuffer, filename, mimeType) {
        const { OcrProvider } = require('./providers/ocr.provider');
        const provider = new OcrProvider();
        // Call the Python OCR service
        const result = await provider.extractLabel(fileBuffer, filename, mimeType);
        if (!result.success) {
            throw new Error(result.error?.message || "OCR Extraction Failed");
        }
        return result.data;
    }
    async demandPrediction(input) {
        // 1. Deterministic Math Calculation
        const values = Object.values(input.historicalDemand || {});
        const avgDemand = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 850;
        const predictedDemand = Math.round(avgDemand);
        const recommendedProduction = Math.round(predictedDemand * 1.05); // 5% buffer
        const expectedSurplus = recommendedProduction - predictedDemand;
        const confidence = 0.92;
        if (!ai) {
            return {
                predictedDemand,
                recommendedProduction,
                expectedSurplus,
                confidence,
                aiReasoning: "Fallback reasoning due to missing API key. Calculated using a 5% buffer over historical average."
            };
        }
        const cacheKey = `demand-${input.kitchenId || ''}-${input.targetDate || ''}`;
        if (cache.has(cacheKey))
            return cache.get(cacheKey);
        // 2. AI Reasoning (NO MATH)
        const prompt = `You are an AI for FoodLoop. 
    Historical demand data: ${JSON.stringify(input.historicalDemand || {})}. 
    We have deterministically calculated the following for tomorrow:
    - Predicted Demand: ${predictedDemand}
    - Recommended Production: ${recommendedProduction} (includes 5% buffer)
    
    Provide ONLY a short string (1-2 sentences) explaining this logic to the kitchen manager. Focus on identifying trends or anomalies in the historical data that justify this.
    Return JSON with: { "aiReasoning": "your explanation here" }`;
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        let aiReasoning = "Calculated using a 5% buffer over historical average.";
        if (response.text) {
            try {
                const result = JSON.parse(response.text);
                if (result.aiReasoning)
                    aiReasoning = result.aiReasoning;
            }
            catch (e) {
                // Fallback to default
            }
        }
        const finalResult = {
            predictedDemand,
            recommendedProduction,
            expectedSurplus,
            confidence,
            aiReasoning
        };
        cache.set(cacheKey, finalResult);
        return finalResult;
    }
    async analyzeQuality(input) {
        if (!ai) {
            return {
                quality_status: "REVIEW_REQUIRED",
                visible_issues: [],
                confidence: 0,
                recommendation: "Manual inspection required. Vision AI is currently unavailable."
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
            model: 'gemini-1.5-flash',
            contents: [prompt, ...input.imageParts],
            config: { responseMimeType: 'application/json' }
        });
        if (!response.text) {
            throw new Error("No response from AI");
        }
        const aiResult = JSON.parse(response.text);
        // Persist scan to database
        await prisma.aiScan.create({
            data: {
                item: aiResult.visible_issues && aiResult.visible_issues.length > 0 ? "Scanned Food Item" : "Safe Food Item",
                confidence: aiResult.confidence,
                status: aiResult.quality_status === "SAFE" ? "PASS" : "WARN",
                issues: JSON.stringify(aiResult.visible_issues),
                recommendation: aiResult.recommendation
            }
        });
        return aiResult;
    }
    async getScans() {
        return prisma.aiScan.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
    async getRecommendations(kitchenId) {
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
            ];
        }
        return recommendations;
    }
}
exports.AiService = AiService;
//# sourceMappingURL=ai.service.js.map