"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar } from "../ui/avatar";
import { IPost, IUser } from "@/types";
import Button from "../ui/button";
import { createPost } from "@/app/api/post/actions";

interface Props {
  placeholder: string;
  user: IUser;
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  isComment?: boolean;
}

export default function Form({ placeholder, user, setPosts, isComment }: Props) {
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!body.trim()) return; // Bo'sh post yaratishdan saqlanish

    try {
      setIsLoading(true);
      
      // ✅ Server action orqali post yaratish
      const newPost = await createPost({ body, userId: user._id });
      
      // ✅ Yangi postni setPosts ga qo'shamiz
      setPosts((prev) => [newPost, ...prev]);
      
      setBody("");
    } catch (error) {
      console.error("Post yaratishda xatolik:", error);
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
          ></textarea>
          <hr className="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />

          <div className="mt-4 flex flex-row justify-end">
            <Button
              classNames="px-8"
              disabled={isLoading || !body}
              onClick={onSubmit} // ✅ Tugmani bosganda server action chaqiriladi
            >
              {isComment ? "Reply" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
