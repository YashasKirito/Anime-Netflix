import { Player as VimePlayer, Hls, DefaultUi, Ui } from "@vime/react";
import { useRef } from "react";

const Player = (props: any) => {
  const playerRef = useRef<HTMLVmPlayerElement>(null);

  const onReady = (e: CustomEvent) => {
    console.log(`onReady: ${e.type}`);
    console.log(playerRef, e);
    try {
      // playerRef.current?.play();
    } catch {
      console.log("Error");
    }
  };

  const onError = (e: CustomEvent) => {
    console.log(e);
  };

  return (
    <VimePlayer
      controls
      onVmError={onError}
      ref={playerRef}
      theme="dark"
      onVmReady={onReady}
      {...props}
    >
      <Hls
        version="latest"
        config={{
          crossOrigin: "anonymous",
          enableWorker: false,
        }}
        crossOrigin="anonymous"
        // poster="https://media.vimejs.com/poster.png"
      >
        <source
          data-src="https://cache.387e6278d8e06083d813358762e0ac63.com/222888877960.m3u8"
          type="application/x-mpegURL"
        />
      </Hls>
      {/* <DefaultUi /> */}
      <Ui />
    </VimePlayer>
  );
};

export default Player;
