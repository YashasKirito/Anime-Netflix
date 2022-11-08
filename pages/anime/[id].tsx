/* eslint-disable @next/next/no-img-element */
import {
  InferGetStaticPropsType,
  NextPage,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import axios from "axios";
import { urls } from "service/urls";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";
import { BsChevronLeft, BsPlusLg, BsChevronRight } from "react-icons/bs";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Spinner from "@atoms/Spinner";
import Link from "next/link";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import HorizontalAnimeTile from "@organisms/HorizontalAnimeTile";
import { useMyListStore } from "store/MyListStore";
import { TbChecks } from "react-icons/tb";
import { MdRemove } from "react-icons/md";
import {
  addItemToMyListFireStore,
  deleteMyListItemFireStore,
} from "../../firebase/MyListFireStore/helpers";
import { useAuthStore } from "Auth";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import AnimeTile from "@molecules/AnimeTile";
import { useCurrentlyWatchingStore } from "store/useCurrentlyWatching";
import { useContinueWatchingStore } from "store/ContinueWatchStore";
import { toDaysMinutesSeconds } from "utils/secondsToDaysHoursMins";

const AnimePage: NextPage = ({
  animeData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const continueWatching = useContinueWatchingStore(
    (state) => state.myList[animeData?.title.romaji]
  );

  const [setEpisodeList, setAnimeData] = useCurrentlyWatchingStore((state) => [
    state.setEpisodesList,
    state.setAnimeData,
  ]);
  const {
    isLoading,
    error,
    data: episodes,
  } = useQuery(["episodes", router.query?.id], async () => {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + urls.getEpisodes + router.query?.id ||
        ""
    );
    if (res.status === 200) {
      setEpisodeList(res.data);
    }
    return res.data;
  });
  // Episodes Pagination
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const myList = useMyListStore((state) => state.myList);
  const user = useAuthStore((state) => state.user);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch items from another resources.
    if (animeData && animeData.type === "NOVEL") {
      router.replace(`/anime/${animeData.id}`, `/novel/${animeData.id}`);
    }
    setTabIndex(0);
    if (episodes) {
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(episodes.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(episodes.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage, animeData, episodes, router]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    let seconds = animeData?.nextAiringEpisode?.timeUntilAiring;
    if (seconds) {
      setCountDown(seconds);
      interval = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [animeData?.nextAiringEpisode?.timeUntilAiring]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % (episodes?.length || 0);
    setItemOffset(newOffset);
  };

  const handleSetAnimeData = (
    animeTitle: string,
    episodeTitle: string,
    episodeNumber: number
  ) => {
    setAnimeData(animeTitle, episodeTitle, episodeNumber);
  };

  const getTimeTillNextEpisode = () => {
    if (!countDown) return null;

    return toDaysMinutesSeconds(countDown);
  };

  if (router.isFallback) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative">
        <img
          className="w-full h-[50vh] object-cover bg-gradient-to-t from-black"
          src={animeData.cover}
          alt="cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black"></div>
      </div>

      <section className="px-5 md:px-20 -translate-y-32">
        <div className="flex gap-8">
          <img
            className="w-44 h-60 rounded shadow-lg shadow-slate-800"
            src={animeData.image}
            alt=""
          />
          <div className="details flex flex-col justify-end gap-3">
            <p className="font-bold text-4xl">{animeData.title.romaji}</p>
            <div className="actions | flex gap-2">
              {!isLoading && episodes && episodes.length > 0 ? (
                continueWatching ? (
                  <Link
                    href={`/anime/watch/${continueWatching.episode.id}`}
                    passHref
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        handleSetAnimeData(
                          animeData.title.romaji,
                          continueWatching.episode.title,
                          continueWatching.episode.number
                        );
                      }}
                    >
                      <FaPlay className="w-5 h-5" /> Continue Episode:{" "}
                      {continueWatching.episode.number.toLocaleString(
                        undefined,
                        { minimumIntegerDigits: 2 }
                      )}
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/anime/watch/${episodes[0]?.id}`} passHref>
                    <Button
                      type="primary"
                      onClick={() => {
                        handleSetAnimeData(
                          animeData.title.romaji,
                          episodes[0]?.title,
                          1
                        );
                      }}
                    >
                      <FaPlay className="w-5 h-5" /> Play
                    </Button>
                  </Link>
                )
              ) : (
                <Button disabled type="primary" onClick={() => {}}>
                  <FaPlay className="w-5 h-5" /> Play
                </Button>
              )}

              {myList[animeData.id] ? (
                <div className="flex gap-2">
                  <Button type="secondary" onClick={() => {}}>
                    <TbChecks className="w-5 h-5 tick-animate" />
                  </Button>
                  <Button
                    className="fade-right"
                    type="secondary"
                    onClick={() => {
                      deleteMyListItemFireStore(animeData.id);
                    }}
                  >
                    <MdRemove className="w-5 h-5" />
                  </Button>
                </div>
              ) : user ? (
                <Button
                  type="secondary"
                  onClick={() =>
                    addItemToMyListFireStore({
                      id: animeData.id,
                      name: animeData.title.romaji,
                      image: animeData.image,
                      type: animeData.type,
                    })
                  }
                >
                  <BsPlusLg className="w-5 h-5" /> My List
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <Tabs
          selectedIndex={tabIndex}
          onSelect={(index) => setTabIndex(index)}
          className="mt-10"
        >
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Relations</Tab>
            <Tab>Recommendations</Tab>
          </TabList>

          <TabPanel>
            <section className="flex flex-col md:flex-row my-10">
              <div className="w-full md:w-2/3 flex flex-col gap-10">
                <div className="info flex items-center gap-4">
                  <p>{animeData.releaseDate} </p>
                  <span className="border px-1 border-white rounded-sm text-xs p-[2px]">
                    {animeData.type}
                  </span>
                  <p>
                    Score:{" "}
                    <span
                      className={classNames("font-bold", {
                        "text-green-400": parseInt(animeData.rating) >= 70,
                        "text-yellow-400":
                          parseInt(animeData.rating) >= 50 &&
                          parseInt(animeData.rating) < 70,
                        "text-red-400": parseInt(animeData.rating) < 50,
                      })}
                    >
                      {animeData.rating}%
                    </span>
                  </p>
                  <p>
                    <span className="font-bold">{animeData.totalEpisodes}</span>{" "}
                    Episodes
                  </p>
                  <div
                    className={classNames(
                      "border shadow-md rounded text-xs p-1 px-2",
                      {
                        "border-green-500 shadow-green-500 text-green-500": (
                          animeData.status as string
                        )
                          .toLowerCase()
                          .includes("completed"),
                        "border-blue-400 shadow-blue-400 text-blue-400": (
                          animeData.status as string
                        )
                          .toLowerCase()
                          .includes("ongoing"),
                      }
                    )}
                  >
                    {animeData.status}
                  </div>
                </div>
                {countDown ? <div className="font-bold text-xl ">
                  <span className="mr-2">Next Episode in</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                    {getTimeTillNextEpisode()}
                  </span>
                </div> : null}
                <div
                  // className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(animeData.description),
                  }}
                ></div>
              </div>
              <div className="w-full md:w-1/3 flex flex-col">
                <div className="flex flex-col gap-4 md:px-20 py-5">
                  <p className="text-gray-500 text-sm">
                    Genres:
                    <span className="font-normal ml-2 text-gray-300">
                      {animeData.genres.join(", ")}
                    </span>
                  </p>

                  <p className="text-gray-500 text-sm">
                    Studios:
                    <span className="font-normal ml-2 text-gray-300">
                      {animeData.studios.join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </section>
          </TabPanel>
          <TabPanel>
            <section className="flex flex-col my-10">
              <h2 className="text-xl">Relations</h2>
              <HorizontalAnimeTile
                data={animeData.relations}
                Component={AnimeTile}
              />
            </section>
          </TabPanel>
          <TabPanel>
            <section className="flex flex-col my-10">
              <h2 className="text-xl">Recommendations</h2>
              <HorizontalAnimeTile
                data={animeData.recommendations}
                Component={AnimeTile}
              />
            </section>
          </TabPanel>
        </Tabs>

        <section className="flex flex-col gap-4">
          <div className="flex py-5 items-center">
            <h2 className="flex-grow font-semibold text-2xl">Episodes</h2>
            <div className="react-paginate | flex-shrink-0">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<BsChevronRight />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={<BsChevronLeft />}
                // renderOnZeroPageCount={null}
              />
            </div>
          </div>
          {isLoading ? (
            <div
              role="status"
              className="p-4 space-y-4 w-full rounded border  divide-y  shadow animate-pulse divide-gray-700 md:p-6 border-gray-700"
            >
              <div className="flex gap-4 items-center">
                <div className="h-20 rounded bg-gray-700 w-32"></div>
                <div>
                  <div className="h-2.5  rounded-full bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 rounded-full bg-gray-700"></div>
                </div>
              </div>
              <div className="flex gap-4 items-center pt-4">
                <div className="h-20 rounded bg-gray-700 w-32"></div>
                <div>
                  <div className="h-2.5  rounded-full bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 rounded-full bg-gray-700"></div>
                </div>
              </div>
              <div className="flex gap-4 items-center pt-4">
                <div className="h-20 rounded bg-gray-700 w-32"></div>
                <div>
                  <div className="h-2.5  rounded-full bg-gray-600 w-24 mb-2.5"></div>
                  <div className="w-32 h-2 rounded-full bg-gray-700"></div>
                </div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          ) : error ? (
            <p className="p-10 w-full text-center font-bold text-red-400 text-2xl">
              Error getting episodes...
            </p>
          ) : (
            <div className="flex flex-col">
              {(currentItems || []).map((ep: any) => {
                return (
                  <Link key={ep.id} href={`/anime/watch/${ep.id}`}>
                    <a
                      onClick={() =>
                        handleSetAnimeData(
                          animeData.title.romaji,
                          ep.title,
                          ep.number
                        )
                      }
                      className="flex items-center gap-6 p-4 cursor-pointer rounded-md hover:bg-gray-700"
                    >
                      <span className="text-2xl">{ep.number}</span>
                      <img
                        className="w-40 aspect-video object-cover flex-shrink-0"
                        src={ep.image}
                        alt="thumb"
                      />
                      <div className="flex flex-col">
                        <h4 className="text-lg font-bold">
                          {ep.title || ep.id.replaceAll("-", " ")}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {ep.description}
                        </p>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default AnimePage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: "144533" },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const res = await axios.get(
      process.env.BASE_URL + urls.getAnimeOnlyData + context.params?.id || ""
    );

    return {
      props: {
        animeData: res.data,
      },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 1,
    };
  }
};
