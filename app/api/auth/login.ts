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
            return { success: false, message: "Email va parol kiritilishi shart" };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "Foydalanuvchi topilmadi" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Noto‘g‘ri email yoki parol" };
        }

        return { 
            success: true, 
            message: "Login muvaffaqiyatli", 
            user: { id: user._id, name: user.name, email: user.email, image: user.image }
        };
    } catch (error) {
        console.error("Login xatosi:", error);
        return { success: false, message: "Server xatosi" };
    }
}
