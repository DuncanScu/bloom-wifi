interface BuyMeCoffeeProps {
  username?: string;
  className?: string;
}

export function BuyMeCoffee({
  username = "duncanscu",
  className = "",
}: BuyMeCoffeeProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <a
        href={`https://www.buymeacoffee.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{ height: "60px", width: "217px" }}
        />
      </a>
    </div>
  );
}
