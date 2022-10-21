import { LegacyRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";

function VideoPlayer(
  props: ReactPlayerProps & {
    playerRef: LegacyRef<ReactPlayer>;
  }
) {
  return <ReactPlayer ref={props.playerRef} {...props} />;
}

export default VideoPlayer;
