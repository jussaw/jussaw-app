"use client";

import { useState, useEffect } from "react";

export const SECTIONS = [
  { id: "hero", label: "jussaw" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects"   },
  { id: "hobbies",    label: "Hobbies"    },
] as const;

export function useActiveSection(): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const getActive = (): number => {
      // The trigger line sits 40% down from the top of the viewport.
      // The last section whose top is at or above this line is the active one.
      const triggerLine = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      SECTIONS.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= triggerLine) active = i;
      });
      return active;
    };

    const onScroll = () => setActiveIndex(getActive());

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return activeIndex;
}
