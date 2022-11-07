import { useAuthStore } from "Auth";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { itemType } from "store/ContinueWatchStore";

import { db } from "../index";

export const addItemTContinueWatchingFireStore = async (item: itemType) => {
  const user = useAuthStore.getState().user;

  if (!user) return;

  const itemRef = doc(
    db,
    "mylist",
    `${user.email}`,
    "continue-watching",
    item.animeTitle!
  );
  await setDoc(itemRef, item, { merge: true });
};

export const deleteMyListItemFireStore = async (docId: string) => {
  const user = useAuthStore.getState().user;

  if (!user) return;
  await deleteDoc(
    doc(db, "mylist", `${user.email}`, "continue-watching", docId)
  );
};
