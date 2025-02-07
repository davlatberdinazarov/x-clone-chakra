"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById } from "@/actions/profile.actions";
import ProfileBio from "@/components/profile/profile-bio";
import ProfileHero from "@/components/profile/profile-hero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/post-feed";
import { getSession } from "next-auth/react";

const Page = () => {
  const { userId } = useParams<{ userId: string }>(); // useParams bilan olish
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);

      const sessionData = await getSession();
      setSession(sessionData);
    };

    fetchData();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Header label={user.name} isBack />
      <ProfileHero user={user} />
      <ProfileBio user={user} userId={session?.user?.id} />
      <PostFeed userId={userId} user={session?.user} />
    </>
  );
};

export default Page;
