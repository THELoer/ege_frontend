import clsx from "clsx";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "btn",
        variant === "primary" ? "btn-primary" : "btn-secondary",
        className
      )}
    >
      {children}
    </button>
  );
}
