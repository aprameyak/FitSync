import { prisma } from '../lib/prisma.js';

class FitnessModel {
    // Create a new fitness record
    static async create(fitnessData) {
        return await prisma.fitness.create({
            data: fitnessData
        });
    }

    // Find fitness record by ID
    static async findById(id) {
        return await prisma.fitness.findUnique({
            where: { id }
        });
    }

    // Find all fitness records for a user
    static async findByUserId(userId) {
        return await prisma.fitness.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
    }

    // Find fitness records by user ID and date range
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        return await prisma.fitness.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    // Update fitness record
    static async update(id, updateData) {
        return await prisma.fitness.update({
            where: { id },
            data: updateData
        });
    }

    // Delete fitness record
    static async delete(id) {
        return await prisma.fitness.delete({
            where: { id }
        });
    }

    // Get fitness statistics for a user
    static async getStats(userId) {
        const records = await prisma.fitness.findMany({
            where: { userId },
            select: {
                duration: true,
                calories: true,
                date: true
            }
        });

        const totalDuration = records.reduce((sum, record) => sum + record.duration, 0);
        const totalCalories = records.reduce((sum, record) => sum + record.calories, 0);
        const totalWorkouts = records.length;

        return {
            totalDuration,
            totalCalories,
            totalWorkouts,
            averageDuration: totalWorkouts > 0 ? totalDuration / totalWorkouts : 0,
            averageCalories: totalWorkouts > 0 ? totalCalories / totalWorkouts : 0
        };
    }
}

export default FitnessModel;