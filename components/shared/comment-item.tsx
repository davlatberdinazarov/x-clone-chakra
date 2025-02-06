"use client";

import { IPost, IUser } from "@/types";
import React, { useState } from "react";
import { sliceText } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { FaHeart } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { Loader2 } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { toaster } from "../ui/toaster";
import { deleteComment, likeComment, unlikeComment } from "@/actions/comment.actions";

interface Props {
  comment: IPost;
  user: IUser;
  setComments: React.Dispatch<React.SetStateAction<IPost[]>>;
  comments: IPost[];
}

const CommentItem = ({ comment, user, setComments, comments }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onLike = async () => {
    try {
      setIsLoading(true);
      if (comment.hasLiked) {
        await unlikeComment({ id: comment._id });
        const updatedComments = comments.map((c) => {
          if (c._id === comment._id) {
            return {
              ...c,
              hasLiked: false,
              likes: c.likes - 1,
            };
          }
          return c;
        });

        setComments(updatedComments);
        toaster.create({
          description: "You unliked this comment.",
          type: "success",
        });
      } else {
        await likeComment({ id: comment._id });
        const updatedComments = comments.map((c) => {
          if (c._id === comment._id) {
            return {
              ...c,
              hasLiked: true,
              likes: c.likes + 1,
            };
          }
          return c;
        });

        setComments(updatedComments);
        toaster.create({
          description: "You liked this comment.",
          type: "success",
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toaster.create({
        description: "An error occurred while liking the comment.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteComment({ parsedInput: { id: comment._id } });
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
      setIsLoading(false);
      toaster.create({
        description: "Comment deleted successfully.",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toaster.create({
        description: "An error occurred while deleting the comment.",
        type: "error",
      });
    }
  };

  return (
    <div className="border-b-[1px] relative border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        </div>
      )}
      <div className="flex flex-row items-center gap-3">
        <Avatar name={comment?.user.name[0]} src={comment?.user.profileImage} />

        <div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-white font-semibold cursor-pointer hover:underline">
              {comment?.user.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              {comment && comment?.user.username
                ? `@${sliceText(comment.user.username, 20)}`
                : comment && sliceText(comment.user.email, 20)}
            </span>
            <span className="text-neutral-500 text-sm">
              {comment &&
                comment.createdAt &&
                formatDistanceToNowStrict(new Date(comment.createdAt))}
            </span>
          </div>
          <div className="text-white mt-1">{comment?.body}</div>

          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              className={`flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500`}
              onClick={onLike}
            >
              <FaHeart size={20} color={comment.hasLiked ? "red" : ""} />
              <p>{comment.likes || 0}</p>
            </div>

            {comment.user._id === user._id && (
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

export default CommentItem;
