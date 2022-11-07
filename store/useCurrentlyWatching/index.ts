import create from "zustand";

export type episodeType = {
  id: string;
  title: string;
  number: number;
  image: string;
};

interface CurrentlyWatchingState {
  animeTitle?: string;
  episodeTitle?: string;
  episodeNumber?: number;
  episodeList?: episodeType[];
  setAnimeData: (
    animeTitle: string,
    episodeTitle: string,
    episodeNumber: number
  ) => void;
  setEpisodesList: (episodeList: episodeType[]) => void;
}

export const useCurrentlyWatchingStore = create<CurrentlyWatchingState>(
  (set, get) => ({
    setAnimeData: (animeTitle, episodeTitle, episodeNumber) => {
      set({ animeTitle, episodeTitle, episodeNumber });
    },
    setEpisodesList: (episodeList) => {
      set({ episodeList });
    },
  })
);
