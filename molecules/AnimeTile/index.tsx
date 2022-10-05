import { useRouter } from "next/router";

/* eslint-disable @next/next/no-img-element */
const AnimeTile = ({ anime }: { anime: any }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/anime/${anime.id}`)}
      className="group cursor-pointer rounded w-44 relative h-60 overflow-hidden bg-slate-50"
    >
      <img className="object-cover" src={anime.image} alt="cover" />
      <div className="absolute flex flex-col-reverse p-3 top-0 left-0 transition-opacity duration-500 h-full w-full bg-black/70 opacity-0 group-hover:opacity-100">
        <span className="text-sm font-bold text-slate-50 translate-y-5 transition-transform duration-200 group-hover:translate-y-0">
          {anime.title.romaji}
        </span>
      </div>
    </div>
  );
};

export default AnimeTile;
