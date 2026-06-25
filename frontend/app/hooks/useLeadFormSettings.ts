"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeadFormSettings } from "../types/leadForm";

const fallbackLeadForm: LeadFormSettings = {
  customFields: [],
};

export function useLeadFormSettings() {
  const [leadForm, setLeadForm] = useState<LeadFormSettings>(fallbackLeadForm);
  const [loading, setLoading] = useState(true);

  const fetchLeadForm = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/settings/lead-form`,
        { cache: "no-store" },
      );
      const data = await res.json();

      if (data.success) {
        setLeadForm({
          customFields: data.data?.customFields || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch lead form settings", error);
      setLeadForm(fallbackLeadForm);
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchLeadForm();
  }, [fetchLeadForm]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return {
    leadForm,
    loading,
    refreshLeadForm: fetchLeadForm,
  };
}
