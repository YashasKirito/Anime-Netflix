/* eslint-disable @next/next/no-img-element */
import Button from "@atoms/Button";
import Spinner from "@atoms/Spinner";
import AnimeTile from "@molecules/AnimeTile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { urls } from "service/urls";
import { Debounce } from "utils/debounce";
import Select from "react-select";
import { useSearchStore } from "store/useSearch";

const Type = [
  { value: "ANIME", label: "ANIME" },
  { value: "MANGA", label: "MANGA" },
];

const Season = [
  { value: "WINTER", label: "WINTER" },
  { value: "SPRING", label: "SPRING" },
  { value: "SUMMER", label: "SUMMER" },
  { value: "FALL", label: "FALL" },
];

const sort = [
  "POPULARITY_DESC",
  "POPULARITY",
  "TRENDING_DESC",
  "TRENDING",
  "UPDATED_AT_DESC",
  "UPDATED_AT",
  "START_DATE_DESC",
  "START_DATE",
  "END_DATE_DESC",
  "END_DATE",
  "FAVOURITES_DESC",
  "FAVOURITES",
  "SCORE_DESC",
  "SCORE",
  "TITLE_ROMAJI_DESC",
  "TITLE_ROMAJI",
  "TITLE_ENGLISH_DESC",
  "TITLE_ENGLISH",
  "TITLE_NATIVE_DESC",
  "TITLE_NATIVE",
  "EPISODES_DESC",
  "EPISODES",
  "ID",
  "ID_DESC",
].map((str) => ({
  value: str,
  label: str.replaceAll("_", " "),
}));

const genres = [
  "Action",
  "Adventure",
  "Cars",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
].map((str) => ({
  value: str,
  label: str,
}));

const states = [
  "RELEASING",
  "NOT_YET_RELEASED",
  "FINISHED",
  "CANCELLED",
  "HIATUS",
].map((str) => ({
  value: str,
  label: str.replaceAll("_", " "),
}));

const formats = [
  "TV",
  "TV_SHORT",
  "OVA",
  "ONA",
  "MOVIE",
  "SPECIAL",
  "MUSIC",
].map((str) => ({
  value: str,
  label: str.replaceAll("_", " "),
}));

const makeValue = (value?: string | string[]) => {
  if (!value) return undefined;
  if (Array.isArray(value))
    return value.map((value) => ({
      value: value,
      label: value.replaceAll("_", " "),
    }));
  return {
    value: value,
    label: value.replaceAll("_", " "),
  };
};

const colors = {
  primary75: "#191919",
  primary50: "#2d2d2d",
  primary25: "#2d2d2d",
  primary: "black",
  neutral0: "#1a1a1a",
  neutral5: "#333333",
  neutral10: "#4d4d4d",
  neutral20: "#666666",
  neutral30: "#808080",
  neutral40: "#999999",
  neutral50: "#b3b3b3",
  neutral60: "#cccccc",
  neutral70: "#e6e6e6",
  neutral80: "#f2f2f2",
  neutral90: "#fff",
};

const customStyles = {
  option: (provided: any) => ({
    ...provided,
    cursor: "pointer",
    color: "white",
    fontSize: "12px",
    textTransform: "capitalize",
  }),
};

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filter = useSearchStore();

  // TODO: implement infinite scrolling

  const searchAnime = async () => {
    const { query, format, type, sort, genres, status, year, season } = filter;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL + urls.advancedSearch}`,
        {
          params: {
            query,
            format,
            type,
            sort,
            genres,
            status,
            year,
            season,
          },
        }
      );
      setResults(res.data.results);
    } catch {
      setError("Error getting anime data");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = Debounce((value) => {
    filter.setQuery(value);
  }, 500);

  useEffect(() => {
    searchAnime();
  }, [filter]);

  return (
    <div className="flex relative flex-col px-10 md:px-32 pt-20 min-h-screen bg-[url('/abstract-1.jpg')] bg-fixed bg-contain w-full">
      <div className="fixed h-screen w-screen backdrop-blur-sm bg-black/10 top-0 left-0"></div>
      <section className="my-5 flex flex-col z-0">
        <h1 className="font-bold text-4xl py-10">Search Anime</h1>
        <input
          value={filter.query}
          className="bg-black w-full text-lg p-5 px-10 rounded border-white/50 border-2 font-bold text-slate-300 outline-slate-600"
          type="text"
          placeholder="Search"
          onChange={(e) =>
            debouncedSearch(e.target.value ? e.target.value : undefined)
          }
        />
      </section>
      <section className="flex mb-5 w-full gap-1 flex-wrap">
        <Select
          className="w-auto flex-grow"
          isClearable
          placeholder="Type"
          value={makeValue(filter.type)}
          onChange={(e: any) => filter.setType(e.value)}
          options={Type}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />
        <input
          className="w-28 flex-grow px-4 rounded border border-[#666666] bg-[#1a1a1a] outline-black z-0"
          placeholder="Year (eg: 2020)"
          value={filter.year}
          onChange={(e: any) => filter.setYear(e.target.value)}
        />
        <Select
          className="w-auto flex-grow"
          isClearable
          placeholder="Season"
          value={makeValue(filter.season)}
          onChange={(e: any) => filter.setSeason(e?.value)}
          options={Season}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />
        <Select
          className="w-auto flex-grow"
          isClearable
          placeholder="Format"
          value={makeValue(filter.format)}
          onChange={(e: any) => filter.setFormat(e?.value)}
          options={formats}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />
        <Select
          className="w-auto flex-grow"
          isClearable
          isMulti
          placeholder="Sort"
          value={makeValue(filter.sort)}
          onChange={(e: any) => filter.setSort(e.map((val: any) => val?.value))}
          options={sort}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />
        <Select
          className="w-auto flex-grow"
          isClearable
          isMulti
          placeholder="Genres"
          value={makeValue(filter.genres)}
          onChange={(e: any) =>
            filter.setGenres(e.map((val: any) => val?.value))
          }
          options={genres}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />

        <Select
          className="w-auto flex-grow"
          isClearable
          placeholder="Status"
          value={makeValue(filter.status)}
          onChange={(e: any) => filter.setStatus(e?.value)}
          options={states}
          styles={customStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors,
            },
          })}
        />
      </section>

      <section>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex h-screen items-center justify-center">
            <p className="text-2xl font-bold">An unexpected error occurred!</p>
          </div>
        ) : (
          <div className="flex flex-wrap mb-10 gap-3 w-full">
            {results.map((anime: any) => {
              return (
                <div
                  key={anime.id}
                  className="backdrop-blur bg-white/10 w-min p-5 rounded overflow-hidden flex flex-col gap-4"
                >
                  <AnimeTile anime={anime} />
                  <div className="flex-grow z-10 flex flex-col">
                    <h2 className="text-xs font-semibold flex items-center gap-6">
                      {anime.title.romaji}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
