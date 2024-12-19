import React from "react";
import s from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import { type teams } from "@prisma/client";

/**
 * @param data data karya yang akan ditampilkan.
 */
const PopularCard: React.FC<{
  data: {
    id: number;
    _count: {
      Likes: number;
    };
    name: string;
    Team: teams;
    gdriveLink: string;
  };
}> = ({ data }) => {
  const { id, name, Team, gdriveLink, _count } = data;

  return (
    <div className={s.card}>
      <div className={classNames(s.img_wraper, "relative h-[250px] w-auto")}>
        <Image src={gdriveLink} className={s.img} fill alt={`poster ${name}`} />
      </div>

      <div className="flex flex-col justify-between gap-2 text-white">
        <Link href={`/karya/${id}`} className="h-fit">
          <span className="font-semibold text-white">{name}</span>
        </Link>

        <div className="flex justify-between">
          <span className={classNames(s.team, "text-sm")}>{Team.name}</span>

          <div
            className={classNames(s.like_container, "flex items-center gap-1")}
          >
            <span className={s.like}>{_count.Likes}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCard;
