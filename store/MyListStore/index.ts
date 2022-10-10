import create from "zustand";

interface MyListState {
  myList: any[];
  setList: (items: any[]) => void;
  stale: boolean;
}


export const useMyListStore = create<MyListState>((set) => ({
  myList: [],
  stale: false,
  setList: (items) => set({ myList: items }),
}));
