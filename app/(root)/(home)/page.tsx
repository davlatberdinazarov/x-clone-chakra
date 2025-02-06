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
import { usePostStore } from "@/store/renders";
import { getPosts } from "@/actions/post.actions";

export default function Home() {
  const { data: session, status }: any = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  const { postCount } = usePostStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts(10) as IPost[]; // ✅ Axios o‘rniga server action ishlatyapmiz
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [postCount]);

  console.log('POSTS', posts);

  return (
    <div>
      <Header label="Home" />
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
    </div>
  );
}
