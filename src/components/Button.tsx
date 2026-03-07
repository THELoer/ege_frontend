export default function Button({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "btn btn-primary"
      : "btn btn-secondary";

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
