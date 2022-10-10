import { useAuthStore } from "Auth";
import { Unsubscribe } from "firebase/auth";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { useMyListStore } from "store/MyListStore";
import { db } from "../firebase";

const MyListWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);
  const [setList] = useMyListStore(state => [state.setList])
  useEffect(() => {
    let unSub: Unsubscribe;
    if (user) {
      const q = query(collection(db, "mylist", `${user.email}`, "watch-list"));
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

export default MyListWrapper;
