import React from "react";
import { useTranslation } from "react-i18next";
import s from "./style.module.scss";

import Image from "next/image";

const Loading = ({ text = null, className = "" }) => {
  const { t, ready } = useTranslation("translation", { useSuspense: false });
  return (
    <div className={`${s.container as string} ${className}`}>
      <div className={s.img__wrapper}>
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
        <span className={s.text}>{ready && t("loading_text")}</span>
      )}
    </div>
  );
};

export default Loading;
