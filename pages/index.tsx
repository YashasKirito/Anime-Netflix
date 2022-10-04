/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GoUnmute, GoMute } from "react-icons/go";
import cn from "classnames";
import { OnProgressProps } from "react-player/base";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const HomePage: NextPage = () => {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaying(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const HandleTransition = (state: OnProgressProps) => {
    const { playedSeconds } = state;
    console.log(playedSeconds);
    if (playedSeconds > 30) {
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-[80vh] relative w-full flex">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=JtqIas3bYhg"
          className="react-player"
          playing={playing}
          muted={muted}
          width="100%"
          height="100%"
          volume={0.1}
          onEnded={() => console.log("Video Ended")}
          onProgress={HandleTransition}
        />
        <div className="absolute w-full h-full">
          <img
            className={cn(
              "h-full w-full transition-opacity ease-in duration-500 object-cover",
              { "opacity-0": playing }
            )}
            src={"/covers/edgeRunner_cover-v2.jpeg"}
            alt="cover"
          />
          <div className="main | absolute pl-20 bottom-0 h-full w-full bg-gradient-to-tr from-black flex flex-col-reverse">
            <div className="">
              <img
                className={cn(
                  "h-20 w-fit scale-150 duration-1000 -translate-y-10 origin-bottom-left transition-transform",
                  { "scale-100 translate-y-0": playing }
                )}
                src="/logos/Cyberpunk_Edgerunners_logo.png"
                alt="Title"
              />
              <div className="flex gap-4 mt-10">
                <Button type="primary" onClick={() => console.log("Click")}>
                  <FaPlay className="w-5 h-5" /> Play
                </Button>

                <Button type="secondary" onClick={() => console.log("Click")}>
                  <BsPlusLg className="w-5 h-5" /> My Lists
                </Button>
              </div>
              <p className={cn("py-8 w-1/2 text-sm text-slate-300 transition-opacity", {'opacity-0': playing})}>
                CYBERPUNK: EDGERUNNERS tells a standalone, 10-episode story
                about a street kid trying to survive in a technology and body
                modification-obsessed city of the future. Having everything to
                lose, he chooses to stay alive by becoming an edgerunner—a
                mercenary outlaw also known as a cyberpunk.
              </p>
            </div>
          </div>
          <div className="controls absolute bottom-4 right-4">
            <button onClick={() => setMuted((prev) => !prev)}>
              {muted ? (
                <GoMute className="w-10 h-10" color="#fff" />
              ) : (
                <GoUnmute className="w-10 h-10" color="#fff" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
