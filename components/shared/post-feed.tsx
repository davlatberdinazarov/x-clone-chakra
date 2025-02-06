"use client";

import { IPost, IUser } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import PostItem from "./post-item";
import { getUserPosts } from "@/actions/profile.actions";

interface Props {
  userId: string;
  user: IUser;
}

const PostFeed = ({ userId, user }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getUserPosts(userId);
  
      if (response?.data) {
        const postsWithUpdatedAt = response.data.map((post: any) => ({
          ...post,
          updatedAt: post.updatedAt || new Date().toISOString(), // Ensure updatedAt is present
        }));
        setPosts(postsWithUpdatedAt); // Ma'lumot borligini tekshirib, so‘ng setPosts() ni chaqiramiz
      } else {
        setPosts([]); // Agar response.data bo‘lmasa, bo‘sh array beramiz
      }
  
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Xatolik bo‘lsa ham, bo‘sh array beramiz
    } finally {
      setIsLoading(false); // Yozishni to‘g‘ri joyga qo‘ydik
    }
  };
  

  useEffect(() => {
    getPosts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return isLoading ? (
    <div className="flex justify-center items-center h-24">
      <Loader2 className="animate-spin text-sky-500" />
    </div>
  ) : (
    posts.map((post) => (
      <PostItem key={post._id} post={post} user={user} setPosts={setPosts} />
    ))
  );
};

export default PostFeed;