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

const AnimePage: NextPage = ({
  animeData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  // Episodes Pagination
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(animeData.episodes.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(animeData.episodes.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, animeData]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: { selected: number }) => {
    const newOffset =
      (event.selected * itemsPerPage) % animeData.episodes.length;
    setItemOffset(newOffset);
  };

  // if (error) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <h1 className="font-bold text-4xl">
  //         Sorry! couldn&apos;t get the anime details, please try again later!
  //       </h1>
  //     </div>
  //   );
  // }

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

      <section className="px-20 -translate-y-32">
        <div className="flex gap-8">
          <img
            className="w-44 h-60 rounded shadow-lg shadow-slate-800"
            src={animeData.image}
            alt=""
          />
          <div className="details flex flex-col justify-end gap-3">
            <p className="font-bold text-4xl">{animeData.title.romaji}</p>
            <div className="actions | flex gap-2">
              <Button
                type="primary"
                onClick={() =>
                  router.push(`/anime/watch/${animeData.episodes[0].id}`)
                }
              >
                <FaPlay className="w-5 h-5" /> Play
              </Button>

              <Button type="secondary" onClick={() => console.log("Click")}>
                <BsPlusLg className="w-5 h-5" /> My List
              </Button>
            </div>
          </div>
        </div>

        <section className="flex my-10">
          <div className="w-2/3 flex flex-col gap-2">
            <div className="info flex items-center gap-4">
              <p>{animeData.releaseDate} </p>
              <span className="border border-white rounded-sm text-xs p-[2px]">
                {animeData.type}
              </span>
              <p>
                Score: <span className="font-bold">{animeData.rating}</span>
              </p>
              <p>
                <span className="font-bold">{animeData.totalEpisodes}</span>{" "}
                Episodes
              </p>
              <div className="border rounded text-xs p-1 px-2">
                {animeData.status}
              </div>
            </div>
            <div
              // className="whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(animeData.description),
              }}
            ></div>
          </div>
          <div className="w-1/3 flex flex-col">
            <div className="flex flex-col gap-4 px-20 py-5">
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
          <div className="flex flex-col">
            {(currentItems || []).map((ep: any) => {
              return (
                <Link key={ep.id} href={`/anime/watch/${ep.id}`}>
                  <a className="flex items-center gap-6 p-4 cursor-pointer rounded-md hover:bg-gray-700">
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
                      <p className="text-sm text-gray-400">{ep.description}</p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
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
  const res = await axios.get(
    process.env.BASE_URL + urls.getAnime + context.params?.id || ""
  );
  return {
    props: {
      animeData: res.data,
    },
    revalidate: 120,
  };
};
