"use server";

import Post from "@/database/post.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { IPost } from "@/types";
import { revalidatePath } from "next/cache";

interface CreatePostParams {
  body: string;
  userId: string;
}

export async function createPost({ body, userId }: CreatePostParams) {
  try {
    await connectToDatabase();
    const post = await Post.create({ body, user: userId });
    revalidatePath("/posts");
    return post;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getPosts(limit: number): Promise<IPost[]> {
    try {
      await connectToDatabase();
      const posts = await Post.find({})
        .populate({
          path: "user",
          model: User,
          select: "name email profileImage _id username createdAt updatedAt coverImage bio location followers following hasNewNotifications notifications isFollowing",
        })
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .lean();
  
      return posts.map((post: any) => ({
        _id: post._id.toString(),
        body: post.body,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        user: post.user,
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
        hasLiked: false, // Buni autentifikatsiyalangan user bilan tekshirish kerak
      })) as IPost[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
  

export async function deletePost(postId: string) {
  try {
    await connectToDatabase();
    await Post.findByIdAndDelete(postId);
    revalidatePath("/posts");
    return { message: "Post deleted successfully" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
