import dynamic from "next/dynamic";
import { FaPlay, FaPause } from "react-icons/fa";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { BiFullscreen } from "react-icons/bi";
import { SiSpeedtest } from "react-icons/si";
import { TbPlayerSkipForward } from "react-icons/tb";
import { BsCollectionPlay } from "react-icons/bs";
import { MdSubtitles } from "react-icons/md";
import { useRef, useState } from "react";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
  ssr: false,
});

interface ICustomPlayer {
  url: string;
  episodeTitle: string;
}

const CustomPlayer: React.FC<ICustomPlayer> = ({ url, episodeTitle }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playerControlsDisabled, setPlayerControlsDisabled] = useState(true);
  const videoContainer = useRef<any>();
  const videoRef = useRef<any>();

  const playPause = () => {
    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const changeVolume = (value: number) => {
    setVolume(value);
  };

  const seek10Forward = () => {
    if (!videoRef.current) return;

    const currentPlayTime = videoRef.current.getCurrentTime();
    console.log(currentPlayTime);
    videoRef.current.seekTo(currentPlayTime + 10, "seconds");
  };

  const seek10Backward = () => {
    if (!videoRef.current) return;

    const currentPlayTime = videoRef.current.getCurrentTime();
    console.log(currentPlayTime);
    videoRef.current.seekTo(currentPlayTime - 10, "seconds");
  };

  const onVideoReady = () => {
    setPlayerControlsDisabled(false);
  };

  const onVideoPlay = () => {
    if (!playing) {
      setPlaying(true);
    }
    console.log(videoRef);
  };

  const onVideoPause = () => {
    if (playing) {
      setPlaying(false);
    }
  };

  const onVideoBuffer = () => {};

  const onVideoError = (error: any) => {
    setPlaying(false);
    console.log(`Video Error: ${JSON.stringify(error)}`);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement === null) {
      videoContainer.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={videoContainer} className="h-full w-full">
      <VideoPlayer
        playerRef={videoRef}
        url={url}
        className="react-player relative"
        width="100%"
        height="100%"
        muted={muted}
        playing={playing}
        // playbackRate={2}
        volume={volume}
        onBuffer={onVideoBuffer}
        onEnded={() => console.log("Video Ended")}
        onReady={onVideoReady}
        onError={onVideoError}
        onPlay={onVideoPlay}
        onPause={onVideoPause}
      />
      <div className="controls-container | bg-gradient-to-t h-1/4 from-black text-3xl px-6 z-50 transition-opacity opacity-100 hover:opacity-100 focus:opacity-100 focus-within:opacity-100 absolute bottom-0 left-0 w-full flex flex-col">
        <div className="flex-grow"></div>
        <div className="timeline | "></div>
        <div className="controls | flex gap-6 py-8">
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
            onClick={playPause}
          >
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
            onClick={seek10Backward}
          >
            <GrBackTen className="skip" />
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
            onClick={seek10Forward}
          >
            <GrForwardTen className="skip" />
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
            onClick={toggleMute}
          >
            {muted ? <VscMute /> : <VscUnmute />}
          </button>
          <input
            type="range"
            name="volume"
            id="volume"
            role={"volume"}
            value={volume * 100}
            onChange={(e) => changeVolume(parseInt(e.target.value) * 0.01)}
          />
          <div className="flex-1 text-center text-sm select-none truncate px-10">
            {episodeTitle}
          </div>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
          >
            <TbPlayerSkipForward />
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
          >
            <BsCollectionPlay />
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
          >
            <MdSubtitles />
          </button>
          <button
            disabled={playerControlsDisabled}
            className="hover:scale-125 transition-transform"
          >
            <SiSpeedtest />
          </button>
          <button
            disabled={playerControlsDisabled}
            onClick={toggleFullscreen}
            className="hover:scale-125 transition-transform"
          >
            <BiFullscreen />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
