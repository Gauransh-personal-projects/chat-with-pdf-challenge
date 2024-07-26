"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  //listen to the user document
  const [snapshot, loading, error] = useDocument(
    user && doc(db, "user", user.id, "files"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [fileSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user?.id, "files")
  );

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    const data = snapshot.data();
    if (!data) return;

    setHasActiveMembership(data.activeMembership);
  }, [snapshot]);

  useEffect(() => {
    if (!fileSnapshot || hasActiveMembership === null) return;

    const files = fileSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      "Checking if user is over file limit",
      files.length,
      usersLimit
    );

    setIsOverFileLimit(files.length >= usersLimit);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]);

  return { hasActiveMembership, isOverFileLimit, loading, filesLoading, error };
}

export default useSubscription;
