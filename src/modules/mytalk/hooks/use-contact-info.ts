import { useEffect, useState } from "react";
import { useGetWhoAmI } from "./use-who-am-i";
import type { WhoAmIUser } from "../interfaces/who-am-i";

export function useContactInfo({ contactId }: { contactId?: number }) {
  if (!contactId) return;
  const [contact, setContact] = useState<WhoAmIUser | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    setShouldFetch(true);
  }, [contactId]);

  const { contactUser } = useGetWhoAmI({ userId: contactId, shouldFetch });

  useEffect(() => {
    if (contactUser) {
      setContact(contactUser);
    }
  }, [contactUser]);

  return contact;
}
