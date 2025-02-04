"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcrypt";

export async function registerUser(formData: FormData) {
    try {
        await connectToDatabase();

        const email = formData.get("email") as string;
        const name = formData.get("name") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const step = Number(formData.get("step") as unknown as string);

        // Step 1: Faqat email va username tekshiruvi
        if (step === 1) {
            const isExistingUser = await User.findOne({ email });
            if (isExistingUser) {
                return {
                    success: false,
                    message: isExistingUser.email === email 
                        ? "Email is already registered"
                        : "Username is already taken",
                };
            }
            return { success: true, message: "Proceed to next step" };
        }

        // Step 2: Barcha ma'lumotlarni tekshirish va foydalanuvchi yaratish
        if (step === 2) {
            if (!email || !name || !username || !password) {
                return { success: false, message: "All fields are required" };
            }

            const isExistingUser = await User.findOne({ username });
            if (isExistingUser) {
                return {
                    success: false,
                    message: isExistingUser.email === email 
                        ? "Email is already registered"
                        : "Username is already taken",
                };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ email, name, username, password: hashedPassword });

            return { success: true, message: "User created successfully", user: user.toObject() };
        }

        return { success: false, message: "Invalid step" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        return { success: false, message: errorMessage };
    }
}
