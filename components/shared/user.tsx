import { sliceText } from "@/lib/utils";

import React from "react";
import { IUser } from "@/types";
import { Avatar } from "@chakra-ui/react";

export default function User({ user }: { user: IUser }) {
  return (
    <div className="flex gap-3 items-center justify-between cursor-pointer hover:bg-slate-300 hover:bg-opacity-10 transition py-2 px-3 rounded-md">
      <div className="flex gap-2 cursor-pointer">
        <Avatar.Root>
          <Avatar.Fallback />
          <Avatar.Image
            className="h-full w-full object-cover"
            src={user?.profileImage}
          />
        </Avatar.Root>

        <div className="flex flex-col">
          <p className="text-white font-semibold text-sm line-clamp-1">
            {user?.name}
          </p>
          <p className="text-neutral-400 text-sm line-clamp-1">
            {user.username
              ? `@${sliceText(user.username, 16)}`
              : sliceText(user.email, 16)}
          </p>
        </div>
      </div>
    </div>
  );
}
