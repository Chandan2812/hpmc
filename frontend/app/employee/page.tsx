"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        <p className="text-[var(--text-secondary)]">Preparing dashboard...</p>
      </div>
    );
  }

  return (
    <section className="pb-24 md:pb-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
            Employee Panel
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Monitor enquiries, audience growth, and recent activity.
          </p>
        </div>
      </div>
    </section>
  );
}
