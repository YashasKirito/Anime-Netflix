import Header from "organisms/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import cn from "classnames";
import { useEffect } from "react";
import { useMutedStore } from "store/useMuted";

interface ILayout {
  children: React.ReactNode;
}

const v2HeaderPages = ['/beta']

const Layout: React.FC<ILayout> = ({ children }) => {
  const router = useRouter();
  const setMuted = useMutedStore((state) => state.setMuted);

  const isWatchRoute = router.asPath.includes("watch");
  const useHeaderV2 = router.asPath.includes("beta");

  const setUserInteraction = () => {
    const interaction = localStorage.getItem("userInteraction");
    if (!interaction) {
      localStorage.setItem("userInteraction", "true");
      setMuted(false);
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("userInteraction");
    };
  }, []);

  return (
    <div
      data-theme="black"
      // onClick={setUserInteraction}
      className="font-Montserrat"
    >
      <Head>
        <title>AniClub</title>
        <meta name="description" content="Netflix for Anime: Ad Free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!useHeaderV2 && <Header isWatchRoute={isWatchRoute} />}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
