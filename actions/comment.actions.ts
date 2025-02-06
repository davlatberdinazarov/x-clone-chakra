"use server";

import Comment from "@/database/comment.model";
import Post from "@/database/post.model";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// **1. Create Comment (POST)**
export async function createComment({
  body,
  postId,
}: {
  body: string;
  postId: string;
}) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) return { message: "Unauthorized", status: 401 };

    const userId = session.currentUser?._id; // currentUser ishlatilmoqda

    const comment = await Comment.create({ body, post: postId, user: userId });
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return JSON.parse(JSON.stringify({ status: 200, data: comment }));
  } catch (error) {
    if (error instanceof Error) {
      return JSON.parse(
        JSON.stringify({ message: "An unknown error occurred", status: 400 })
      );
    }
  }
}

// **2. Like Comment (PUT)**
export async function likeComment({ id }: { id: string }) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) return { message: "Unauthorized", status: 401 };

    const commentId = id;
    await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { likes:  session.currentUser?._id},
    });

    return JSON.parse(
      JSON.stringify({ status: 200, message: "Comment liked" })
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          return JSON.parse(
            JSON.stringify({ message: error.message, status: 400 })
          );
        }
        return JSON.parse(
          JSON.stringify({ message: "An unknown error occurred", status: 400 })
        );
      }
      return JSON.parse(
        JSON.stringify({ message: "An unknown error occurred", status: 400 })
      );
    }
    return JSON.parse(
      JSON.stringify({ message: "An unknown error occurred", status: 400 })
    );
  }
}

// **3. Unlike Comment (DELETE)**
export async function unlikeComment({ id }: { id: string }) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user) return { message: "Unauthorized", status: 401 };

    const commentId = id;
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: session.currentUser?._id },
    });

    return JSON.parse(
      JSON.stringify({ status: 200, message: "Comment unliked" })
    );
  } catch (error: any) {
    return JSON.parse(JSON.stringify({ message: error.message, status: 400 }));
  }
}


export async function deleteComment({ parsedInput }: { parsedInput: any }) {
	const { id } = parsedInput
	await connectToDatabase()
	const session = await getServerSession(authOptions)
	if (!session) return JSON.parse(JSON.stringify({ message: 'You must be logged in to delete a comment.' }));
	const comment = await Comment.findByIdAndDelete(id)
	await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } })
	revalidatePath(`/posts/${comment.post}`)
  return { status: 200 }
}

// get all comments

export async function getAllComments({ postId }: { postId: string }) {
  try {
    await connectToDatabase();
    const comments = await Comment.find({ post: postId }).populate({
      path: "user",
      model: "User",
      select: "name email profileImage _id username",
    });
    return JSON.parse(JSON.stringify({ status: 200, data: comments }));
  } catch (error) {
    if (error instanceof Error) {
      return JSON.parse(
        JSON.stringify({ message: "An unknown error occurred", status: 400 })
      );
    }
  }
}