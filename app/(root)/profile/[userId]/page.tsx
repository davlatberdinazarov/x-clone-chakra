
import { getUserById } from "@/actions/profile.actions";
import ProfileBio from "@/components/profile/profile-bio";
import ProfileHero from "@/components/profile/profile-hero";
import Header from "@/components/shared/header";
import PostFeed from "@/components/shared/post-feed";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import React from "react";

const Page = async ({ params }: { params: { userId: string } }) => {
  const session: any = await getServerSession(authOptions);
  const { userId } = await params; // Await params to ensure it's resolved
  const user = await getUserById(userId);

  return (
    <>
      <Header label={user.name} isBack />
      <ProfileHero user={JSON.parse(JSON.stringify(user))} />
      <ProfileBio
        user={JSON.parse(JSON.stringify(user))}
        userId={JSON.parse(JSON.stringify(session)).currentUser._id}
      />
      <PostFeed
        userId={userId}
        user={JSON.parse(JSON.stringify(session.currentUser))}
      />
    </>
  );
};

export default Page;