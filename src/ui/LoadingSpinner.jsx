const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
