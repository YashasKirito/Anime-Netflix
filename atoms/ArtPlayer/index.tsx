import { DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Option from "artplayer/types/option";

interface IArtPlayer {
  option: Option;
  getInstance: (art: Artplayer) => void;
}

export const Player: React.FC<
  IArtPlayer & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ option, getInstance, ...rest }) => {
  const artRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current!,
    });
    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }
    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={artRef} {...rest}></div>;
};
