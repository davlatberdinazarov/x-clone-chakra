"use client";

import { fetchUsers } from "@/app/api/users/actions";
import { useEffect, useState } from "react";

const useUsers = (limit: number) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers(limit);
        setUsers(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, [limit]);

  return { users, isLoading, isError };
};

export default useUsers;
