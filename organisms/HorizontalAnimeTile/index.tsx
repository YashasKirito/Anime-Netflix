import AnimeTile from "molecules/AnimeTile";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

interface IHorizontalAnimeTile {
  data: object[];
}

const LeftArrow = () => {
  return <div className=""><button>left</button></div>
}

const RightArrow = () => {
  return <div className=""><button>right</button></div>;
};

const HorizontalAnimeTile: React.FC<IHorizontalAnimeTile> = ({ data }) => {
  return (
    <div className="py-2">
      <ScrollMenu>
        {data.map((anime: any) => (
          <AnimeTile key={anime.id} anime={anime} />
        ))}
      </ScrollMenu>
    </div>
  );
};

export default HorizontalAnimeTile;
