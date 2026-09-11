export declare class AnalyticsService {
    getImpact(): Promise<{
        id: string;
        date: Date;
        wastePreventedKg: number;
        mealsSaved: number;
        co2eAvoidedKg: number;
        waterSavedLiters: number;
        moneySaved: number;
    } | null>;
    getKitchenDashboard(user: any): Promise<{
        predictions: {
            id: string;
            createdAt: Date;
            targetDate: Date;
            predictedDemand: number;
            recommendedProduction: number;
            expectedSurplus: number;
            confidence: number;
            aiReasoning: string | null;
            kitchenId: string;
        }[];
        productions: {
            id: string;
            kitchenId: string;
            date: Date;
            foodItem: string;
            quantityProduced: number;
            unit: string;
        }[];
        consumptions: {
            id: string;
            kitchenId: string;
            date: Date;
            foodItem: string;
            unit: string;
            quantityConsumed: number;
        }[];
        activeSurpluses: {
            id: string;
            kitchenId: string;
            date: Date;
            foodItem: string;
            unit: string;
            quantitySurplus: number;
            status: string;
        }[];
        activeAlerts: {
            id: string;
            createdAt: Date;
            title: string;
            message: string;
            severity: string;
            isResolved: boolean;
        }[];
    }>;
    getSystemOverview(user: any): Promise<{
        totalSurplusRescued: number;
        co2Prevented: number;
        moneySaved: number;
        waterSavedLiters: number;
        activeOrgs: {
            KITCHEN: number;
            NGO: number;
        };
    }>;
    getActivityTimeline(user: any): Promise<{
        id: string;
        title: string;
        description: string;
        status: string;
        timestamp: Date;
    }[]>;
    getOrganizations(user: any): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        name: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getLeaderboard(): Promise<{
        kitchens: {
            id: string;
            name: string;
            type: string;
            score: number;
        }[];
        ngos: {
            id: string;
            name: string;
            type: string;
            score: number;
        }[];
    }>;
}
//# sourceMappingURL=analytics.service.d.ts.map