"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="
        fixed bottom-6 right-6 z-50
        flex h-12 w-12 items-center justify-center
        rounded-full bg-orange-500 text-white
        shadow-xl ring-1 ring-black/10
        hover:bg-orange-600 active:scale-95
        transition-all duration-200
      "
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
}
