"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/locales/translations";

const LanguageContext = createContext({});
const LANGS = ["en", "roman", "urdu"];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // page load pe saved language lagao
  useEffect(() => {
    const saved = localStorage.getItem("hunarlink-lang");
    const initial = LANGS.includes(saved) ? saved : "en"; // default English
    applyLang(initial);
    setLang(initial);
  }, []);

  // Urdu ke liye RTL (right-to-left), baqi LTR
  const applyLang = (l) => {
    document.documentElement.dir = l === "urdu" ? "rtl" : "ltr";
    document.documentElement.lang = l === "urdu" ? "ur" : "en";
  };

  const changeLang = (l) => {
    if (!LANGS.includes(l)) return;
    applyLang(l);
    setLang(l);
    localStorage.setItem("hunarlink-lang", l);
  };

  // t("nav.dashboard") => active language ka text
  // agar key na mile to English, phir key khud return (safe)
  const t = (key) => {
    const dig = (obj) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
    return dig(translations[lang]) ?? dig(translations.en) ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, langs: LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);