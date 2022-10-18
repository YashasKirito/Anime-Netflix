/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { RiSearchLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";
import { Debounce } from "utils/debounce";
import { useAuthStore } from "Auth";
import { useEffect, useState } from "react";
import classNames from "classnames";

const LINKS = [
  { link: "Home", href: "/" },
  { link: "Top Anime", href: "/top" },
  { link: "Top Airing", href: "/top-airing" },
  { link: "Upcoming", href: "/upcoming" },
  { link: "My List", href: "/mylist" },
];

interface IHeader {
  isWatchRoute?: boolean;
}

const Header: React.FC<IHeader> = ({ isWatchRoute }) => {
  const router = useRouter();

  const [login, user, logout] = useAuthStore((state) => [
    state.login,
    state.user,
    state.logout,
  ]);

  const [scrollThreshold, setScrollThreshold] = useState(false);

  useEffect(() => {
    const listener = (e: Event) => {
      if (window.scrollY > 60) {
        !scrollThreshold && setScrollThreshold(true);
      } else {
        scrollThreshold && setScrollThreshold(false);
      }
    };
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [scrollThreshold]);

  if (isWatchRoute) {
    return (
      <header className="absolute z-50 p-5 px-10">
        <button onClick={() => router.back()}>
          <BsArrowLeft className="w-10 h-10" />
        </button>
      </header>
    );
  }

  const handleSearch = Debounce((e) => {
    if (e.target.value) {
      router.push({
        pathname: "/search",
        query: {
          query: e.target.value,
        },
      });
    }
  }, 1000);

  return (
    <header
      className={classNames(
        "flex p-4 lg:px-36 md:px-20 sticky items-center transition duration-500 top-0 z-10 bg-gradient-to-b from-black w-full",
        { "backdrop-blur bg-black/20": scrollThreshold }
      )}
    >
      <Link href={"/"}>
        <a className="italic font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-4xl md:text-4xl mr-8 md:mr-12 select-none">
          Animatrix
        </a>
      </Link>

      <ul className="flex-grow gap-4 font-semibold hidden md:flex">
        {LINKS.map((link) => (
          <li
            key={link.link}
            className="whitespace-nowrap font-light hover:underline underline-offset-4 transition"
          >
            <Link href={link.href}>{link.link}</Link>
          </li>
        ))}
      </ul>
      <div className="flex-grow"></div>

      {/* Search and user Icon */}
      <div className="justify-end transition-all group flex items-center p-2 text-sm text-zinc-300 hover:bg-black focus:bg-black focus-visible:bg-black focus-within:bg-black border border-transparent hover:border-white focus:border-white focus-visible:border-white focus-within:border-white">
        <input
          className="p-0 border-none opacity-0 outline-none bg-inherit group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-focus-visible:opacity-100"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
        <RiSearchLine className="h-5 w-5" />
      </div>

      {user && user.photoURL ? (
        <img
          className="w-8 rounded-full aspect-square"
          src={user.photoURL || ""}
          alt="user"
        />
      ) : user ? (
        <FaUserCircle className="ml-4 h-8 w-8" />
      ) : null}
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
};

export default Header;
