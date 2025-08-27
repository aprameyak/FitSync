import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

class UserModel {
    // Create a new user
    static async create(userData) {
        const { email, password, name } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 8);
        
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
    }

    // Find user by email
    static async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    // Find user by ID
    static async findById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    // Update user
    static async update(id, updateData) {
        return await prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    // Delete user
    static async delete(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }

    // Compare password
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Hash password
    static async hashPassword(password) {
        return await bcrypt.hash(password, 8);
    }
}

export default UserModel; 