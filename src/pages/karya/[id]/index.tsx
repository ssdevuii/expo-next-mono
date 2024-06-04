import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Head from "next/head";
import Image from "next/image";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import classNames from "classnames";
import MainLayout from "~/layouts/main";
import {
  type User,
  type lecturers,
  type members,
  type subjects,
  type teamSubjects,
} from "@prisma/client";
import { useSession } from "next-auth/react";

const CustomEditor = dynamic(
  () => import("~/components/editor/custom-editor"),
  {
    ssr: false,
  }
);

const Img: React.FC<{ alt: string; src: string }> = ({ src, alt }) => (
  <div
    className={classNames("karyaContent__poster", "relative  overflow-hidden")}
  >
    <div
      className={classNames(
        "karyaContent__poster__imgWrapper",
        "relative overflow-hidden rounded-lg"
      )}
    >
      <Image
        src={src}
        className="karyaContent__poster__img"
        alt={`poster ${alt}`}
        unoptimized
        fill
      />
    </div>
  </div>
);

const Desc: React.FC<{ desc: string }> = ({ desc }) => {
  const { t } = useTranslation();
  return (
    <div className="karyaContent__desc">
      <h2 className="karyaContent__title">{t("karya.decription")}</h2>
      <div className="karyaContent__desc__wrapper">
        <CustomEditor
          className={classNames(
            "karyaContent__desc__wrapper__editor",
            "leading-5"
          )}
          state={desc}
        />
      </div>
    </div>
  );
};

const Info: React.FC<{
  subjects: (teamSubjects & {
    Subject: subjects;
    Lecturer: lecturers & {
      User: User;
    };
  })[];
  category: string;
  videoLink: string;
  demoLink: string;
  createdDate: Date;
}> = ({ subjects, category, videoLink, demoLink, createdDate }) => {
  const { t } = useTranslation(["karya"]);
  return (
    <div className="karyaContent__info">
      <h2 className="karyaContent__title">{t("karya:information")}</h2>
      <div className="karyaContent__info__list">
        <ul>
          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <div className="list__subList">
              {subjects.map((obj) => (
                <span className="list__subList__span" key={obj.id}>
                  {obj.Subject.name}
                </span>
              ))}
            </div>
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <div className="list__subList">
              {subjects.map(({ Lecturer }, i) => (
                <span className="list__subList__span" key={i}>
                  {Lecturer.User.name}
                </span>
              ))}
            </div>
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <span className="list__text">{category}</span>
          </li>
        </ul>

        <ul>
          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            {videoLink ? (
              <a
                className="list__text list__text--link"
                target="_blank"
                rel="noreferrer"
                href={videoLink}
              >
                <div className="flex flex-nowrap">
                  Video
                  <Image
                    className={classNames("list__img", "mr-0 w-fit")}
                    src="/assets/icons/open_in_new-black-18dp.svg"
                    alt="new tab"
                    width={18}
                    height={18}
                  />
                </div>
              </a>
            ) : (
              <span className="list__text list__text--link">Video</span>
            )}
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            {demoLink ? (
              <a
                className={classNames(
                  "list__text list__text--link",
                  "flex cursor-pointer flex-nowrap"
                )}
                target="_blank"
                rel="noreferrer"
                href={demoLink}
              >
                <div className="flex flex-nowrap">
                  Demo
                  <Image
                    className={classNames("list__img", "mr-0 w-fit")}
                    src="/assets/icons/open_in_new-black-18dp.svg"
                    alt="new tab"
                    width={18}
                    height={18}
                  />
                </div>
              </a>
            ) : (
              <span className="list__text list__text--link">Demo</span>
            )}
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <span className="list__text">
              {createdDate.getDate()}/{createdDate.getMonth() + 1}/
              {createdDate.getFullYear()}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Team: React.FC<{
  members: (members & {
    User: User;
  })[];
}> = ({ members }) => {
  const { t } = useTranslation();
  return (
    <div className="karyaContent__team">
      <h2 className="karyaContent__title">{t("karya.team")}</h2>
      <div className="karyaContent__team__members">
        {members.map(({ status, User }, i) => {
          return (
            status !== "Invited" && (
              <div key={i} className="team__member">
                <div className="relative mr-3 h-12 w-12">
                  <Image
                    alt={User.name ?? ""}
                    src={User.image ?? ""}
                    className="team__member__avatar"
                    loading="lazy"
                    fill
                  />
                </div>
                <div className="team__member__info">
                  <span className="team__member__info__name">{User.name}</span>
                  <span className="team__member__info__desc">
                    {User.identityNumber} -{" "}
                    {/* {User.roleId ? t("karya.leader") : t("karya.member")} */}
                  </span>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

// perbaikan like disini
const Support = ({ id }: { id: number }) => {
  const { t } = useTranslation();
  const { status } = useSession();

  const likeRemain = api.user.likeRemain.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const isLiked = api.project.isProjectLiked.useQuery(id, {
    enabled: status === "authenticated",
  });

  const likeProjectMutation = api.project.likeProjectById.useMutation();

  const handleLike = () => {
    likeProjectMutation.mutateAsync(id).finally(() => {
      void likeRemain.refetch();
      void isLiked.refetch();
    });
  };

  return (
    <div className="karyaContent__support">
      <h2 className="karyaContent__title">{t("karya:support")}</h2>
      {status == "authenticated" ? (
        <div>
          <button
            onClick={handleLike}
            disabled={(likeRemain?.data ?? 1) <= 0 || isLiked?.data != null}
            className={classNames("support__button", "disabled:cursor-default")}
          >
            <div
              role="img"
              aria-label="Like button"
              title="clik!"
              className={classNames(
                "support__button__img",
                isLiked?.data != null
                  ? "support__button__img--liked"
                  : "support__button__img--like"
              )}
            />
            <span className="support__button__span">
              {t("karya.support_button")}
            </span>
          </button>
          <span className="karya__support__count">
            {t("karya.support_count", { count: likeRemain?.data })}
          </span>
        </div>
      ) : (
        <div>
          <span>Please login first!</span>
        </div>
      )}
    </div>
  );
};

const Share: React.FC<{
  name: string;
}> = ({ name }) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (window !== undefined) {
      setUrl(window.location.href);
    }
  }, []);

  return (
    <div className="karyaContent__share">
      <h2 className="karyaContent__title">{t("karya:share")}</h2>
      <div className="karyaContent__share__button__container">
        <FacebookShareButton
          className="karyaContent__share__button"
          quote={name}
          hashtag="#iniHashtag"
          url={url}
        >
          <Image
            src="/assets/icons/fb-blue-squere.svg"
            alt="Facebook icon"
            width={44}
            height={44}
          />
        </FacebookShareButton>

        <TwitterShareButton
          className="karyaContent__share__button"
          url={url}
          title={name}
          // hashtag="#ini #hashtag"
        >
          <Image
            src="/assets/icons/twitter-blue-squere.svg"
            alt="Twitter Icon"
            width={44}
            height={44}
          />
        </TwitterShareButton>
      </div>
    </div>
  );
};

const breakpoint = {
  tablet: 768,
};
// * Main
const Karya = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const project = api.project.getById.useQuery(Number(id), {
    enabled: id != null,
  });

  const [windowWidth, setWindowWidth] = useState<number>(0);

  const handleResize = () => {
    if (window != undefined) {
      setWindowWidth(window.innerWidth);
    }
  };

  useEffect(() => {
    if (window != undefined) {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <MainLayout>
      <Head>
        <title>{t("translation.app_title")}</title>
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="App">
        {project.isSuccess && (
          <section className="karyaHeader" id="maincontent">
            <h1 className="karyaHeader__title">{project.data?.name}</h1>
            <span className="karyaHeader__team">
              {t("karya.by")} {project.data?.Team.name}
            </span>

{/* penambahan lihat siapa yang like */}
{/* Buat percabangan untuk heaer like, jadi ketika database expoDate id kurang dari expoDate id yang sekarang maka tampilkan yang dulu */}
            <div
              className={classNames("karyaHeader__like", "relative flex flex-col")}
            >
              <div className = "flex items-center">
                <div className="relative h-6 w-6">
                  <Image
                    src={"/assets/icons/heart-solid.svg"}
                    alt="heart icon"
                    className="karyaHeader__like__icon"
                    fill
                  />
                </div>
                <span
                  className={classNames("karyaHeader__like__number", "relative")}
                >
                  {project.data?._count.Likes}
                </span>
              </div>
              <a
                href="#"
                className="karyaHeader_viewLikes"
                onClick={(e) => {
                  e.preventDefault();
                    // Toggle popup visibility
                    // const popup = document.getElementById("likes-popup");
                    // popup.classList.toggle("hidden");
                }}
              >
                Lihat Likes
              </a>
            </div>
          </section>
        )}

        <article className="karyaContent">
          {/* FIXME: temp hack, to keep desktop version look better */}

          {project.isSuccess && windowWidth > breakpoint.tablet ? (
            <>
              <div className="karyaContent_left">
                <Img
                  src={project.data?.gdriveLink ?? ""}
                  alt={project.data?.name ?? ""}
                />
                <Support id={Number(id)} />
                <Share name={project.data?.name ?? ""} />
              </div>
              <div className="karyaContent_right">
                <Desc desc={project.data?.description ?? ""} />
                {project.data && (
                  <Info
                    category={project.data?.Category.name ?? ""}
                    createdDate={project.data?.created_at ?? new Date()}
                    demoLink={project.data?.demoLink ?? ""}
                    videoLink={project.data?.videoLink ?? ""}
                    subjects={project.data?.Team.TeamSubjects}
                  />
                )}
                <Team members={project.data?.Team.Members ?? []} />
              </div>
            </>
          ) : (
            project.isSuccess && (
              <>
                <Img
                  src={project.data?.gdriveLink ?? ""}
                  alt={project.data?.name ?? ""}
                />
                <Support id={Number(id)} />
                <Share name={project.data?.name ?? ""} />
                <Desc desc={project.data?.description ?? ""} />
                {project.data && (
                  <Info
                    category={project.data?.Category.name ?? ""}
                    createdDate={project.data?.created_at ?? new Date()}
                    demoLink={project.data?.demoLink ?? ""}
                    videoLink={project.data?.videoLink ?? ""}
                    subjects={project.data?.Team.TeamSubjects}
                  />
                )}
                <Team members={project.data?.Team.Members ?? []} />
              </>
            )
          )}
        </article>
      </main>
    </MainLayout>
  );
};

export default Karya;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
