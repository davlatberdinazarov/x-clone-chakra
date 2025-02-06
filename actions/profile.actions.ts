
"use server";

import Post from "@/database/post.model";
import User from "@/database/user.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    const { currentUser }: any = await getServerSession(authOptions);

    const filteredUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      coverImage: user.coverImage,
      profileImage: user.profileImage,
      username: user.username,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      isFollowing: user.followers?.includes(currentUser._id) || false,
    };

    return filteredUser;
  } catch (error) {
    throw error;
  }
}

export async function getUserPosts(userId: string, limit?: number) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.currentUser) {
      return { status: false, error: "User not authenticated" };
    }

    const posts = await Post.find({ user: userId })
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .limit(limit || 10) // Agar limit berilmasa, default 10 ta post
      .sort({ createdAt: -1 });

    const filteredPosts = posts.map((post: any) => ({
      _id: post._id.toString(),
      body: post.body,
      createdAt: post.createdAt.toISOString(),
      user: {
        _id: post.user._id.toString(),
        name: post.user.name,
        username: post.user.username,
        profileImage: post.user.profileImage,
        email: post.user.email,
      },
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      hasLiked:
        post.likes?.some(
          (like: any) => like.toString() === session.currentUser?._id.toString()
        ) || false,
    }));

    return { status: true, data: filteredPosts };
  } catch (error) {
    return {
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function followUser({ userId, currentUserId } : {userId: string, currentUserId: string}) {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      $push: { followers: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: userId },
    });

    revalidatePath("/profile/" + userId); // Profilni yangilash

    return { status: true, message: "Followed" };
  } catch (error) {
    return { status: false, error: (error as Error).message };
  }
}

export async function unfollowUser({userId, currentUserId}: {userId: string, currentUserId: string}) {
  try {
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId },
    });

    revalidatePath("/profile/" + userId); // Profilni yangilash

    return { status: true, message: "Unfollowed" };
  } catch (error) {
    return { status: false, error: (error as Error).message };
  }
}

export async function updateUserProfile({
  userId,
  name,
  username,
  location,
  bio,
  profileImage,
  coverImage,
}: {
  userId: string;
  name?: string;
  username?: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
}) {
  try {
    await connectToDatabase();

    if (username) {
      const isExistingUsername = await User.findOne({ username });
      if (isExistingUsername && isExistingUsername._id.toString() !== userId) {
        return { status: false, error: "Username already exists" };
      }
    }

    const updateFields: any = { userId };
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (location) updateFields.location = location;
    if (bio) updateFields.bio = bio;
    if (profileImage) updateFields.profileImage = profileImage;
    if (coverImage) updateFields.coverImage = coverImage;

    console.log('Update field',updateFields)

    await User.findByIdAndUpdate(userId, updateFields, { new: true });

    return { status: true, message: "User updated successfully" };
  } catch (error) {
    return { status: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}
