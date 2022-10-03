import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
const Player = dynamic(() => import("@atoms/Player"), {
  ssr: false,
});

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-full">
        <Image
          alt="Cover"
          height={2000}
          width={8000}
          layout="intrinsic"
          src={
            "https://s4.anilist.co/file/anilistcdn/media/anime/banner/132405-LnPQaqaksEpN.jpg"
          }
        />
      </div>
      <div className="h-[80vh] w-full flex">
        <Player />
      </div>
    </div>
  );
};

export default HomePage;
