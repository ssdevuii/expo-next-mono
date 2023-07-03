import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
// import { FacebookShareButton, TwitterShareButton } from "react-share";
// import { EditorState, convertFromRaw } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import classnames from "classnames";

// * assets
// import imgLoad from "../../assets/images/img-placeholder.svg";
// import newTabIcon from "../../assets/icons/open_in_new-black-18dp.svg";
// import fbIcon from "../../assets/icons/fb-blue-squere.svg";
// import twitterIcon from "../../assets/icons/twitter-blue-squere.svg";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Head from "next/head";
import Image from "next/image";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Img = ({ src, alt }: { alt: string; src: string }) => (
  <div className="karyaContent__poster">
    <div className="karyaContent__poster__imgWrapper">
      <Image
        src={src}
        className="karyaContent__poster__img"
        alt={`poster ${alt}`}
        fill
      />
    </div>
  </div>
);

// const Desc = ({ desc }) => {
//   const { t } = useTranslation(["karya"]);
//   return (
//     <div className="karyaContent__desc">
//       <h2 className="karyaContent__title">{t("karya:decription")}</h2>
//       <Editor
//         wrapperClassName="karyaContent__desc__wrapper"
//         editorClassName="karyaContent__desc__wrapper__editor"
//         editorState={desc}
//         toolbarHidden={true}
//         readOnly={true}
//       />
//     </div>
//   );
// };

// const Info = ({
//   subjects,
//   category,
//   videoLink,
//   demoLink,
//   createdDate,
//   lecturers,
// }) => {
//   const { t } = useTranslation(["karya"]);
//   return (
//     <div className="karyaContent__info">
//       <h2 className="karyaContent__title">{t("karya:information")}</h2>
//       <div className="karyaContent__info__list">
//         <ul>
//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             <div className="list__subList">
//               {subjects.map((obj) => (
//                 <span className="list__subList__span" key={obj.id}>
//                   {obj.subject.name}
//                 </span>
//               ))}
//             </div>
//           </li>

//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             <div className="list__subList">
//               {lecturers.map(({ lecturer }, i) => (
//                 <span className="list__subList__span" key={i}>
//                   {lecturer.user.name}
//                 </span>
//               ))}
//             </div>
//           </li>

//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             {/* TODO: buat translation */}
//             <span className="list__text">{category}</span>
//           </li>
//         </ul>

//         <ul>
//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             {videoLink ? (
//               <a
//                 className="list__text list__text--link"
//                 target="_blank"
//                 rel="noreferrer"
//                 href={videoLink}
//               >
//                 Video
//                 <img className="list__img" src={newTabIcon} alt="new tab" />
//               </a>
//             ) : (
//               <span className="list__text list__text--link">Video</span>
//             )}
//           </li>

//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             {demoLink ? (
//               <a
//                 className="list__text list__text--link"
//                 target="_blank"
//                 rel="noreferrer"
//                 href={demoLink}
//               >
//                 Demo
//                 <img className="list__img" src={newTabIcon} alt="new tab" />
//               </a>
//             ) : (
//               <span className="list__text list__text--link">Demo</span>
//             )}
//           </li>

//           <li className="karyaContent__info__list__li">
//             <span className="list__squere" />
//             <span className="list__text">
//               {createdDate.slice(0, 10).replaceAll("-", "/")}
//             </span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// const Team = ({ members }) => {
//   const { t } = useTranslation(["karya"]);
//   return (
//     <div className="karyaContent__team">
//       <h2 className="karyaContent__title">{t("karya:team")}</h2>
//       <div className="karyaContent__team__members">
//         {members.map(({ status, user }, i) => {
//           return (
//             status === 1 && (
//               <div key={i} className="team__member">
//                 <img
//                   alt={user.name}
//                   src={user.profilePicture}
//                   className="team__member__avatar"
//                 />
//                 <div className="team__member__info">
//                   <span className="team__member__info__name">{user.name}</span>
//                   <span className="team__member__info__desc">
//                     {user.identityNumber} -{" "}
//                     {user.roleId ? t("karya:leader") : t("karya:member")}
//                   </span>
//                 </div>
//               </div>
//             )
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const Support = ({ isLiked = false, onClick = () => {}, likeCount = 5 }) => {
//   const { t } = useTranslation(["karya"]);

//   return (
//     <div className="karyaContent__support">
//       <h2 className="karyaContent__title">{t("karya:support")}</h2>
//       <div>
//         <button
//           onClick={onClick}
//           disabled={likeCount <= 0 || isLiked}
//           className="support__button"
//         >
//           <div
//             role="img"
//             aria-label="Like button"
//             title="clik!"
//             className={classnames(
//               "support__button__img",
//               isLiked
//                 ? "support__button__img--liked"
//                 : "support__button__img--like"
//             )}
//           />
//           <span className="support__button__span">
//             {t("karya:support_button")}
//           </span>
//         </button>
//         <span className="karya__support__count">
//           {t("karya:support_count", { count: likeCount })}
//         </span>
//       </div>
//     </div>
//   );
// };

// const Share = ({ url, name }) => {
//   const { t } = useTranslation(["karya"]);
//   return (
//     <div className="karyaContent__share">
//       <h2 className="karyaContent__title">{t("karya:share")}</h2>
//       <div className="karyaContent__share__button__container">
//         <FacebookShareButton
//           className="karyaContent__share__button"
//           quote={name}
//           hashtag="#iniHashtag"
//           url={url}
//         >
//           <img src={fbIcon} alt="Facebook icon" />
//         </FacebookShareButton>

//         <TwitterShareButton
//           className="karyaContent__share__button"
//           url={url}
//           title={name}
//           hashtag="#ini #hashtag"
//         >
//           <img src={twitterIcon} alt="Twitter Icon" />
//         </TwitterShareButton>
//       </div>
//     </div>
//   );
// };

const breakpoint = {
  tablet: 768,
};
// * Main
const Karya = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const project = api.project.getById.useQuery(Number(id));

  const [isLiked, setIsLiked] = useState(false);
  // const [BASE_URL] = useState(window.location.href);

  const [likeCount, setLikeCount] = useState(0);
  const [editorState, setEditorState] = useState(null);
  const [likeRemain, setLikeRemain] = useState(5);

  const [windowWidth, setWindowWidth] = useState<number>();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // const checkLikeReamin = useCallback(async () => {}, []);

  // const checkIsLiked = useCallback(async () => {}, []);

  // const handleLike = useCallback(() => {}, []);

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
    <>
      <Head>
        <title>Infomatics Expo</title>
        <meta name="description" content="Deskripsi" />
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

            <div
              className={classnames("karyaHeader__like", "relative flex gap-2")}
            >
              <div className="relative h-6 w-6">
                <Image
                  src={"/assets/icons/heart-solid.svg"}
                  alt="heart icon"
                  className="karyaHeader__like__icon"
                  fill
                />
              </div>
              <span
                className={classnames("karyaHeader__like__number", "relative")}
              >
                {project.data?._count.Likes}
              </span>
            </div>
          </section>
        )}

        <article className="karyaContent">
          {/* FIXME: temp hack, to keep desktop version look better */}

          {/* {windowWidth > breakpoint.tablet ? (
            <>
              <div className="karyaContent_left">
                <Img src={project.gdriveLink} alt={project.name} />
                <Support
                  isLiked={isLiked}
                  onClick={handleLike}
                  likeCount={likeRemain}
                />
                <Share url={BASE_URL} name={project.name} />
              </div>
              <div className="karyaContent_right">
                {editorState && <Desc desc={editorState} />}
                <Info
                  category={project.category.name}
                  createdDate={project.created_at}
                  demoLink={project.demoLink}
                  videoLink={project.videoLink}
                  subjects={project.team.team_subjects}
                  lecturers={project.team.team_subjects}
                />
                <Team members={project.team.members} />
              </div>
            </>
          ) : (
            <>
              <Img src={project.gdriveLink} alt={project.name} />
              <Support
                isLiked={isLiked}
                onClick={handleLike}
                likeCount={likeRemain}
              />
              <Share url={BASE_URL} name={project.name} />
              {editorState && <Desc desc={editorState} />}
              <Info
                category={project.category.name}
                createdDate={project.created_at}
                demoLink={project.demoLink}
                videoLink={project.videoLink}
                subjects={project.team.team_subjects}
                lecturers={project.team.team_subjects}
              />
              <Team members={project.team.members} />
            </>
          )} */}
        </article>
      </main>
    </>
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
