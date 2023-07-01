import type React from "react";
import { useEffect } from "react";

const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  cb: (ref: React.RefObject<T>) => void
) => {
  useEffect(() => {
    /**
     * if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event?.target as Node)) {
        cb(ref);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cb, ref]);
};

export default useClickOutside;
