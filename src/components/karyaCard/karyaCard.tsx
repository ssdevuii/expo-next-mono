import React from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  type categories,
  type projects,
  type subjects,
  type teamSubjects,
  type teams,
} from "@prisma/client";
import Image from "next/image";
import classNames from "classnames";

// const imageOnLoad = (e) => {
//   e.target.classList.remove(s.before_loaded);
// };

const KaryaCard: React.FC<{
  data: projects & {
    Team: teams & { TeamSubjects: (teamSubjects & { Subject: subjects })[] };
    Category: categories;
  };
  buttonClassName?: string;
  descClassName?: string;
}> = ({ data, buttonClassName = "", descClassName = "" }) => {
  const { t } = useTranslation();
  const { id, name, poster, Team, gdriveLink, Category } = data;
  const { TeamSubjects } = Team;

  return (
    <div className={s.card}>
      <div className="relative min-w-[190px] max-w-[200px]">
        <Image
          unoptimized
          className={classNames(s.img, s.before_loaded)}
          src={gdriveLink}
          placeholder={"empty"}
          alt={`poster ${poster}`}
          // onLoad={imageOnLoad}
          fill
        />
      </div>
      <div className={classNames(s.description, descClassName)}>
        <ul>
          <li>
            <h3 className={s.name}>{name}</h3>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.team}>{Team.name}</span>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.categories}>{Category.name}</span>
          </li>
          <li>
            <span className={s.circle} />
            <span className={s.matkuls}>
              {TeamSubjects.map(({ Subject }, i) => {
                return `${Subject.name}${
                  i === TeamSubjects.length - 1 ? "" : ", "
                }`;
              })}
            </span>
          </li>
        </ul>
      </div>
      <Link
        href={`/karya/${id}`}
        className={classNames(s.link, buttonClassName)}
      >
        {t("translation.karyaCard_detailButton")}
      </Link>
    </div>
  );
};

export default KaryaCard;
