"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Replaces WOW.js + GSAP text animations for Next.js.
 * 
 * Handles:
 * 1. .wow elements — IntersectionObserver-based scroll reveal (replaces WOW.js)
 * 2. [data-ani] / [data-ani-delay] — immediate animation class + delay (hero section)
 * 3. .text-anime-style-1/2/3 — scroll-triggered text split animations (replaces GSAP SplitText)
 */
export default function AnimationInitializer() {
  const pathname = usePathname();

  const initWowAnimations = useCallback(() => {
    const wowElements = document.querySelectorAll<HTMLElement>(".wow");
    if (!wowElements.length) return;

    // Initially hide all .wow elements
    wowElements.forEach((el) => {
      el.style.visibility = "hidden";
      el.style.animationName = "none";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.getAttribute("data-wow-delay");
            const duration = el.getAttribute("data-wow-duration");
            const iteration = el.getAttribute("data-wow-iteration");

            if (delay) el.style.animationDelay = delay;
            if (duration) el.style.animationDuration = duration;
            if (iteration) el.style.animationIterationCount = iteration;

            el.style.visibility = "visible";
            el.style.animationName = "";
            el.classList.add("animated");

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    wowElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const initDataAniAnimations = useCallback(() => {
    // [data-ani] — add animation class directly
    document.querySelectorAll<HTMLElement>("[data-ani]").forEach((el) => {
      const animName = el.getAttribute("data-ani");
      if (animName) el.classList.add(animName);
    });

    // [data-ani-delay] — set CSS animation-delay
    document.querySelectorAll<HTMLElement>("[data-ani-delay]").forEach((el) => {
      const delay = el.getAttribute("data-ani-delay");
      if (delay) el.style.animationDelay = delay;
    });
  }, []);

  const initTextAnimations = useCallback(() => {
    const initStyle = (
      selector: string,
      splitType: "words" | "chars",
      stagger: number,
      translateX: number,
      duration: number,
      delay: number
    ) => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              animateTextElement(el, splitType, stagger, translateX, duration, delay);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15 }
      );

      elements.forEach((el) => {
        // Hide the element content initially
        el.style.overflow = "hidden";
        const spans = splitTextIntoSpans(el, splitType);
        spans.forEach((span) => {
          span.style.opacity = "0";
          span.style.display = "inline-block";
          span.style.transform = `translateX(${translateX}px)`;
          span.style.transition = "none";
        });
        observer.observe(el);
      });
    };

    // text-anime-style-1: words, stagger 0.05s
    initStyle(".text-anime-style-1", "words", 0.05, 20, 1, 0.5);
    // text-anime-style-2: chars, stagger 0.03s
    initStyle(".text-anime-style-2", "chars", 0.03, 20, 0.8, 0.1);
    // text-anime-style-3: chars, stagger 0.02s
    initStyle(".text-anime-style-3", "chars", 0.02, 50, 0.6, 0.1);
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered after navigation
    const timer = setTimeout(() => {
      const cleanupWow = initWowAnimations();
      initDataAniAnimations();
      initTextAnimations();

      // Re-observe for dynamically added elements (Swiper slides, etc.)
      const mutationObserver = new MutationObserver(() => {
        // Re-init for newly added .wow elements that haven't been processed
        const newWowElements = document.querySelectorAll<HTMLElement>(
          ".wow:not(.animated)"
        );
        if (newWowElements.length) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const el = entry.target as HTMLElement;
                  const delay = el.getAttribute("data-wow-delay");
                  const duration = el.getAttribute("data-wow-duration");

                  if (delay) el.style.animationDelay = delay;
                  if (duration) el.style.animationDuration = duration;

                  el.style.visibility = "visible";
                  el.style.animationName = "";
                  el.classList.add("animated");
                  observer.unobserve(el);
                }
              });
            },
            { threshold: 0.1 }
          );

          newWowElements.forEach((el) => {
            if (el.style.visibility !== "hidden") {
              el.style.visibility = "hidden";
              el.style.animationName = "none";
            }
            observer.observe(el);
          });
        }

        // Re-init data-ani for new elements
        document
          .querySelectorAll<HTMLElement>("[data-ani]:not([data-ani-init])")
          .forEach((el) => {
            const animName = el.getAttribute("data-ani");
            if (animName) {
              el.classList.add(animName);
              el.setAttribute("data-ani-init", "true");
            }
          });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        cleanupWow?.();
        mutationObserver.disconnect();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, initWowAnimations, initDataAniAnimations, initTextAnimations]);

  return null;
}

/* ---- Helpers ---- */

function splitTextIntoSpans(
  el: HTMLElement,
  type: "words" | "chars"
): HTMLSpanElement[] {
  const text = el.textContent || "";
  const spans: HTMLSpanElement[] = [];

  // Clear existing content
  el.innerHTML = "";

  if (type === "words") {
    const words = text.split(/\s+/).filter(Boolean);
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.display = "inline-block";
      spans.push(span);
      el.appendChild(span);
      // Add space between words
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode("\u00A0"));
      }
    });
  } else {
    // chars — split into individual characters, preserving word spacing
    const words = text.split(/\s+/).filter(Boolean);
    words.forEach((word, wi) => {
      const wordWrapper = document.createElement("span");
      wordWrapper.style.display = "inline-block";
      wordWrapper.style.whiteSpace = "nowrap";

      for (const char of word) {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        spans.push(span);
        wordWrapper.appendChild(span);
      }

      el.appendChild(wordWrapper);
      if (wi < words.length - 1) {
        el.appendChild(document.createTextNode("\u00A0"));
      }
    });
  }

  return spans;
}

function animateTextElement(
  el: HTMLElement,
  splitType: "words" | "chars",
  stagger: number,
  _translateX: number,
  duration: number,
  initialDelay: number
) {
  const spans = el.querySelectorAll<HTMLSpanElement>("span[style]");
  const allSpans = Array.from(spans).filter(
    (s) => s.children.length === 0 || splitType === "words"
  );

  // For chars mode, only get leaf spans (actual character spans)
  const animSpans =
    splitType === "chars"
      ? Array.from(spans).filter((s) => s.children.length === 0)
      : allSpans;

  animSpans.forEach((span, i) => {
    const delay = initialDelay + i * stagger;
    span.style.transition = `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`;
    span.style.opacity = "1";
    span.style.transform = "translateX(0)";
  });
}
