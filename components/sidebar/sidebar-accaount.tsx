"use client";

import { Button, Input, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut } from "next-auth/react";
import React from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Loader2, MoreHorizontal } from "lucide-react";

const SidebarAccount = () => {
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
                <Avatar>
                  <p>U</p>
                </Avatar>
                <div className="flex flex-col items-start text-white">
                  <p>Username</p>
                  <p className="opacity-40">@userhandle</p>
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
              className="font-bold text-white cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 p-4 transition"
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
