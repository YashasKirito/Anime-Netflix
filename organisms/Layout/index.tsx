import Header from "organisms/Header";
import Head from "next/head";
import { useRouter } from "next/router";
import cn from "classnames";
import { useEffect } from "react";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const router = useRouter();

  const isWatchRoute = router.asPath.includes("watch");

  const setUserInteraction = () => {
    const interaction = localStorage.getItem("userInteraction");
    if (!interaction) {
      localStorage.setItem("userInteraction", "true");
    }
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("userInteraction");
    };
  }, []);

  return (
    <div onClick={setUserInteraction} className="font-sans">
      <Head>
        <title>Aniflix</title>
        <meta name="description" content="Netflix for Anime: Add Free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header isWatchRoute={isWatchRoute} />
      <div className={cn({ "-mt-20": !isWatchRoute })}>{children}</div>
    </div>
  );
};

export default Layout;
