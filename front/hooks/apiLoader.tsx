import { useEffect, useState } from "react";

export function useAPILoader<T>(fetcher: () => Promise<T>, deps: any[] = []): [T | undefined, boolean] {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetcher().then(data => {
      setData(data);
      setIsLoading(false);
    });
  }, deps);

  return [data, isLoading];
}