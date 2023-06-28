import React from "react";
import s from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";

/**
 * @param data data karya yang akan ditampilkan.
 */
const PopularCard = ({
  data,
}: {
  data: {
    id: string;
    name: string;
    team: { name: string };
    gdriveLink: string;
    likeCount: number;
  };
}) => {
  const { id, name, team, gdriveLink, likeCount } = data;

  return (
    <div className={s.card}>
      <div className={s.img_wraper}>
        <Image
          src={"/assets/images/img-placeholder.svg"}
          className={s.img}
          fill
          alt={`poster ${name}`}
        />
      </div>
      <div className={s.description}>
        <Link className={s.name} href={`/karya/${id}`}>
          {name}
        </Link>
        <span className={s.team}>{team.name}</span>
        <div className={s.like_container}>
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
            />
          </svg>
          <span className={s.like}>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PopularCard;
