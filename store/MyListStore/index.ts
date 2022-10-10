import create from "zustand";

type item = {
  id: string;
  name: string;
  image: string;
  type: string;
};

interface IList {
  [key: string]: item;
}

interface MyListState {
  myList: IList;
  setList: (items: IList) => void;
  stale: boolean;
  add: (item: item) => void;
}

export const useMyListStore = create<MyListState>((set, get) => ({
  myList: {},
  stale: false,
  setList: (items) => set({ myList: items }),
  add: (item) => set({ myList: { ...get().myList, [item.id]: item } }),
}));
