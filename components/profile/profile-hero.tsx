import { IUser } from "@/types";
import { Avatar } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
// import { Avatar } from "../ui/avatar";

const ProfileHero = ({ user }: { user: IUser }) => {
  return (
    <div className="h-44 relative bg-neutral-800">
      {user.coverImage ? (
        <Image
          fill
          src={user.coverImage}
          alt={user.name}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <Image
          fill
          src={"/images/cover-placeholder.png"}
          alt={user.name}
          style={{ objectFit: "cover" }}
        />
      )}

      <div className="absolute -bottom-16 left-4">
        <Avatar.Root size={"2xl"} className="w-32 h-32">
          <Avatar.Fallback className=" text-6xl">{user.name[0]}</Avatar.Fallback>
          <Avatar.Image src={user.profileImage} />
        </Avatar.Root>
      </div>
    </div>
  );
};

export default ProfileHero;
