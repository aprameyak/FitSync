import { prisma } from '../lib/prisma.js';

class ProfileModel {
    // Create a new profile
    static async create(profileData) {
        return await prisma.profile.create({
            data: profileData
        });
    }

    // Find profile by user ID
    static async findByUserId(userId) {
        return await prisma.profile.findUnique({
            where: { userId }
        });
    }

    // Find profile by ID
    static async findById(id) {
        return await prisma.profile.findUnique({
            where: { id }
        });
    }

    // Update profile
    static async update(userId, updateData) {
        return await prisma.profile.update({
            where: { userId },
            data: updateData
        });
    }

    // Upsert profile (create if doesn't exist, update if it does)
    static async upsert(userId, profileData) {
        return await prisma.profile.upsert({
            where: { userId },
            update: profileData,
            create: { ...profileData, userId }
        });
    }

    // Delete profile
    static async delete(userId) {
        return await prisma.profile.delete({
            where: { userId }
        });
    }

    // Get profile with user data
    static async findWithUser(userId) {
        return await prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }
}

export default ProfileModel;