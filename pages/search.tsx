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
import { pickTextColorBasedOnBgColorAdvanced } from "utils/getContrastColor";

const SearchPage = () => {
  const router = useRouter();

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: implement infinite scrolling

  const searchAnime = async (query: string) => {
    if (!query) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL + urls.advancedSearch}`,
        {
          params: {
            query,
            sort: ["POPULARITY_DESC"],
          },
        }
      );
      setResults(res.data.results);
    } catch {
      setError("Error getting anime data");
    } finally {
      if (router.query.query) {
        router.replace("/search", undefined, { shallow: true });
      }
      setLoading(false);
    }
  };

  const debouncedSearch = Debounce(searchAnime, 500);

  useEffect(() => {
    searchAnime(router.query.query as string);
  }, []);

  return (
    <div className="flex relative flex-col px-10 md:px-32 pt-20 min-h-screen bg-[url('/abstract-1.jpg')] bg-fixed bg-contain w-full">
      <div className="fixed h-screen w-screen backdrop-blur-sm bg-black/10 top-0 left-0"></div>
      <section className="my-10 flex flex-col z-0">
        <h1 className="font-bold text-4xl py-10">Search Anime</h1>
        <input
          defaultValue={router.query.query}
          className="bg-black w-full text-lg p-5 px-10 rounded border-white/50 border-2 font-bold text-slate-300 outline-slate-600"
          type="text"
          placeholder="Search"
          onChange={(e) => debouncedSearch(e.target.value)}
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
          <div className="flex flex-col mb-10 gap-3 w-full">
            {results.map((anime: any) => {
              const color = (anime.color || "#ffffff") as string;
              const textColor = pickTextColorBasedOnBgColorAdvanced(
                color,
                "#ffffff",
                "#000000"
              );
              const base = anime.type === "NOVEL" ? "novel" : "anime";
              return (
                <div
                  key={anime.id}
                  className="backdrop-blur p-5 rounded overflow-hidden flex gap-4"
                >
                  <img
                    className="h-full w-full object-cover absolute top-0 left-0"
                    src={anime.cover ?? anime.image}
                    alt="cover"
                  />
                  <div className="absolute top-0 left-0 backdrop-blur bg-black/60 w-full h-full"></div>
                  <AnimeTile anime={anime} />
                  <div className="flex-grow z-10 flex flex-col">
                    <div className="flex-grow"></div>
                    <h2 className="text-xl font-semibold flex items-center gap-6">
                      {anime.title.romaji}{" "}
                      <span className="text-sm border rounded p-1">
                        {anime.status}
                      </span>
                    </h2>
                    <p className="flex items-center gap-2 text-sm">
                      {anime.releaseDate ?? "N/A"}
                      <span className="text-2xl">&#183;</span>
                      {anime.type}
                      <span className="text-2xl">&#183;</span>
                      {`Score: ${anime.rating ?? "N/A"}`}
                      <span className="text-2xl">&#183;</span>
                      {`Episodes: ${anime.totalEpisodes ?? "N/A"}`}
                    </p>
                    {anime.description && (
                      <p
                        className="w-full mb-6"
                        dangerouslySetInnerHTML={{
                          __html:
                            anime.description.substring(
                              0,
                              anime.description.length < 200
                                ? anime.description.length
                                : 200
                            ) + "...",
                        }}
                      ></p>
                    )}
                    <Link href={`/${base}/${anime.id}`} passHref>
                      <Button
                        className="shadow shadow-black"
                        type="custom"
                        color={color}
                        textColor={textColor}
                        onClick={() => {}}
                      >
                        Is this the one?
                      </Button>
                    </Link>
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
