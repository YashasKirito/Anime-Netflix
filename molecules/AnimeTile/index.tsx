import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
const AnimeTile = ({ anime }: { anime: any }) => {
  const base = anime.type === "NOVEL" ? "novel" : "anime";
  return (
    <Link prefetch={false} href={`/${base}/${anime.id}`} passHref>
      <div className="group flex-shrink-0 cursor-pointer rounded w-44 relative h-60 overflow-hidden bg-slate-50">
        <img className="object-cover w-44 h-60" src={anime.image} alt="cover" />
        <div className="absolute flex flex-col-reverse p-3 top-0 left-0 transition-opacity duration-500 h-full w-full bg-black/70 opacity-0 group-hover:opacity-100">
          <span className="text-sm font-bold text-slate-50 translate-y-5 transition-transform duration-200 group-hover:translate-y-0">
            {anime.title.romaji}
          </span>
          <div className="flex-grow"></div>
          <div className="span text-xs font-bold border rounded w-fit p-1">
            {anime.type}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeTile;
