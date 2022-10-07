import Link from "next/link";
import { RiSearchLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/router";
import { Debounce } from "utils/debounce";

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
    <header className="flex p-4 lg:px-36 md:px-20 sticky items-center top-0 z-10 bg-gradient-to-b from-black w-full">
      <Link href={"/"}>
        <a className="font-semibold uppercase text-orange-600 text-2xl mr-8 select-none">
          Aniflix
        </a>
      </Link>

      <ul className="flex flex-grow gap-4 text-sm">
        {LINKS.map((link) => (
          <li
            key={link.link}
            className="whitespace-nowrap font-light hover:font-semibold hover:underline underline-offset-4 transition"
          >
            <Link href={link.href}>{link.link}</Link>
          </li>
        ))}
      </ul>

      {/* Search and user Icon */}
      <div className="justify-end group flex items-center p-2 text-sm text-zinc-300 hover:bg-black focus:bg-black focus-visible:bg-black focus-within:bg-black border border-transparent hover:border-white focus:border-white focus-visible:border-white focus-within:border-white">
        <input
          className="p-0 border-none opacity-0 outline-none bg-inherit group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 group-focus-visible:opacity-100"
          type="text"
          placeholder="Search"
          onChange={handleSearch}
        />
        <RiSearchLine className="h-5 w-5" />
      </div>
      <FaUserCircle className="ml-4 h-5 w-5" />
    </header>
  );
};

export default Header;
