/* eslint-disable @next/next/no-img-element */
import AnimeTile from "@molecules/AnimeTile";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { urls } from "service/urls";
import Button from "@atoms/Button";
import { pickTextColorBasedOnBgColorAdvanced } from "utils/getContrastColor";
import Link from "next/link";

const TopAiringPage = ({
  results,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <section className="md:px-36 px-10 pt-20 p-5">
      <h1 className="text-4xl font-bold pt-5">
        Top Airing anime{" "}
        <span className="text-base">{" - Are you up-to-date?"}</span>
      </h1>
      <div className="flex flex-col my-10 gap-6">
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
                src={anime.cover}
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
                  {anime.releaseDate}
                  <span className="text-2xl">&#183;</span>
                  {anime.type}
                  <span className="text-2xl">&#183;</span>
                  {`Score: ${anime.rating ?? "N/A"}`}
                  <span className="text-2xl">&#183;</span>
                  {`Episodes: ${anime.totalEpisodes ?? "N/A"}`}
                </p>
                <p
                  className="w-full mb-6"
                  dangerouslySetInnerHTML={{
                    __html: anime.description.substring(0, 200) + "...",
                  }}
                ></p>
                <Link href={`/${base}/${anime.id}`} passHref>
                  <Button
                    className="shadow shadow-black"
                    type="custom"
                    color={color}
                    textColor={textColor}
                    onClick={() => {}}
                  >
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopAiringPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const date = new Date();
  const res = await axios.get(process.env.BASE_URL + urls.advancedSearch, {
    params: {
      year: date.getFullYear(),
      status: "RELEASING",
      sort: ["POPULARITY_DESC"],
      perPage: 50,
    },
  });
  return {
    props: {
      results: res.data.results,
    },
    revalidate: 20,
  };
};
