import React from "react";
import { useTranslation } from "next-i18next";
import s from "./style.module.scss";

const SkipToContent = () => {
  const { t, ready } = useTranslation("accessibility", { useSuspense: false });

  return (
    <a href="#maincontent" className={s.skipLink}>
      {ready && t("accessibility:skipToContent")}
    </a>
  );
};

export default SkipToContent;
