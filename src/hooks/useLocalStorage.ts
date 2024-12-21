import { useState, useEffect } from "react";

function useLocalStorage(defaultValue: string, key: string) {
  const [value, setValue] = useState((): string => {
    const localValue = window.localStorage.getItem(key);
    return localValue !== null ? JSON.parse(localValue) as string : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
