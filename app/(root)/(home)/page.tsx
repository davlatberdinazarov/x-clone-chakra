"use client";

import Demo from "@/components/demo";
import LogoutButton from "@/components/logout";
import Form from "@/components/shared/form";
import Header from "@/components/shared/header";
import PostItem from "@/components/shared/post-item";
import { IPost } from "@/types";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getPosts } from "@/app/api/post/actions"; // ✅ Server Actions import qildik

export default function Home() {
  const { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts(10); // ✅ Axios o‘rniga server action ishlatyapmiz
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log(posts);

  return (
    <div>
      <Header label="Home" isBack />
      {isLoading || status === "loading" ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <>
          <Form
            placeholder="What's on your mind?"
            user={session?.currentUser}
            setPosts={setPosts}
          />
          {posts.map((post) => (
            <PostItem key={post._id} post={post}  user={JSON.parse(JSON.stringify(session.currentUser))} setPosts={setPosts} />
          ))}
        </>
      )}

      <Demo />
      <LogoutButton />
    </div>
  );
}
