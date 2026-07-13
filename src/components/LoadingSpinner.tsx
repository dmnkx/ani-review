interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "불러오는 중..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="mt-4 text-sm text-muted">{message}</p>
    </div>
  );
}
