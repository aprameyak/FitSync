import { prisma } from '../lib/prisma.js';

class LiftModel {
    // Create a new lift record
    static async create(liftData) {
        return await prisma.lift.create({
            data: liftData
        });
    }

    // Find lift record by ID
    static async findById(id) {
        return await prisma.lift.findUnique({
            where: { id }
        });
    }

    // Find all lift records for a user
    static async findByUserId(userId) {
        return await prisma.lift.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
    }

    // Find lift records by user ID and date range
    static async findByUserIdAndDateRange(userId, startDate, endDate) {
        return await prisma.lift.findMany({
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

    // Find lift records by exercise
    static async findByExercise(userId, exercise) {
        return await prisma.lift.findMany({
            where: {
                userId,
                exercise
            },
            orderBy: { date: 'desc' }
        });
    }

    // Update lift record
    static async update(id, updateData) {
        return await prisma.lift.update({
            where: { id },
            data: updateData
        });
    }

    // Delete lift record
    static async delete(id) {
        return await prisma.lift.delete({
            where: { id }
        });
    }

    // Get lift statistics for a user
    static async getStats(userId) {
        const records = await prisma.lift.findMany({
            where: { userId },
            select: {
                exercise: true,
                sets: true,
                reps: true,
                weight: true,
                date: true
            }
        });

        const exerciseStats = records.reduce((acc, record) => {
            if (!acc[record.exercise]) {
                acc[record.exercise] = {
                    totalSets: 0,
                    totalReps: 0,
                    maxWeight: 0,
                    totalWorkouts: 0
                };
            }
            
            acc[record.exercise].totalSets += record.sets;
            acc[record.exercise].totalReps += record.reps;
            acc[record.exercise].maxWeight = Math.max(acc[record.exercise].maxWeight, record.weight || 0);
            acc[record.exercise].totalWorkouts += 1;
            
            return acc;
        }, {});

        return {
            totalLifts: records.length,
            exerciseStats,
            uniqueExercises: Object.keys(exerciseStats).length
        };
    }

    // Get personal records for a user
    static async getPersonalRecords(userId) {
        const records = await prisma.lift.findMany({
            where: { userId },
            select: {
                exercise: true,
                weight: true,
                reps: true,
                date: true
            }
        });

        const personalRecords = records.reduce((acc, record) => {
            if (!acc[record.exercise]) {
                acc[record.exercise] = {
                    maxWeight: 0,
                    maxReps: 0,
                    maxWeightDate: null,
                    maxRepsDate: null
                };
            }
            
            if (record.weight > acc[record.exercise].maxWeight) {
                acc[record.exercise].maxWeight = record.weight;
                acc[record.exercise].maxWeightDate = record.date;
            }
            
            if (record.reps > acc[record.exercise].maxReps) {
                acc[record.exercise].maxReps = record.reps;
                acc[record.exercise].maxRepsDate = record.date;
            }
            
            return acc;
        }, {});

        return personalRecords;
    }
}

export default LiftModel;
