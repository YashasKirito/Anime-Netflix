import { ScrollMenu } from "react-horizontal-scrolling-menu";

interface IHorizontalAnimeTile {
  data: object[];
  Component: React.FC<any>;
}

const LeftArrow = () => {
  return (
    <div className="">
      <button>left</button>
    </div>
  );
};

const RightArrow = () => {
  return (
    <div className="">
      <button>right</button>
    </div>
  );
};

const HorizontalAnimeTile: React.FC<IHorizontalAnimeTile> = ({
  data,
  Component,
}) => {
  return (
    <div className="py-5">
      <ScrollMenu>
        {data.map((anime: any) => {
          return <Component key={anime.id} anime={anime} />;
        })}
      </ScrollMenu>
    </div>
  );
};

export default HorizontalAnimeTile;
