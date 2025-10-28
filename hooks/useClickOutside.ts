import { useEffect, RefObject } from "react";

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>, // ✅ null رو اضافه کردیم
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // اگه ref یا current نداشته باشیم، یا کلیک داخل element بوده، چیزی نکن
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // اگه کلیک خارج از element بود، handler رو صدا بزن
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
