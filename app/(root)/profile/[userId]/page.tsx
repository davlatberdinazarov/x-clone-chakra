"use client";

import { getUserById } from "@/actions/profile.actions";
import ProfileBio from "@/components/profile/profile-bio";
import ProfileHero from "@/components/profile/profile-hero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/post-feed";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams<{ userId: string }>();
  const { data: session, status }: any = useSession();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params.userId) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await getUserById(params.userId);
        setUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <>
      <Header label={user?.name || "Profile"} isBack />
      <ProfileHero user={user} />
      <ProfileBio user={user} userId={session?.currentUser?._id} />
      <PostFeed userId={params.userId} user={session?.currentUser} />
    </>
  );
};

export default Page;
