"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar } from "../ui/avatar";
import { IPost, IUser } from "@/types";
import Button from "../ui/button";
import { usePostStore } from "@/store/renders";
import { createPost } from "@/actions/post.actions";
import { createComment } from "@/actions/comment.actions";

interface Props {
  placeholder: string;
  user: IUser;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  postId?: string;
  isComment?: boolean;
}

export default function Form({
  placeholder,
  user,
  setPosts,
  isComment,
  postId,
}: Props) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { increment } = usePostStore();

  const onSubmit = async () => {
    if (!body.trim()) return;

    setIsLoading(true);
    try {
      if (isComment) {
        if (!postId) {
          console.error("Post ID is required to create a comment.");
          return;
        }
        const response = await createComment({ body, postId });
        console.log('Create Comment post: ',response);
        if (response?.status === 200 && response.data) {
          const newComment = {
            ...response.data,
            user,
            likes: 0,
            hasLiked: false,
          };
          setPosts((prev) => { 
            console.log('Previous posts:', prev); 
            return [newComment, ...prev]
          });
        }
      } else {
        increment();
        const newPost = await createPost({ body, userId: user._id });
        if (newPost) {
          setPosts((prev) => [newPost, ...prev]);
        }
      }
      setBody("");
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      <div className="flex flex-row gap-4">
        <Avatar name={user?.name} src={user?.profileImage} />

        <div className="w-full">
          <textarea
            className="disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white h-[50px]"
            placeholder={placeholder}
            disabled={isLoading}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSubmit()}
          ></textarea>
          <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />

          <div className="mt-4 flex flex-row justify-end">
            <Button
              classNames="px-8"
              disabled={isLoading || !body.trim()}
              onClick={onSubmit}
            >
              {isComment ? "Reply" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
