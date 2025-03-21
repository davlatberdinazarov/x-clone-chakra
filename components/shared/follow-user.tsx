"use client";

import { IUser } from "@/types";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { sliceText } from "@/lib/utils";
import Button from "../ui/button";
import axios from "axios";
import { Avatar } from "@chakra-ui/react";

interface Props {
  user: IUser;
  setFollowing: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const FollowUser = ({ user, setFollowing }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<IUser>(user);

  const router = useRouter();
  const { userId } = useParams();
  const { data: session }: any = useSession();

  const onFollow = async () => {
    try {
      setIsLoading(true);
      await axios.put("/api/follows", {
        userId: user._id,
        currentUserId: session?.currentUser?._id,
      });
      if (userId === session?.currentUser?._id) {
        setFollowing((prev) => [
          ...prev,
          {
            ...user,
            followers: [...user.followers, session?.currentUser?._id],
          },
        ]);
      }
      setProfile((prev) => ({
        ...prev,
        followers: [...prev.followers, session?.currentUser?._id],
      }));
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUnfollow = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/follows", {
        data: { userId: user._id, currentUserId: session?.currentUser?._id },
      });
      if (userId === session?.currentUser?._id) {
        setFollowing((prev) =>
          prev.filter((following) => following._id !== user._id)
        );
      }
      setProfile((prev) => ({
        ...prev,
        followers: prev.followers.filter(
          (follower) => follower !== session?.currentUser?._id
        ),
      }));
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md">
      <div className="flex gap-2 cursor-pointer">
        <Avatar.Root>
          <Avatar.Fallback>{profile.name[0]}</Avatar.Fallback>
          <Avatar.Image className="w-full h-full" src={profile.profileImage} />
        </Avatar.Root>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-clamp-1">
            {profile.name}
          </p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {profile.username
              ? `@${sliceText(user.username, 20)}`
              : sliceText(user.email, 20)}
          </p>
        </div>
      </div>

      {profile._id !== session?.currentUser?._id ? (
        profile.followers.includes(session?.currentUser?._id) ? (
          <Button
            outline
            classNames="h-[30px] p-0 w-fit px-3 text-sm"
            disabled={isLoading}
            onClick={onUnfollow}
          >Unfollow</Button>
        ) : (
          <Button
            classNames="h-[30px] p-0 w-fit px-3 text-sm"
            disabled={isLoading}
            onClick={onFollow}
          >Follow</Button>
        )
      ) : null}
    </div>
  );
};

export default FollowUser;