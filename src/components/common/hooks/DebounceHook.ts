import { useEffect, useState } from 'react';

export const useDebounce = <V, B>(value: V, base: B, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<{ value: V; base: B }>({
    value,
    base,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue({ value, base });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, base, delay]);

  return debouncedValue;
};
