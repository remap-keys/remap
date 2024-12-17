import { Location, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
const useLocationChange = (callback: (location: Location) => void) => {
  // eslint-disable-next-line no-unused-vars
  const refCallback = useRef<((location: Location) => void) | undefined>();
  const location = useLocation();

  useEffect(() => {
    refCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (refCallback.current) {
      refCallback.current(location);
    }
  }, [location]);
};

export default useLocationChange;
