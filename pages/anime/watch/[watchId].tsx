import {
  InferGetStaticPropsType,
  NextPage,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import React, { useState } from "react";
import { urls } from "service/urls";
import axios from "axios";
import dynamic from "next/dynamic";
import Spinner from "@atoms/Spinner";
import { useRouter } from "next/router";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Player: NextPage = ({
  streamData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="font-bold text-4xl">
          Sorry couldn&apos;t get the episode, please try again later!
        </h1>
      </div>
    );
  }

  if (router.isFallback) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return streamData ? (
    <div className="h-screen w-screen">
      <ReactPlayer
        url={
          (
            streamData.sources.find((st: any) => st.quality === "default") ||
            streamData.sources[0]
          ).url
        }
        className="react-player"
        playing
        width="100%"
        height="100%"
        volume={0.8}
        onEnded={() => console.log("Video Ended")}
        controls
        // onProgress={HandleTransition}
      />
    </div>
  ) : null;
};

export default Player;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await axios.get(
    process.env.BASE_URL + urls.watch + context.params?.watchId || ""
  );
  return {
    props: {
      streamData: res.data,
    },
    revalidate: 600,
  };
};
