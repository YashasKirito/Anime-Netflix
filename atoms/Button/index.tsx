import cn from "classnames";

interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  type: "primary" | "secondary";
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({ children, onClick, type, disabled }) => {
  return (
    <button
      className={cn(
        "p-2 px-4 md:px-6 text-xs md:text-base flex items-center font-bold justify-center w-fit rounded-md gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "text-black": type === "primary",
          "text-white": type === "secondary",
          "bg-white": type === "primary",
          "bg-gray-400/50": type === "secondary",
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
