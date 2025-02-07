"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ useParams hook ishlatamiz
import Header from "@/components/shared/header";
import Button from "@/components/ui/button";
import useNotifications from "@/hooks/useNotifications";
import { deleteNotifications } from "@/actions/notification.actions";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const params = useParams(); // ✅ params ni unwrap qilamiz
  const [userId, setUserId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (params?.userId) {
      setUserId(params.userId as string);
    }
  }, [params]);

  const { data: notifications, isLoading, refetch } = useNotifications(userId ?? "");

  const onClear = async () => {
    if (!userId) return;
    
    setIsClearing(true);
    const response = await deleteNotifications(userId);
    
    if (response.status) {
      refetch(); // 🔄 Yangilash
    } else {
      console.error(response.error);
    }

    setIsClearing(false);
  };

  return (
    <>
      <Header isBack label="Notifications" />
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="flex flex-col">
          {notifications?.length > 0 ? (
            notifications.map((notification) => (
              <div
                className="flex flex-row items-center p-6 gap-4 border-b border-neutral-800"
                key={notification._id}
              >
                <Image alt="logo" src="/images/x.svg" width={32} height={32} />
                <p className="text-white">{notification.body}</p>
              </div>
            ))
          ) : (
            <div className="text-neutral-600 text-center p-6 text-xl">
              No notifications
            </div>
          )}
          {notifications?.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button outline onClick={onClear} disabled={isClearing}>
                {isClearing ? "Clearing..." : "Clear all"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
