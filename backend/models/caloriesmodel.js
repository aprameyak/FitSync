import { prisma } from '../lib/prisma.js';

class CaloriesModel {
    // Create a new calories record
    static async create(caloriesData) {
        return await prisma.calories.create({
            data: caloriesData
        });
    }

    // Find calories record by ID
    static async findById(id) {
        return await prisma.calories.findUnique({
            where: { id }
        });
    }

    // Find calories record by user ID and date
    static async findByUserIdAndDate(userId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return await prisma.calories.findFirst({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    // Find all calories records for a user
    static async findByUserId(userId) {
        return await prisma.calories.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
    }

    // Find calories records by user ID and date range
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        return await prisma.calories.findMany({
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

    // Update calories record
    static async update(id, updateData) {
        return await prisma.calories.update({
            where: { id },
            data: updateData
        });
    }

    // Upsert calories record (create if doesn't exist, update if it does)
    static async upsert(userId, date, caloriesData) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingRecord = await prisma.calories.findFirst({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (existingRecord) {
            return await prisma.calories.update({
                where: { id: existingRecord.id },
                data: caloriesData
            });
        } else {
            return await prisma.calories.create({
                data: { ...caloriesData, userId, date }
            });
        }
    }

    // Delete calories record
    static async delete(id) {
        return await prisma.calories.delete({
            where: { id }
        });
    }

    // Get calories statistics for a user
    static async getStats(userId, startDate, endDate) {
        const records = await prisma.calories.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                consumed: true,
                burned: true,
                net: true,
                goal: true
            }
        });

        const totalConsumed = records.reduce((sum, record) => sum + record.consumed, 0);
        const totalBurned = records.reduce((sum, record) => sum + record.burned, 0);
        const totalNet = records.reduce((sum, record) => sum + record.net, 0);
        const averageGoal = records.reduce((sum, record) => sum + (record.goal || 0), 0) / records.length;

        return {
            totalConsumed,
            totalBurned,
            totalNet,
            averageGoal,
            averageConsumed: records.length > 0 ? totalConsumed / records.length : 0,
            averageBurned: records.length > 0 ? totalBurned / records.length : 0
        };
    }
}

export default CaloriesModel;
