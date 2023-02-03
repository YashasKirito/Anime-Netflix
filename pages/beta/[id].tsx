/* eslint-disable @next/next/no-img-element */
import {
  InferGetStaticPropsType,
  NextPage,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import axios from "axios";
import { CORS_BYPASS, FlixHQEndpoints, urls } from "service/urls";
import { useRouter } from "next/router";
import Spinner from "@atoms/Spinner";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";

const AnimePage: NextPage = ({
  data,
  mediaId
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const playMovie = (episodeId: string) => {
    router.push(
      `/beta/watch/${encodeURIComponent(mediaId)}?episodeId=${episodeId}`,
      undefined
    );
  };

  return (
    <div className="flex flex-col">
      <div className="relative">
        <img
          className="w-full h-[50vh] object-cover bg-gradient-to-t from-black"
          src={CORS_BYPASS + data.cover}
          alt="cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black"></div>
      </div>
      <section className="px-5 md:px-20 -translate-y-32">
        <div className="flex gap-8">
          <img
            className="w-44 rounded shadow-lg shadow-stone-800"
            src={CORS_BYPASS + data.image}
            alt={data.title}
          />
          <div className="details flex flex-col justify-end gap-3">
            <p className="font-bold text-4xl text-white">{data.title}</p>
            <div className="actions | flex gap-2">
              {router.asPath.includes("movie") && (
                <Button
                  type="primary"
                  onClick={() => {
                    playMovie(data.episodes[0].id);
                  }}
                >
                  <FaPlay className="w-5 h-5" /> Play
                </Button>
              )}
            </div>
          </div>
        </div>
        <div
          className="mt-10"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data.description),
          }}
        ></div>
      </section>
      {router.asPath.includes("tv") && (
        <section className="px-5 md:px-20">
          <h2 className="font-semibold text-white text-xl mb-10">Episodes</h2>
          <div className="flex flex-col gap-2">
            {data.episodes &&
              data.episodes.map((episode: any) => {
                return (
                  <div
                    key={episode.id}
                    className="flex flex-col gap-2 p-5 bg-slate-800 cursor-pointer"
                    onClick={() => playMovie(episode.id)}
                  >
                    <h3 className="text-lg">{episode.title}</h3>
                    <p>
                      Season: {episode.season} | Episode: {episode.number}
                    </p>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
};

export default AnimePage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: "tv/watch-the-last-of-us-92254" },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const res = await axios.get(process.env.BASE_URL + FlixHQEndpoints.info, {
      params: { id: context.params?.id },
    });

    return {
      props: {
        data: res.data,
        mediaId: decodeURIComponent(context.params!.id as string)
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
};
