import React from "react";
import { useTranslation } from "next-i18next";
import s from "./style.module.scss";

import Image from "next/image";

const Loading: React.FC<{ text: string | null; className: string }> = ({
  text = null,
  className = "",
}) => {
  const { t } = useTranslation();
  return (
    <div className={`${s.container as string} ${className}`}>
      <div className={`${s.img__wrapper as string} relative`}>
        <Image
          src="/assets/icons/loading.svg"
          alt="Loading"
          className={s.img}
          fill
        />
      </div>
      {text ? (
        <span className={s.text}>{text}</span>
      ) : (
        <span className={s.text}>{t("translation.loading_text")}</span>
      )}
    </div>
  );
};

export default Loading;
