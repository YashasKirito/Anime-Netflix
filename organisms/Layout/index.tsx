import Header from "organisms/Header";
import Head from "next/head";

interface ILayout {
  children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="font-sans">
      <Head>
        <title>Aniflix</title>
        <meta name="description" content="Netflix for Anime: Add Free" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="-mt-20">{children}</div>
    </div>
  );
};

export default Layout;
