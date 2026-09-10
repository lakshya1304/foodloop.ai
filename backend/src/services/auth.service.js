"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    userRepo;
    tokenRepo;
    orgRepo;
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
        this.tokenRepo = new user_repository_1.TokenRepository();
        this.orgRepo = new user_repository_1.OrganizationRepository();
    }
    async registerUser(data) {
        const { name, email, password, role } = data;
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        let userRole = role === 'KITCHEN' ? 'KITCHEN_MANAGER' :
            role === 'NGO' ? 'NGO_STAFF' :
                role === 'LOGISTICS' ? 'DRIVER' : 'ADMIN';
        const organizationId = await this.orgRepo.createOrganizationWithRole(name, role);
        const user = await this.userRepo.create({
            email,
            name,
            passwordHash,
            role: userRole,
            organizationId
        });
        if (role === 'LOGISTICS') {
            await this.orgRepo.createDriverProfile(user.id);
        }
        return user;
    }
    async validateUser(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }
        return user;
    }
    async createRefreshToken(userId) {
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await this.tokenRepo.createRefreshToken(userId, refreshToken, expiresAt);
        return refreshToken;
    }
    async refreshTokens(refreshToken) {
        const storedToken = await this.tokenRepo.findRefreshToken(refreshToken);
        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token');
        }
        return storedToken.user;
    }
    async logout(refreshToken) {
        await this.tokenRepo.revokeRefreshToken(refreshToken);
    }
    async forgotPassword(email) {
        const user = await this.userRepo.findByEmail(email);
        if (!user)
            return; // Silent fail
        const resetToken = crypto.randomBytes(32).toString('hex');
        await this.userRepo.update(user.id, {
            resetToken,
            resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });
        console.log(`Reset Token for ${email}: ${resetToken}`);
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepo.findByResetToken(token);
        if (!user)
            throw new Error('Invalid or expired token');
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update(user.id, {
            passwordHash,
            resetToken: null,
            resetTokenExpiry: null
        });
    }
    async getUserById(id) {
        return this.userRepo.findById(id);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map