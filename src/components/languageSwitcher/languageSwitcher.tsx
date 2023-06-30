import React from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const switchLanguage = () => {
    const newLanguage = i18n.language === "en" ? "id" : "en";
    void router.push(router.pathname, router.pathname, { locale: newLanguage });
  };

  return (
    <div className={s.container}>
      <button
        aria-label="switch language to english."
        title="switch language to english."
        type="button"
        className={`${s.button as string}, ${
          i18n.language === "en" ? (s.active as string) : ""
        }`}
        onClick={() => switchLanguage()}
      >
        EN
      </button>
      <div className={s.div} />
      <button
        aria-label="berpindah bahasa ke bahasa Indonesia."
        title="berpindah bahasa ke bahasa Indonesia."
        type="button"
        className={`${s.button as string}, ${
          i18n.language === "id" ? (s.active as string) : ""
        }`}
        onClick={() => switchLanguage()}
      >
        ID
      </button>
    </div>
  );
};

export default LanguageSwitcher;
