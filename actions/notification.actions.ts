"use server";

import Notification from "@/database/notification.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";


export async function fetchNotifications(userId: string) {
  try {
    await connectToDatabase();

    if (!userId) {
      throw new Error("User ID is required");
    }

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    await User.findByIdAndUpdate(userId, {
      $set: { hasNewNotifications: false },
    });

    return { status: true, data: JSON.parse(JSON.stringify(notifications)) };
  } catch (error) {
    return { status: false, error: (error as Error).message };
  }
}

export async function deleteNotifications(userId: string) {
  try {
    await connectToDatabase();

    if (!userId) {
      throw new Error("User ID is required");
    }

    await Notification.deleteMany({ user: userId });

    await User.findByIdAndUpdate(
      userId,
      { $set: { hasNewNotifications: false } },
      { new: true }
    );

    return { status: true, message: "Notifications deleted" };
  } catch (error) {
    return { status: false, error: (error as Error).message };
  }
}
