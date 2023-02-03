import axios from "axios";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { GetStaticProps } from "next";
import { CORS_BYPASS, FlixHQEndpoints } from "service/urls";
import { useQuery } from "@tanstack/react-query";
import { Router, useRouter } from "next/router";
import { useState } from "react";

interface ITrendingData {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate: string;
  duration: string;
  type: string;
}

const MediaHome = ({
  trending,
  recentMovies,
  recentShows,
}: {
  trending: ITrendingData[];
  recentMovies: ITrendingData[];
  recentShows: ITrendingData[];
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { isLoading, error, data } = useQuery(["search", search], async () => {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + FlixHQEndpoints.base + search
    );
    return (res.data?.results || []) as ITrendingData[];
  });

  const goToMediaPage = (id: string) => {
    const safeId = encodeURIComponent(id);
    router.push("/beta/" + safeId);
  };

  return (
    <main className="p-[5vmax] flex flex-col gap-10">
      <input
        className="p-4 outline-none"
        type="text"
        placeholder="Search for anything"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <section>
        {isLoading ? <div className="text-center">Loading</div> : null}
        {error ? (
          <div className="text-center">Error: {JSON.stringify(error)}</div>
        ) : null}
        {data ? (
          <div className="flex flex-wrap gap-4">
            {data.map((d) => (
              <div
                key={d.id}
                className="w-48 rounded-md cursor-pointer flex flex-col"
                onClick={() => goToMediaPage(d.id)}
              >
                <img
                  className="h-72 object-cover w-full rounded-md"
                  src={CORS_BYPASS + d.image}
                  alt={d.title + "'s poster"}
                />
                <span className="font-semibold mt-3">{d.title}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>
      <section className="Trending | flex flex-col gap-2">
        <div className="overflow-scroll">
          <ScrollMenu
            Header={<h2 className="font-semibold text-2xl mb-6">Trending</h2>}
          >
            {trending.map((tren) => {
              return (
                <div
                  key={tren.id}
                  className="w-48 rounded-md cursor-pointer"
                  onClick={() => goToMediaPage(tren.id)}
                >
                  <img
                    className="h-72 object-cover w-full rounded-md"
                    src={CORS_BYPASS + tren.image}
                    alt={tren.title + "'s poster"}
                  />
                  {/* <span className="font-semibold mt-3">{tren.title}</span> */}
                </div>
              );
            })}
          </ScrollMenu>
        </div>
      </section>
      <section className="Trending | flex flex-col gap-2">
        <div className="overflow-scroll">
          <ScrollMenu
            Header={
              <h2 className="font-semibold text-2xl mb-6">Recent Movies</h2>
            }
          >
            {recentMovies.map((rm) => {
              return (
                <div
                  key={rm.id}
                  className="w-48 rounded-md cursor-pointer"
                  onClick={() => goToMediaPage(rm.id)}
                >
                  <img
                    className="h-72 object-cover w-full rounded-md"
                    src={CORS_BYPASS + rm.image}
                    alt={rm.title + "'s poster"}
                  />
                  {/* <span className="font-semibold mt-3">{rm.title}</span> */}
                </div>
              );
            })}
          </ScrollMenu>
        </div>
      </section>
      <section className="Trending | flex flex-col gap-2">
        <div className="overflow-scroll">
          <ScrollMenu
            Header={
              <h2 className="font-semibold text-2xl mb-6">Recent Series</h2>
            }
          >
            {recentShows.map((rs) => {
              return (
                <div
                  key={rs.id}
                  className="w-48 rounded-md cursor-pointer "
                  onClick={() => goToMediaPage(rs.id)}
                >
                  <img
                    className="h-72 object-cover w-full rounded-md"
                    src={CORS_BYPASS + rs.image}
                    alt={rs.title + "'s poster"}
                  />
                  {/* <span className="font-semibold mt-3">{rs.title}</span> */}
                </div>
              );
            })}
          </ScrollMenu>
        </div>
      </section>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const trending = await axios.get(
    `${process.env.BASE_URL + FlixHQEndpoints.trending}`,
    { params: { type: "movies" } }
  );
  const recentMovies = await axios.get(
    `${process.env.BASE_URL + FlixHQEndpoints.recentMovies}`
  );
  const recentShows = await axios.get(
    `${process.env.BASE_URL + FlixHQEndpoints.recentShows}`
  );
  return {
    props: {
      trending: trending.data,
      recentMovies: recentMovies.data,
      recentShows: recentShows.data,
    },
    revalidate: 120,
  };
};

export default MediaHome;
