import React from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";

// assets
import Link from "next/link";

const imageOnLoad = (e) => {
  e.target.classList.remove(s.before_loaded);
};

/**
 * @param data data yang akan di tampilkan di dalam card.
 */

const KaryaCard = ({
  data,
  imgWrapperClassName = "",
  buttonClassName = "",
  descClassName = "",
}) => {
  const { t } = useTranslation();
  const { id, name, poster, team, gdriveLink, category } = data;
  const { team_subjects } = team;

  return (
    <div className={s.card}>
      <img
        className={cx(s.img, s.before_loaded)}
        src={gdriveLink}
        placeholderSrc={"/assets/images/poster-load-bg.svg"}
        alt={`poster ${poster}`}
        wrapperClassName={cx(s.image_wraper, imgWrapperClassName)}
        onLoad={imageOnLoad}
      />
      <div className={(s.description, descClassName)}>
        <ul>
          <li>
            <h3 className={s.name}>{name}</h3>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.team}>{team.name}</span>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.categories}>{category.name}</span>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.matkuls}>
              {team_subjects.map(({ subject }, i) => {
                return `${subject.name}${
                  i === team_subjects.length - 1 ? "" : ", "
                }`;
              })}
            </span>
          </li>
        </ul>
      </div>
      <Link href={`/karya/${id}`} className={(s.link, buttonClassName)}>
        {t("karyaCard_detailButton")}
      </Link>
    </div>
  );
};

export default KaryaCard;
