const LoadingBoundary = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
      <p className="text-gray-700 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default LoadingBoundary;
