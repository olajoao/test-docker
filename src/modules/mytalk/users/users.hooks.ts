import { useQuery } from "@tanstack/react-query";
import { userCacheKey } from "./users.cache-key";
import { listContacts, listUsers } from "./users.service";
import { useEffect } from "react";
import type { WebUserApiProps } from "./users.types";

export const useDepartmentUsers = () => {
  const { data: usersList, isPending: isLoadingUsers } = useQuery({
    queryKey: [userCacheKey.list],
    queryFn: listUsers,
  });

  return {
    usersList,
    isLoadingUsers,
  };
};

export const useContactUsers = () => {
  const { data: contactList, isPending: isLoadingContatcs } = useQuery({
    queryKey: [userCacheKey.list],
    queryFn: listContacts,
    refetchInterval: 5000 // 5 seconds
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (contactList?.data?.length) {
        const usersData = contactList.data.map((user) => ({
          id: user.id,
          avatar: user.avatar,
          created_at: new Date(),
        })) as Partial<WebUserApiProps>[];

        localStorage.setItem('users', JSON.stringify(usersData));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [contactList]);

  return {
    contactList,
    isLoadingContatcs,
  };
};
