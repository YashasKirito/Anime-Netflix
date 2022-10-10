export interface IAnime {
  id: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  trailer: {
    id?: string;
    site?: string;
    thumbnail?: string;
  };
  description: string;
  status: string;
  cover: string;
  rating: number | null;
  releaseDate: number;
  genres: string[];
  totalEpisodes: number;
  duration: number;
  type: string;
}

export interface IEpisode {
  id: string;
  title: string;
  description: null | string;
  number: number;
  image: string;
}
