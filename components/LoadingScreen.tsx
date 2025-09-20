'use client';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Processing..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <p className="text-sm text-gray-500">Please wait while we process your request...</p>
      </div>
    </div>
  );
}; 