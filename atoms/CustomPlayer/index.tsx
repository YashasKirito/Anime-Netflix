import dynamic from "next/dynamic";
import { FaPlay, FaPause } from "react-icons/fa";
import { VscUnmute, VscMute } from "react-icons/vsc";
import { GrForwardTen, GrBackTen } from "react-icons/gr";
import { BiFullscreen } from "react-icons/bi";
import { SiSpeedtest } from "react-icons/si";
import { TbPlayerSkipForward } from "react-icons/tb";
import { BsCollectionPlay } from "react-icons/bs";
import { MdSubtitles } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im";
import {  useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import cn from "classnames";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
  ssr: false,
});

interface ICustomPlayer {
  url: string;
  episodeTitle: string;
}

const CustomPlayer: React.FC<ICustomPlayer> = ({ url, episodeTitle }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playerControlsDisabled, setPlayerControlsDisabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [durationStr, setDurationStr] = useState("");
  const [timelineSeekPreview, setTimelineSeekPreview] = useState(0);
  const [goBack10, setGoBack10] = useState(false);
  const [goForward10, setGoForward10] = useState(false);
  const [playToggleAnimate, setPlayToggleAnimate] = useState(false);
  const [pauseToggleAnimate, setPauseToggleAnimate] = useState(false);
  const videoContainer = useRef<any>();
  const videoRef = useRef<any>();
  const volumeRef = useRef<any>();
  const timelineRef = useRef<any>();
  const mouseHideRef = useRef<any>();

  const playPause = () => {
    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (!muted) {
      volumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(volumeRef.current);
    }
    setMuted((prev) => !prev);
  };

  const changeVolume = (value: number) => {
    if (muted) {
      setMuted((prev) => !prev);
    }
    if (value === 0) {
      setMuted(true);
    }
    setVolume(value);
  };

  const seek10Forward = () => {
    if (!videoRef.current) return;

    const duration = videoRef.current.getDuration();

    const currentPlayTime = videoRef.current.getCurrentTime();
    videoRef.current.seekTo(
      currentPlayTime + 10 > duration ? duration : currentPlayTime + 10,
      "seconds"
    );
    setGoForward10(true);
    setTimeout(() => {
      setGoForward10(false);
    }, 1);
  };

  const seek10Backward = () => {
    if (!videoRef.current) return;

    const currentPlayTime = videoRef.current.getCurrentTime();
    videoRef.current.seekTo(
      currentPlayTime - 10 < 0 ? 0 : currentPlayTime - 10,
      "seconds"
    );
    setGoBack10(true);
    setTimeout(() => {
      setGoBack10(false);
    }, 1);
  };

  const onVideoReady = () => {
    setPlayerControlsDisabled(false);
  };

  const onVideoPlay = () => {
    if (!playing) {
      setPlaying(true);
    }
    setPlayToggleAnimate(true);
    setTimeout(() => {
      setPlayToggleAnimate(false);
    }, 1);
  };

  const onVideoPause = () => {
    if (playing) {
      setPlaying(false);
    }
    setPauseToggleAnimate(true);
    setTimeout(() => {
      setPauseToggleAnimate(false);
    }, 1);
  };

  const onVideoBuffer = () => {
    console.log("onVideoBuffer");
    setIsBuffering(true);
  };

  const onVideoProgress = (event: OnProgressProps) => {
    setProgress(event.played);
    setBuffer(event.loaded);
    const duration = videoRef.current.getDuration();
    updateDuration(duration - event.playedSeconds);
  };

  const updateDuration = (duration: number) => {
    const seconds = Math.floor(duration % 60);
    const mins = Math.floor(duration / 60) % 60;
    const hrs = Math.floor(duration / 3600);
    let str = "";
    if (hrs === 0) {
      str = `${mins}:${seconds.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      })}`;
    } else {
      str = `${hrs}:${mins}:${seconds.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      })}`;
    }
    setDurationStr(str);
  };

  const onVideoDuration = (duration: any) => {
    updateDuration(duration);
    console.log("Video duration: ", duration);
  };

  const onVideoBufferEnd = () => {
    console.log("Video buffer end: ");
    setIsBuffering(false);
  };

  const onVideoError = (error: any) => {
    setPlaying(false);
    console.log(`Video Error: ${JSON.stringify(error)}`);
  };

  const handleTimelineUpdate = (event: any) => {
    const rect = timelineRef.current.getBoundingClientRect();
    const percentage =
      Math.min(Math.max(event.screenX - rect.x), rect.width) / rect.width;
    setTimelineSeekPreview(percentage);
  };

  const handleTimelinePreviewReset = () => {
    setTimelineSeekPreview(0);
  };

  const handleTimelineSeek = () => {
    const duration = videoRef.current.getDuration();
    const seekTo = duration * timelineSeekPreview;
    videoRef.current.seekTo(seekTo, "seconds");
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement === null) {
      videoContainer.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleHideMouse = (event: any) => {
    videoContainer.current.style.cursor = "default";

    if (mouseHideRef.current) {
      clearTimeout(mouseHideRef.current);
    }
    if (playing) {
      mouseHideRef.current = setTimeout(() => {
        if (videoContainer.current) {
          videoContainer.current.style.cursor = "none";
        }
      }, 2000);
    }
  };

  return (
    <div
      ref={videoContainer}
      onMouseMove={handleHideMouse}
      className="h-full w-full relative"
    >
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
        onDuration={onVideoDuration}
        onProgress={onVideoProgress}
        onBufferEnd={onVideoBufferEnd}
      />
      <div className="absolute top-0 left-0 text-8xl gap-80 w-full h-full flex items-center justify-center">
        <GrBackTen
          className={cn("skip opacity-0 duration-700 scale-125 transition", {
            "opacity-100 scale-90 duration-[0ms]": goBack10,
          })}
        />

        <FaPause
          className={cn(
            "opacity-0 absolute duration-700 scale-125 transition",
            {
              "opacity-100 scale-90 duration-[0ms]": pauseToggleAnimate,
              // hidden: !playing,
            }
          )}
        />
        <FaPlay
          className={cn(
            "opacity-0 absolute duration-700 scale-125 transition",
            {
              "opacity-100 scale-90 duration-[0ms]": playToggleAnimate,
              // hidden: playing,
            }
          )}
        />
        <ImSpinner2
          className={cn(
            "opacity-0 absolute animate-spin",
            {
              "opacity-100": isBuffering,
            }
          )}
        />
        <GrForwardTen
          className={cn("skip opacity-0 duration-700 scale-125 transition", {
            "opacity-100 scale-90 duration-[0ms]": goForward10,
          })}
        />
      </div>
      <div
        className={cn(
          "controls-container | bg-gradient-to-t h-1/4 from-black text-3xl px-6 z-50 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 absolute bottom-0 left-0 w-full flex flex-col",
          { "opacity-100": !playing }
        )}
      >
        <div className="flex-grow"></div>
        <div className="flex items-center">
          <div
            onMouseMove={handleTimelineUpdate}
            onMouseLeave={handleTimelinePreviewReset}
            ref={timelineRef}
            onClick={handleTimelineSeek}
            className="timeline | w-full h-1 bg-stone-500 relative hover:h-2 cursor-pointer transition-all"
          >
            <div
              style={{ width: `${buffer * 100}%` }}
              className="buffer h-full absolute transition-all bg-white/60"
            ></div>
            <div
              style={{ width: `${progress * 100}%` }}
              className="bg-red-500 absolute transition-all h-full flex flex-row-reverse items-center"
            >
              <div className="h-3 w-3 bg-red-500 z-10 rounded-full absolute translate-x-1/2 hover:scale-125 transition-transform"></div>
            </div>
            <div
              style={{
                left: `${timelineSeekPreview * 100}%`,
                opacity: timelineSeekPreview ? 1 : 0,
              }}
              className="seek-preview | absolute transition-all left-0 h-full w-1 bg-red-100"
            ></div>
          </div>
          <span className="text-sm px-5">{durationStr}</span>
        </div>
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
          <div className="dropdown dropdown-top dropdown-hover">
            <div tabIndex={0} className="flex items-center">
              <button
                disabled={playerControlsDisabled}
                className="hover:scale-125 transition-transform"
                onClick={toggleMute}
              >
                {muted ? <VscMute /> : <VscUnmute />}
              </button>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content -translate-x-4 relative p-8 shadow bg-stone-800 rounded-box h-52 "
            >
              <input
                type="range"
                name="volume"
                id="volume"
                role={"volume"}
                className="range range-sm range-accent absolute -rotate-90 origin-left bottom-1 w-44"
                value={volume * 100}
                onChange={(e) => changeVolume(parseInt(e.target.value) * 0.01)}
              />
            </div>
          </div>

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
