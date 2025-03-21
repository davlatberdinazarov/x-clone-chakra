"use client";
import Header from "@/components/shared/header";
import { sliceText } from "@/lib/utils";
import { IUser } from "@/types";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Avatar, Input } from "@chakra-ui/react";
import { fetchUsers, searchUsers } from "@/actions/user.actions";
const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [users, setUsers] = useState<IUser[]>([]); // `undefined` bo'lishining oldini oladi
  useEffect(() => {
    getAllUsers();
  }, []);
  const getAllUsers = async () => {
    try {
      const { data } = await fetchUsers(20);
      setAllUsers(data);
      setUsers(data || []);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.toLowerCase();
    if (text && text?.length > 2) {
      setIsLoading(true);
      const response = await searchUsers(text);
      
      if (response.status && response.data) {
        setUsers(response.data); // To'g'ri natija bo'lsa
      } else {
        setUsers([]); // Foydalanuvchi topilmasa
        console.log(response.error || "User not found");
      }
      
      setIsLoading(false);
    } else {
      setUsers(allUsers);
      setIsLoading(false);
    }
  };
  
  const debouncedSearch = debounce(handleSearch, 500);
  return (
    <>
      <Header label="Explore" />
      <div className="relative">
        <Input
          placeholder="Search for users"
          className="mt-2 w-[98%] p-3 mx-auto block border-none bg-neutral-900 text-white"
          onChange={debouncedSearch}
        />
        <div className="absolute rounded-md h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 right-2 top-1/2 -translate-y-1/2 cursor-pointer">
          <Search className="text-white" size={28} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <>
          {users?.length === 0 && (
            <div className="text-neutral-600 text-center p-6 text-xl">
              No users found
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 mt-6">
            {users?.length > 0 &&
              users.map((user) => (
                <Link key={user._id} href={`/profile/${user._id}`}>
                  <div className="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition relative mr-4">
                    <div className="flex flex-row gap-4">
                      <Avatar.Root>
                        <Avatar.Image
                          className="h-full w-full"
                          src={user.profileImage}
                        />
                        <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
                      </Avatar.Root>
                      <div className="flex flex-col">
                        <p className="text-white font-semibold cursor-pointer capitalize">
                          {user.name}
                        </p>
                        <span className="text-neutral-500 cursor-pointer md:block">
                          {user.username
                            ? `@${sliceText(user.username, 16)}`
                            : sliceText(user.email, 16)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </>
      )}
    </>
  );
};
export default Page;
