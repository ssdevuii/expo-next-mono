import React from "react";
import s from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { projects, teams } from "@prisma/client";

/**
 * @param data data karya yang akan ditampilkan.
 */
const PopularCard: React.FC<{
  data: projects & {
    Team: teams;
  };
}> = ({ data }) => {
  const { id, name, Team, gdriveLink } = data;

  return (
    <div className={s.card}>
      <div className={classNames(s.img_wraper, "relative h-[250px] w-auto")}>
        <Image src={gdriveLink} className={s.img} fill alt={`poster ${name}`} />
      </div>

      <div className={s.description}>
        <Link href={`/karya/${id}`} className="h-fit">
          <span className={s.name}>{name}</span>
        </Link>

        <span className={s.team}>{Team.name}</span>

        <div className={s.like_container}>
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
            />
          </svg>
          {/* <span className={s.like}>{likeCount}</span> */}
        </div>
      </div>
    </div>
  );
};

export default PopularCard;
