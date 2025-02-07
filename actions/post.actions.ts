"use server";

import Post from "@/database/post.model";
import User from "@/database/user.model";
import { authOptions } from "@/lib/auth-options";
import Comment from "@/database/comment.model";
import { connectToDatabase } from "@/lib/mongoose";
import { IPost } from "@/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Notification from "@/database/notification.model";

interface CreatePostParams {
  body: string;
  userId: string;
}

export async function createPost({ body, userId }: CreatePostParams) {
  try {
    await connectToDatabase();
    const post = await Post.create({ body, user: userId });
    revalidatePath("/posts");
    return JSON.parse(JSON.stringify(post));
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

    const session = await getServerSession(authOptions);

    const posts = await Post.find({})
      .populate({
        path: "user",
        model: User,
        select: "name email profileImage _id username",
      })
      .populate("likes") // Bu qatorni qo'shing
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    revalidatePath("/posts"); // Asosiy sahifani yangilash

    let filteredPosts = posts.map((post: any) =>
      JSON.parse(
        JSON.stringify({
          _id: post._id.toString(),
          body: post.body,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
          user: {
            _id: post.user._id,
            name: post.user.name,
            username: post.user.username,
            profileImage: post.user.profileImage,
            email: post.user.email,
          },
          postLikes: post?.likes,
          likes: post.likes?.length || 0,
          comments: post.comments,
          hasLiked: post?.likes.some((like: any) => like._id == session?.currentUser?._id.toString()),
        })
      )
    ) as IPost[];

    return filteredPosts
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
    return JSON.parse(JSON.stringify({ message: "Post deleted successfully" }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getPostAction(postId: string) {
  try {
    if (!postId) {
      console.log("Error: Post ID is required");
      return { error: "Post ID is required", status: 400 };
    }

    await connectToDatabase();
    const post = await Post.findById(postId).populate({
      path: "user",
      model: User,
      select: "name email profileImage _id username",
    });

    if (!post) {
      console.log("Error: Post not found");
      return { error: "Post not found", status: 404 };
    }

    return JSON.parse(JSON.stringify({ success: true, data: post }));
  } catch (error: any) {
    console.log("Error fetching post:", error.message);
    return { error: error.message, status: 500 };
  }
}

export async function getPostComments(
  postId: string
): Promise<{ success?: boolean; data?: any; error?: string; status?: number }> {
  try {
    if (!postId) {
      return { error: "Post ID is required", status: 400 };
    }
    // Connect to database
    await connectToDatabase();

    // Fetch the session to get the current user
    const session = await getServerSession(authOptions);

    // Fetch the post by its ID, populating the comments and the user for each comment
    const post = await Post.findById(postId).populate({
      path: "comments", // The field to populate
      model: Comment,
      populate: {
        path: "user", // Populating user details inside each comment
        model: User,
        select: "name email profileImage _id username", // Specify the fields to retrieve
      },
      options: { sort: { likes: -1 } }, // Sort comments by likes (descending)
    });

    // If the post doesn't exist
    if (!post) {
      return { error: "Post not found", status: 404 };
    }

    // Check if comments exist and map over them
    const filteredComments =
      post.comments && post.comments?.length > 0
        ? post.comments.map((item: any) => ({
            body: item.body,
            createdAt: item.createdAt,
            user: item.user
              ? {
                  _id: item.user._id || null,
                  name: item.user.name || "",
                  username: item.user.username || "",
                  profileImage: item.user.profileImage || "",
                  email: item.user.email || "",
                }
              : {},
            likes: item.likes?.length,
            hasLiked: session?.currentUser?._id
              ? item.likes.includes(session.currentUser._id)
              : false,
            _id: item._id,
          }))
        : [];

    return {
      success: true,
      data: JSON.parse(JSON.stringify(filteredComments)),
    };
  } catch (error: any) {
    console.error("Error fetching post comments:", error.message);
    return { error: (error as Error).message, status: 500 };
  }
}

export async function likePost(postId: string) {
  try {
    await connectToDatabase();
    
    const post = await Post.findById(postId);
    if (!post) {
      return { error: "Post not found" };
    }

 
    const session = await getServerSession(authOptions);

    if (post.likes.includes(session?.currentUser?._id)) {
      return { error: "User already liked this post" };
    }

    await Post.findByIdAndUpdate(postId, { $push: { likes: session?.currentUser?._id } });

    
    await Notification.create({
      user: String(post.user),
      body: "Someone liked your post!",
    });
    await User.findOneAndUpdate(
      { _id: String(post.user) },
      { $set: { hasNewNotifications: true } }
    );
    console.log('someone liked your post');

    revalidatePath("/posts");
    return { success: true };
  } catch (error) {
    return { error: (error as any).message };
  }
}

export async function unlikePost(postId: string) {
  try {
    await connectToDatabase();
    
    const post = await Post.findById(postId);
    if (!post) {
      return { error: "Post not found" };
    }



    const session = await getServerSession(authOptions);

    if (!post.likes.includes(session?.currentUser?._id)) {
      return { error: "User has not liked this post" };
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: session?.currentUser?._id } });

    revalidatePath("/posts");
    return { success: true };
  } catch (error) {
    return { error: (error as any).message };
  }
}
