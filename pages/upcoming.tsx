import AnimeTile from "@molecules/AnimeTile";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import axios from "axios";
import { urls } from "service/urls";

const UpcomingPage = ({
  results,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <section className="md:p-20 pt-20 p-5">
      <h1 className="text-2xl font-bold pt-5">Top Upcoming Anime</h1>
      <div className="flex my-10 flex-wrap gap-2">
        {results.map((anime: any) => (
          <AnimeTile key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default UpcomingPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await axios.get(process.env.BASE_URL + urls.advancedSearch, {
    params: {
      status: "NOT_YET_RELEASED",
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
