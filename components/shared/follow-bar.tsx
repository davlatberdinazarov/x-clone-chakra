"use client";

import React from "react";
import Button from "../ui/button";
import { Loader2 } from "lucide-react";
import useUsers from "@/hooks/useUsers";
import { IUser } from "@/types";
import Link from "next/link";
import User from "./user";

const FollowBar = () => {
  const {users, isLoading, isError} = useUsers(5);

  console.log(users, isLoading, isError);

  return (
    <div className="py-4 hidden lg:block w-[266px]">
      <div className="bg-neutral-800 rounded-xl ">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-white text-xl font-semibold">Who to follow</h2>
          <Link href="/explore">
            <Button secondary classNames="h-[30px] p-0 w-fit px-3 text-sm">
              See all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            {users.map((user: IUser) => (
              <Link key={user._id} href={`/profile/${user._id}`}>
                <User user={user} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowBar;
