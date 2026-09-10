export declare class AnalyticsRepository {
    getLatestImpact(): Promise<{
        id: string;
        date: Date;
        wastePreventedKg: number;
        mealsSaved: number;
        co2eAvoidedKg: number;
        waterSavedLiters: number;
        moneySaved: number;
    } | null>;
    getKitchenDashboard(kitchenId: string): Promise<{
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
            message: string;
            title: string;
            severity: string;
            isResolved: boolean;
        }[];
    }>;
    getSystemOverview(): Promise<{
        totalSurplusRescued: number;
        co2Prevented: number;
        activeOrgs: {
            KITCHEN: number;
            NGO: number;
        };
    }>;
    getActivityTimeline(): Promise<{
        id: string;
        title: string;
        description: string;
        status: string;
        timestamp: Date;
    }[]>;
    getOrganizations(): Promise<({
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
}
//# sourceMappingURL=analytics.repository.d.ts.map