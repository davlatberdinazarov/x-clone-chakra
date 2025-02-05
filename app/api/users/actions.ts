'use server';

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";


export async function fetchUsers(limit: number) {
  try {
    await connectToDatabase();
    
    const users = await User.find({})
      .select("name username _id profileImage email")
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
