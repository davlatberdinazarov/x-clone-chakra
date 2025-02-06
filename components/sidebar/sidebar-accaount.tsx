"use client";

import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Loader2, MoreHorizontal } from "lucide-react";
import { sliceText } from "@/lib/utils";
import { Avatar } from "@chakra-ui/react";

const SidebarAccount = () => {
  const { data, status }: any = useSession();

  if (status == "loading")
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-500" />
      </div>
    );

  return (
    <>
      {/* MOBIE SIDEBAR ACCOUNT */}
      <div className="lg:hidden block">
        <div
          className="mt-6 lg:hidden rounded-full h-14 w-14 p-4 flex items-center justify-center bg-red-500 hover:bg-opacity-80 transition cursor-pointer"
          onClick={() => signOut()}
        >
          <RiLogoutCircleLine size={24} color="white" />
        </div>
      </div>

      {/* DESKTOP SIDEBAR ACCOUNT */}
      <PopoverRoot>
        <PopoverTrigger
          asChild
          className="w-full rounded-full hover:bg-slate-300 hidden lg:block cursor-pointer hover:bg-opacity-10 px-4 py-2 transition"
        >
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-1 justify-between items-center">
              <div className=" flex  items-center gap-2">
                <Avatar.Root>
                  <Avatar.Fallback />
                  <Avatar.Image className="h-full w-full object-cover" src={data?.currentUser?.profileImage} />
                </Avatar.Root>

                <div className="flex flex-col items-start text-white">
                  <p>{data?.currentUser?.name}</p>
                  {data?.currentUser?.username ? (
                    <p className="opacity-40">
                      @{sliceText(data?.currentUser?.username, 16)}
                    </p>
                  ) : (
                    <p className="opacity-40">
                      {sliceText(data?.currentUser?.email, 16)}
                    </p>
                  )}
                </div>
              </div>

              <MoreHorizontal size={24} color="white" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-black border-none rounded-2xl shadow shadow-white px-0 mb-3">
          <PopoverArrow />
          <PopoverBody>
            <div
              className="font-bold text-white text-lg rounded-xl cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 p-4 transition"
              onClick={() => signOut()}
            >
              Log out @userhandle
            </div>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </>
  );
};

export default SidebarAccount;
