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

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export async function searchUsers(query: string) {
  try {
    await connectToDatabase();

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("name username _id profileImage email");

    if (!users?.length) {
      return { status: false, error: "User not found" };
    }

    return { status: true, data: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    return { status: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}