"use client";

import { useLayoutEffect, useRef, useState } from "react";

const GOOGLE_BUTTON_MAX_WIDTH = 400;

export function useGoogleButtonWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      const nextWidth = Math.floor(element.getBoundingClientRect().width);
      setWidth(Math.min(GOOGLE_BUTTON_MAX_WIDTH, Math.max(0, nextWidth)));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { containerRef, width };
}
