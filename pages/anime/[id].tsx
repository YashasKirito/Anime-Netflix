/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import axios from "axios";
import { urls } from "service/urls";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import DOMPurify from "isomorphic-dompurify";

const AnimePage: NextPage = ({
  animeData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <img
          className="w-full h-[50vh] object-cover bg-gradient-to-t from-black"
          src={animeData.cover}
          alt="cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black"></div>
      </div>

      <section className="px-20 -translate-y-32">
        <div className="flex gap-8">
          <img
            className="w-44 h-60 rounded shadow-lg shadow-slate-800"
            src={animeData.image}
            alt=""
          />
          <div className="details flex flex-col justify-end gap-3">
            <p className="font-bold text-4xl">{animeData.title.romaji}</p>
            <div className="actions | flex gap-2">
              <Button type="primary" onClick={() => console.log("Click")}>
                <FaPlay className="w-5 h-5" /> Play
              </Button>

              <Button type="secondary" onClick={() => console.log("Click")}>
                <BsPlusLg className="w-5 h-5" /> My List
              </Button>
            </div>
          </div>
        </div>

        <section className="flex my-10">
          <div className="w-2/3 flex flex-col gap-2">
            <div className="info flex items-center gap-4">
              <p>{animeData.releaseDate} </p>
              <span className="border border-white rounded-sm text-xs p-[2px]">
                {animeData.type}
              </span>
              <p>
                Score: <span className="font-bold">{animeData.rating}</span>
              </p>
              <p>
                <span className="font-bold">{animeData.totalEpisodes}</span>{" "}
                Episodes
              </p>
              <div className="border rounded text-xs p-1 px-2">
                {animeData.status}
              </div>
            </div>
            <div
              // className="whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(animeData.description),
              }}
            ></div>
          </div>
          <div className="w-1/3 flex flex-col">
            <div className="flex flex-col gap-4 px-20 py-5">
              <p className="text-gray-500 text-sm">
                Genres:
                <span className="font-normal ml-2 text-gray-300">
                  {animeData.genres.join(", ")}
                </span>
              </p>

              <p className="text-gray-500 text-sm">
                Studios:
                <span className="font-normal ml-2 text-gray-300">
                  {animeData.studios.join(", ")}
                </span>
              </p>
            </div>
          </div>
        </section>

        {JSON.stringify(animeData)}
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(
    process.env.BASE_URL + urls.getAnime + context.params?.id || ""
  );
  return {
    props: {
      animeData: res.data,
    },
  };
};

export default AnimePage;
