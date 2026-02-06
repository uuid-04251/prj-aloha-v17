// Script to seed admin account from environment variables
/// <reference types="node" />
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/lib/db/models/user.model';

async function seedAdminAccount() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aloha');

        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@aloha.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
        const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log('Email:', adminEmail);
            return;
        }

        // Create admin user
        const adminUser = new User({
            email: adminEmail,
            password: adminPassword, // Will be hashed by pre-save hook
            firstName: adminFirstName,
            lastName: adminLastName,
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('Role: admin');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdminAccount();
