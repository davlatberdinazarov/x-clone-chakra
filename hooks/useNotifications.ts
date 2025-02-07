import { useEffect, useState } from "react";
import { fetchNotifications } from "@/actions/notification.actions";

const useNotifications = (userId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getNotifications = async () => {
    setIsLoading(true);
    const response = await fetchNotifications(userId);

    if (response.status) {
      setData(response.data ?? []);
    } else {
      console.error(response.error);
      setData([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (userId) {
      getNotifications();
    }
  }, [userId]);

  return { data, isLoading, refetch: getNotifications };
};

export default useNotifications;

