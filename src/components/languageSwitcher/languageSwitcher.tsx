import React, { useState, useCallback } from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setcurCurrentLang] = useState(i18n.language);

  const switchLang = useCallback(
    (lang: string) => {
      void i18n.changeLanguage(lang);
      setcurCurrentLang(lang);
    },
    [i18n]
  );

  return (
    <div className={s.container}>
      <button
        aria-label="switch language to english."
        title="switch language to english."
        type="button"
        className={`${s.button as string}, ${
          currentLang === "en" ? (s.active as string) : ""
        }`}
        onClick={() => switchLang("en")}
      >
        EN
      </button>
      <div className={s.div} />
      <button
        aria-label="berpindah bahasa ke bahasa Indonesia."
        title="berpindah bahasa ke bahasa Indonesia."
        type="button"
        className={`${s.button as string}, ${
          currentLang === "id" ? (s.active as string) : ""
        }`}
        onClick={() => switchLang("id")}
      >
        ID
      </button>
    </div>
  );
};

export default LanguageSwitcher;
