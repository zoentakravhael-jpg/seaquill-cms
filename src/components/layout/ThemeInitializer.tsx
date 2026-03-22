"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    // Set background images from data-bg-src attributes
    const bgElements = document.querySelectorAll("[data-bg-src]");
    bgElements.forEach((el) => {
      const src = el.getAttribute("data-bg-src");
      if (src) {
        (el as HTMLElement).style.backgroundImage = `url(${src})`;
      }
    });
  }, []);

  return null;
}
