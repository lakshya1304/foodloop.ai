import { OcrInput, DemandPredictionInput, AnalyzeQualityInput } from '../schemas/ai.schema';
export declare class AiService {
    ocrExtract(input: OcrInput): Promise<any>;
    demandPrediction(input: DemandPredictionInput): Promise<any>;
    analyzeQuality(input: AnalyzeQualityInput): Promise<any>;
    getRecommendations(kitchenId?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        description: string;
        context: string | null;
    }[]>;
}
//# sourceMappingURL=ai.service.d.ts.map