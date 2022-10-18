import cn from "classnames";

interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  type: "primary" | "secondary" | "custom";
  disabled?: boolean;
  className?: string;
  color?: string;
  textColor?: string;
}

const Button: React.FC<IButton> = ({
  children,
  onClick,
  type,
  disabled,
  className,
  color,
  textColor,
}) => {
  return (
    <button
      className={cn(
        "p-2 px-4 md:px-6 text-xs md:text-base flex items-center font-bold justify-center w-fit rounded-md gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:outline outline-2 outline-offset-2 outline-slate-500 transition hover:brightness-50",
        {
          "text-black": type === "primary",
          "text-white": type === "secondary",
          "bg-white": type === "primary",
          "bg-gray-400/50": type === "secondary",
        },
        className
      )}
      style={type === "custom" ? { background: color, color: textColor || "#fff" } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
