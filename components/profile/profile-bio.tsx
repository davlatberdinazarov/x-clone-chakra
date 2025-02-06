"use client";

import { IUser } from "@/types";
import React, { useState } from "react";
import Button from "../ui/button";
import { IoLocationSharp } from "react-icons/io5";
import { BiCalendar } from "react-icons/bi";
import { formatDistanceToNowStrict } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { followUser, unfollowUser } from "@/actions/profile.actions";
import EditModal from "../modals/edit-modal";
import useEditModal from "@/hooks/useEditModal";

const ProfileBio = ({ user, userId }: { user: IUser; userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const editModal = useEditModal();

  const onFollow = async () => {
    try {
      setIsLoading(true);
      await followUser({
        userId: user._id,
        currentUserId: userId,
      });
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
      await unfollowUser({ userId: user._id, currentUserId: userId });
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <EditModal user={user} />
      <div className="border-b-[1px] border-neutral-800 pb-4">
        <div className="flex justify-end p-2">
          {userId === user._id ? (
            <Button secondary onClick={() => editModal.onOpen()}>
              Edit profile
            </Button>
          ) : user.isFollowing ? (
            <Button outline onClick={onUnfollow} disabled={isLoading}>
              Unfollow
            </Button>
          ) : (
            <Button onClick={onFollow} disabled={isLoading}>
              Follow
            </Button>
          )}
        </div>

        <div className="mt-8 px-4">
          <div className="flex flex-col">
            <p className="text-white text-2xl font-semibold">{user.name}</p>
          </div>

          <p className="text-md text-neutral-500">
            {user.username ? `@${user.username}` : user.email}
          </p>

          <div className="flex flex-col mt-4">
            <p className="text-white">{user.bio}</p>
            <div className="flex gap-4 items-center">
              {user.location && (
                <div className="flex flex-row items-center gap-2 mt-4 text-sky-500">
                  <IoLocationSharp size={24} />
                  <p>{user.location}</p>
                </div>
              )}
              <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
                <BiCalendar size={24} />
                <p>
                  Joined {formatDistanceToNowStrict(new Date(user.createdAt))}{" "}
                  ago
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center mt-6 gap-6">
              <div className="flex flex-row items-center gap-1 hover:underline cursor-pointer">
                <p className="text-white">{user.following}</p>
                <p className="text-neutral-500">Following</p>
              </div>

              <div className="flex flex-row items-center gap-1 hover:underline cursor-pointer">
                <p className="text-white">{user.followers}</p>
                <p className="text-neutral-500">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileBio;
