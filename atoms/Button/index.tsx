import cn from "classnames";

interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  type: "primary" | "secondary";
}

const Button: React.FC<IButton> = ({ children, onClick, type }) => {
  return (
    <button
      className={cn(
        "p-2 px-6 flex items-center justify-center w-fit rounded-md gap-2",
        {
          "text-black": type === "primary",
          "text-white": type === "secondary",
          "bg-white": type === "primary",
          "bg-gray-400/50": type === "secondary",
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
