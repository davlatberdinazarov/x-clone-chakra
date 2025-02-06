"use client";

import { IPost, IUser } from "@/types";
import React, { useState } from "react";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { AiFillDelete, AiOutlineMessage } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { toaster } from "../ui/toaster";
import { useRouter } from "next/navigation";
import { deletePost, likePost, unlikePost } from "@/actions/post.actions";

interface Props {
  post: IPost;
  user: IUser;
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const PostItem = ({ post, user, setPosts }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  let router = useRouter();

  const onDelete = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deletePost(post._id);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      setIsLoading(false);
      toaster.create({
        description: "Post deleted successfully",
        type: "success",
      });
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        description: "Something went wrong while deleting the post",
        type: "error",
      });
    }
  };
  
  const onLike = async (e: any) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (post.hasLiked) {
        await unlikePost(post._id, user._id);
  
        const updatedPosts = {
          ...post,
          hasLiked: false,
          likes: post.likes - 1,
        };
  
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? updatedPosts : p))
        );
        toaster.create({
          description: "You unliked this post.",
          type: "success",
        });
      } else {
        await likePost(post._id, user._id);
  
        const updatedPosts = {
          ...post,
          hasLiked: true,
          likes: post.likes + 1,
        };
  
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? updatedPosts : p))
        );
        toaster.create({
          description: "You liked this post.",
          type: "success",
        });
      }
  
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        description: "Something went wrong while updating the like",
        type: "error",
      });
    }
  };
  

  const goToPost = () => {
    router.push(`/posts/${post._id}`);
  };

  return (
    <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative">
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        </div>
      )}
      <div onClick={goToPost} className="flex flex-row items-center gap-3">
        <Avatar src={post.user.profileImage} name={post.user.name[0]} />

        <div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-white font-semibold cursor-pointer hover:underline">
              {post.user.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              {post.user.username
                ? `${sliceText(post.user.username, 16)}`
                : sliceText(post.user.email, 16)}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(new Date(post.createdAt))} ago
            </span>
          </div>

          <div className="text-white mt-1">{post.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500">
              <AiOutlineMessage size={20} />
              <p>{Array.isArray(post.comments) ? post.comments.length : 0}</p>
            </div>

            <div
              className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
            >
              <FaHeart size={20} onClick={onLike} color={post.hasLiked ? "red" : ""}  />
              <p>{post.likes || 0}</p>
            </div>

            {post.user._id === user._id && (
              <div
                className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
                onClick={onDelete}
              >
                <AiFillDelete size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
