"use client";

import { useState, createContext, useContext } from "react";

const LoadingContext = createContext<{
  isLoading: boolean;
  setLoading: (state: boolean) => void;
}>({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <div className="text-gray-600 text-lg font-medium">Loading...</div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);