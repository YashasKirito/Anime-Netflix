import Button from "@atoms/Button";
import AnimeTile from "@molecules/AnimeTile";
import classNames from "classnames";
import { FaPlay } from "react-icons/fa";
import { pickTextColorBasedOnBgColorAdvanced } from "utils/getContrastColor";

const RecentAnimeTime = ({ anime }: any) => {
  const color = (anime.color || "#ffffff") as string;
  const textColor = pickTextColorBasedOnBgColorAdvanced(
    color,
    "#ffffff",
    "#000000"
  );
  return (
    <div className="rounded flex overflow-hidden">
      <AnimeTile anime={anime} />
      <div className="w-80 h-60 relative">
        <div
          style={{
            fontSize: "16px",
            backgroundImage: `linear-gradient(40deg, ${
              color + "4d"
            } 40%, rgba(255, 255, 255, 0) 100%)`,
          }}
          className={classNames("w-80 h-60 top-0 left-0 blur-2xl absolute")}
        />
        <span
          style={{ color: color }}
          className="absolute top-2 right-8 opacity-20 text-8xl font-bold"
        >
          <span className="text-4xl">EP:</span>
          {(anime.episodeNumber as number).toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}
        </span>

        <div className="absolute w-80 h-60 p-8 flex flex-col">
          <h3 className="whitespace-normal text-xl font-bold flex-grow">
            {anime.title.romaji}
          </h3>
          <p className="mb-4 flex flex-col gap-1">
            <span className="text-xs w-fit p-1 border rounded whitespace-nowrap">
              NEW EPISODE:{" "}
              {(anime.episodeNumber as number).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </span>
            <span className="text-sm font-bold">{anime.episodeTitle}</span>
          </p>
          <Button
            onClick={() => {}}
            type="custom"
            color={color}
            textColor={textColor}
          >
            <FaPlay className="w-5 h-5" /> Watch Now!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentAnimeTime;
