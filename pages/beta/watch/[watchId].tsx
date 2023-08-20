import { NextPage } from "next";
import { CORS_BYPASS, FlixHQEndpoints, urls } from "service/urls";
import axios from "axios";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const NetPlayer = dynamic(() => import("netplayer"), {
  ssr: false,
});

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

const constructStreamUrl = (url: string, headers: object) => {
  return (
    process.env.NEXT_PUBLIC_M3U8_PROXY +
    "?url=" +
    url +
    "&headers=" +
    JSON.stringify(headers)
  );
};

const Player: NextPage = () => {
  const router = useRouter();
  const {
    isLoading,
    error,
    data: streamData,
  } = useQuery(
    ["episode", router.query?.watchId, router.query?.episodeId],
    async () => {
      const res = await axios.get(
        "https://api.consumet.org/meta/tmdb/watch/" +
          router.query?.episodeId +
          "?id=" +
          router.query?.watchId
      );
      return res.data;
    },
    {
      staleTime: Infinity,
    }
  );

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="font-bold text-4xl">
          Sorry couldn&apos;t get the episode, please try again later!
        </h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          role="status"
          className="flex cursor-progress justify-center items-center h-56 aspect-video rounded-lg animate-pulse bg-gray-700"
        >
          <svg
            className="w-12 h-12 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 384 512"
          >
            <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const sources = streamData.sources.map((s: any) => {
    return {
      file: s.url,
      label: s.quality,
    };
  });

  const subs = (streamData.subtitles as [])
    .filter((s: any) => !s.url.includes("thumbnails"))
    .map((s: any) => {
      return {
        lang: s.lang,
        language: s.lang,
        file: s.url,
      };
    });

  const thumbnails = streamData.subtitles.find((s: any) =>
    s.url.includes("thumbnails")
  );

  return (
    <div className="h-screen w-screen">
      <NetPlayer
        sources={sources}
        subtitles={subs}
        thumbnail={thumbnails?.url}
      />
    </div>
  );
};

export default Player;
