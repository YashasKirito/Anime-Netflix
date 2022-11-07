import { useAuthStore } from "Auth";
import { Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { useContinueWatchingStore } from "store/ContinueWatchStore";
import { db } from "..";

const ContinueWatchingWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);
  const [setList] = useContinueWatchingStore((state) => [state.setList]);
  useEffect(() => {
    let unSub: Unsubscribe;
    if (user) {
      const q = query(
        collection(db, "mylist", `${user.email}`, "continue-watching")
      );
      unSub = onSnapshot(q, (querySnapshot) => {
        const list: any = {};
        querySnapshot.forEach((doc) => {
          list[doc.id] = doc.data();
        });
        setList(list);
      });
    }
    return () => {
      unSub && unSub();
    };
  }, [user, setList]);
  return <>{children}</>;
};

export default ContinueWatchingWrapper;
