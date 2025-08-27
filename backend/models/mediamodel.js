import { prisma } from '../lib/prisma.js';

class MediaModel {
    // Create a new media record
    static async create(mediaData) {
        return await prisma.media.create({
            data: mediaData
        });
    }

    // Find media record by ID
    static async findById(id) {
        return await prisma.media.findUnique({
            where: { id }
        });
    }

    // Find all media records for a user
    static async findByUserId(userId) {
        return await prisma.media.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Find media records by type
    static async findByType(userId, type) {
        return await prisma.media.findMany({
            where: {
                userId,
                type
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Update media record
    static async update(id, updateData) {
        return await prisma.media.update({
            where: { id },
            data: updateData
        });
    }

    // Delete media record
    static async delete(id) {
        return await prisma.media.delete({
            where: { id }
        });
    }

    // Get media statistics for a user
    static async getStats(userId) {
        const records = await prisma.media.findMany({
            where: { userId },
            select: {
                type: true,
                createdAt: true
            }
        });

        const typeCounts = records.reduce((acc, record) => {
            acc[record.type] = (acc[record.type] || 0) + 1;
            return acc;
        }, {});

        return {
            totalMedia: records.length,
            typeCounts,
            latestMedia: records.length > 0 ? records[0] : null
        };
    }
}

export default MediaModel;
