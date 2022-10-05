import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import React from 'react'
import { urls } from 'service/urls';
import axios from 'axios';
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const Player: NextPage = ({
  streamData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let stream = streamData.sources.find((st: any) => st.quality === 'default')

  if (!stream) {
    stream = streamData.sources[0];
  }

  return (
    <div className="h-screen w-screen">
      <ReactPlayer
        url={stream.url}
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
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await axios.get(
    process.env.BASE_URL + urls.watch + context.params?.watchId || ""
  );

  console.log(res);
  return {
    props: {
      streamData: res.data,
    },
  };
};

export default Player