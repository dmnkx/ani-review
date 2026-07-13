interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="flex gap-1" role={readonly ? "img" : "group"} aria-label={`평점 ${value}/10`}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${sizeClass} transition-transform ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${star <= value ? "text-amber-400" : "text-border"}`}
          aria-label={`${star}점`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
