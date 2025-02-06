"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import bcrypt from "bcrypt";

export async function loginUser(formData: FormData) {
    try {
        await connectToDatabase();

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            return JSON.parse(JSON.stringify({ success: false, message: "Email va parol kiritilishi shart" }));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return JSON.parse(JSON.stringify({ success: false, message: "Foydalanuvchi topilmadi" }));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return JSON.parse(JSON.stringify({ success: false, message: "Noto‘g‘ri email yoki parol" }));
        }

        return { 
            success: true, 
            message: "Login muvaffaqiyatli", 
            user: JSON.parse(JSON.stringify({ id: user._id, name: user.name, email: user.email, image: user.image }))
        };
    } catch (error) {
        console.error("Login xatosi:", error);
        return { success: false, message: "Server xatosi" };
    }
}


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
            return JSON.parse(JSON.stringify({ success: true, message: "Proceed to next step" }));
        }

        // Step 2: Barcha ma'lumotlarni tekshirish va foydalanuvchi yaratish
        if (step === 2) {
            if (!email || !name || !username || !password) {
                return JSON.parse(JSON.stringify({ success: false, message: "All fields are required" }));
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

            return JSON.parse(JSON.stringify({ success: true, message: "User created successfully", user: user.toObject() }));
        }

        return JSON.parse(JSON.stringify({ success: false, message: "Invalid step" }));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        return JSON.parse(JSON.stringify({ success: false, message: errorMessage }));
    }
}
