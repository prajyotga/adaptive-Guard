interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <strong>Connection problem</strong>
      <span>{message}</span>
      {onRetry && (
        <button className="button secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}