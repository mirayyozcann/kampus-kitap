"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-xl border border-white/25 px-4 py-2.5 text-sm font-medium text-paper hover:bg-white/10"
    >
      {copied ? "Bağlantı kopyalandı ✓" : "Bağlantıyı kopyala"}
    </button>
  );
}