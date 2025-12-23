"use client";

import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export default function CompareFloatingBar() {
  const [selectedIds] = useQueryState(
    "selectedIds",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(selectedIds.length > 0);
  }, [selectedIds.length]);

  if (!selectedIds.length) return null;

  return (
    <div
      className={`fixed bottom-6 inset-x-0 z-50 flex justify-center transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg border border-slate-800 animate-slideup">
        <span className="font-semibold text-base">
          Selected {selectedIds.length} deal{selectedIds.length > 1 ? "s" : ""}
        </span>
        <Link
          href={`/compare?ids=${selectedIds.join(",")}`}
          className="ml-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
        >
          Compare Now
        </Link>
      </div>
      <style jsx>{`
        @keyframes slideup {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideup {
          animation: slideup 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
