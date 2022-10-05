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
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  rating: null | number;
  color: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: 1;
  genres: string[];
  type: string;
}
