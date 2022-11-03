import create from "zustand";

interface SearchState {
  query?: string;
  type?: string;
  page?: number;
  perPage?: number;
  season?: string;
  format?: string;
  sort?: string[];
  genres?: string[];
  id?: string;
  year?: string;
  status?: string;
  // setters
  setQuery: (query?: string) => void;
  setType: (type: string) => void;
  setSeason: (season: string) => void;
  setFormat: (format: string) => void;
  setSort: (sort: string[]) => void;
  setGenres: (genres: string[]) => void;
  setYear: (year: string) => void;
  setStatus: (status: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  setQuery: (query) => set({ query }),
  setType: (type) => set({ type }),
  setSeason: (season) => set({ season }),
  setFormat: (format) => set({ format }),
  setSort: (sort) => set({ sort }),
  setGenres: (genres) => set({ genres }),
  setYear: (year) => set({ year }),
  setStatus: (status) => set({ status }),
}));
