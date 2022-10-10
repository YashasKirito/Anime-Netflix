import AnimeTile from "@molecules/AnimeTile";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { urls } from "service/urls";

const TopAnimePage = ({
  results,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <section className="md:p-20 pt-20">
      <h1 className="text-2xl font-bold pt-5">Top Anime</h1>
      <div className="flex my-10 flex-wrap gap-2">
        {results.map((anime: any) => (
          <AnimeTile key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default TopAnimePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await axios.get(process.env.BASE_URL + urls.top, {
    params: { perPage: 50, sort: ["POPULARITY_DESC"] },
  });
  return {
    props: {
      results: res.data.results,
    },
    revalidate: 120,
  };
};
