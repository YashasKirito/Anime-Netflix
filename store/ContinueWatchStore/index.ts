import { episodeType } from "store/useCurrentlyWatching";
import create from "zustand";

export type itemType = {
  animeTitle?: string;
  episode: episodeType;
  progress: number;
};

interface IList {
  [key: string]: itemType;
}

interface IContinueWatching {
  myList: IList;
  setList: (items: IList) => void;
}

export const useContinueWatchingStore = create<IContinueWatching>(
  (set, get) => ({
    myList: {},
    setList: (items) => set({ myList: items }),
  })
);
