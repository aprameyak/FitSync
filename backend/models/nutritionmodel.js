import { prisma } from '../lib/prisma.js';

class NutritionModel {
    // Create a new nutrition record
    static async create(nutritionData) {
        return await prisma.nutrition.create({
            data: nutritionData
        });
    }

    // Find nutrition record by ID
    static async findById(id) {
        return await prisma.nutrition.findUnique({
            where: { id }
        });
    }

    // Find all nutrition records for a user
    static async findByUserId(userId) {
        return await prisma.nutrition.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
    }

    // Find nutrition records by user ID and date range
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        return await prisma.nutrition.findMany({
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

    // Find nutrition records by meal type
    static async findByMealType(userId, mealType) {
        return await prisma.nutrition.findMany({
            where: {
                userId,
                mealType
            },
            orderBy: { date: 'desc' }
        });
    }

    // Update nutrition record
    static async update(id, updateData) {
        return await prisma.nutrition.update({
            where: { id },
            data: updateData
        });
    }

    // Delete nutrition record
    static async delete(id) {
        return await prisma.nutrition.delete({
            where: { id }
        });
    }

    // Get nutrition statistics for a user
    static async getStats(userId, startDate, endDate) {
        const records = await prisma.nutrition.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                calories: true,
                protein: true,
                carbs: true,
                fat: true,
                fiber: true
            }
        });

        const totalCalories = records.reduce((sum, record) => sum + record.calories, 0);
        const totalProtein = records.reduce((sum, record) => sum + (record.protein || 0), 0);
        const totalCarbs = records.reduce((sum, record) => sum + (record.carbs || 0), 0);
        const totalFat = records.reduce((sum, record) => sum + (record.fat || 0), 0);
        const totalFiber = records.reduce((sum, record) => sum + (record.fiber || 0), 0);

        return {
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            totalFiber,
            averageCalories: records.length > 0 ? totalCalories / records.length : 0
        };
    }
}

export default NutritionModel;