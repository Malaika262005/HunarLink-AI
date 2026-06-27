export default function RatingStars({ value = 0 }) {
  const full = Math.round(value);
  return (
    <span className="text-yellow-500 text-sm">
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
      <span className="text-text-muted ml-1">({Number(value).toFixed(1)})</span>
    </span>
  );
}