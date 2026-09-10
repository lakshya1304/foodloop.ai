import { Prisma } from '@prisma/client';
export declare class UserRepository {
    findByEmail(email: string): Promise<({
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
    findById(id: string): Promise<({
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
    create(data: Prisma.UserCreateInput | Prisma.UserUncheckedCreateInput): Promise<{
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
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
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
    findByResetToken(token: string): Promise<{
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
    } | null>;
}
export declare class TokenRepository {
    createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        expiresAt: Date;
        revoked: boolean;
    }>;
    findRefreshToken(token: string): Promise<({
        user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        expiresAt: Date;
        revoked: boolean;
    }) | null>;
    revokeRefreshToken(token: string): Promise<Prisma.BatchPayload>;
}
export declare class OrganizationRepository {
    createOrganizationWithRole(name: string, role: string, userId?: string): Promise<string | null>;
    createDriverProfile(userId: string): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map