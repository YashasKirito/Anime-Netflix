import AnimeTile from "@molecules/AnimeTile";
import { useMyListStore } from "store/MyListStore";

const MyListPage = () => {
  const myList = useMyListStore((state) => state.myList);
  return (
    <section className="md:p-20 pt-20 p-5">
      <h1 className="text-2xl font-bold pt-5">My List</h1>
      <div className="flex my-10 flex-wrap gap-2">
        {Object.values(myList).map((anime) => (
          <AnimeTile
            key={anime.id}
            anime={{ title: { romaji: anime.name }, ...anime }}
          />
        ))}
      </div>
    </section>
  );
};

export default MyListPage;
