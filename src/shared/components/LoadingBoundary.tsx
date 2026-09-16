const LoadingBoundary = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mb-4"></div>
      <p className="text-muted-foreground text-lg font-medium">Loading...</p>
    </div>
  );
};

export default LoadingBoundary;