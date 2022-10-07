import AnimeTile from "@molecules/AnimeTile";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { urls } from "service/urls";

const TopAiringPage = ({
  results,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <section className="md:p-20 pt-20 p-5">
      <h1 className="text-2xl font-bold pt-5">Top Airing</h1>
      <div className="flex my-10 flex-wrap gap-2">
        {results.map((anime: any) => (
          <AnimeTile key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default TopAiringPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const date = new Date();
  const res = await axios.get(process.env.BASE_URL + urls.advancedSearch, {
    params: {
      year: date.getFullYear(),
      status: "RELEASING",
      sort: ["POPULARITY_DESC"],
      perPage: 50,
    },
  });
  return {
    props: {
      results: res.data.results,
    },
    revalidate: 600,
  };
};
