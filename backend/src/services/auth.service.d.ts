export declare class AuthService {
    private userRepo;
    private tokenRepo;
    private orgRepo;
    constructor();
    registerUser(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        organizationId: string | null;
    }>;
    validateUser(email: string, password: string): Promise<{
        organization: {
            id: string;
            name: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        organizationId: string | null;
    }>;
    createRefreshToken(userId: string): Promise<string>;
    refreshTokens(refreshToken: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        organizationId: string | null;
    }>;
    logout(refreshToken: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    getUserById(id: string): Promise<({
        organization: {
            id: string;
            name: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        passwordHash: string;
        role: string;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        organizationId: string | null;
    }) | null>;
}
//# sourceMappingURL=auth.service.d.ts.map