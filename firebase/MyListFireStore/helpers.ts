import { useAuthStore } from "Auth";
import { doc, setDoc } from "firebase/firestore";
import { itemType } from "store/MyListStore";

import { db } from "../index";

export const addItemToMyListFireStore = async (item: itemType) => {
  const user = useAuthStore.getState().user;

  if (!user) return;

  const itemRef = doc(db, "mylist", `${user.email}`, "watch-list", item.id);
  await setDoc(itemRef, item, { merge: true });
};
