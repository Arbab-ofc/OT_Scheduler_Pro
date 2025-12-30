const sizes = {
  small: "h-4 w-4",
  medium: "h-8 w-8",
  large: "h-12 w-12"
};

const LoadingSpinner = ({ size = "medium", fullScreen = false }) => {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-primary/30 border-t-primary ${sizes[size]}`} role="status" aria-label="Loading" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
