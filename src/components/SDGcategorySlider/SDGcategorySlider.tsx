import React from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";
import Link from "next/link";

// assets
import SDG_data from "~/data/SDG";
import Image from "next/image";

const SDGcategorySlider = () => {
  const { t } = useTranslation();

  return (
    <div className={s.container}>
      <div id="container-slider" className={s.slider}>
        {SDG_data.map(({ id, translation_id, imgSrc }) => (
          <Link
            key={id}
            className={`${s.card as string}`}
            href={`/karya/SDG?id=${id}`}
            draggable="false"
          >
            <div className=" relative h-56">
              <Image
                className={`${s.image as string} h-full w-auto`}
                src={imgSrc}
                draggable="false"
                alt="dummy"
                fill
              />
            </div>
            <span className={s.title} draggable="false">
              {t(`SDG.${translation_id}`)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SDGcategorySlider;
