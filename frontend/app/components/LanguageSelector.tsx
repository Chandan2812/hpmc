"use client";
import React, { useEffect, useState } from "react";

const LanguageSelector = () => {
  const [lang, setLang] = useState<string>("");

  // 🔹 Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    if (!selectedLang) return;

    // 🔹 Save selection
    setLang(selectedLang);
    localStorage.setItem("lang", selectedLang);

    if (selectedLang === "en") {
      // 🔹 Reset to English
      document.cookie =
        "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      window.location.hash = "";
      window.location.reload();
      return;
    }

    // 🔹 Set Google Translate cookie
    document.cookie = `googtrans=/en/${selectedLang};path=/`;
    window.location.hash = `#googtrans=en/${selectedLang}`;

    // 🔹 Apply translation
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <select
      value={lang}
      onChange={handleLanguageChange}
      title="Select language"
      className="language-selector appearance-none bg-[var(--card)] rounded-full text-center cursor-pointer"
    >
      <option value="" disabled title="Language">
        🌐
      </option>

      <option value="en" title="English">
        EN
      </option>
      <option value="ar" title="Arabic">
        AR
      </option>
      <option value="fr" title="French">
        FR
      </option>
      <option value="de" title="German">
        DE
      </option>
      <option value="hi" title="Hindi">
        HI
      </option>
      <option value="es" title="Spanish">
        ES
      </option>
      <option value="it" title="Italian">
        IT
      </option>
      <option value="pt" title="Portuguese">
        PT
      </option>
      <option value="ru" title="Russian">
        RU
      </option>
      <option value="zh-CN" title="Chinese (Simplified)">
        ZH
      </option>
      <option value="ja" title="Japanese">
        JA
      </option>
      <option value="ko" title="Korean">
        KO
      </option>
    </select>
  );
};

export default LanguageSelector;
