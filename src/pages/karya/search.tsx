import React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import KaryaCard from "~/components/karyaCard/karyaCard";
import Loading from "~/components/loading/loading";
import Head from "next/head";
import MainLayout from "~/layouts/main";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const SearchKarya = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { name, year, subject } = router.query;
  console.log(
    "file: search.tsx:17 ~ SearchKarya ~ name, year, subject:",
    name,
    year,
    subject
  );
  const projects = api.project.search.useQuery({
    name: name ? String(name) : undefined,
    year: year ? Number(year) : undefined,
    subjectId: subject ? Number(subject) : undefined,
  });

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {t("listKarya.head_title")} - {t("translation.app_title")}
          </title>
        </Head>

        <section className="page_header" id="maincontent">
          <h1 className="page_header_title">{t("listKarya.title")}</h1>

          <span className="page_header_desc">{t("listKarya.desc")}</span>
        </section>

        <article className={classNames("page_article", "listKaryaArticle")}>
          {projects?.isLoading && <Loading />}

          <div className="listKaryaArticle__content">
            {projects.data?.map((v, i) => (
              <KaryaCard
                key={v.id}
                data={v}
                // imgWrapperClassName="card__imgWrapper"
                descClassName="card__desc"
                buttonClassName="card__button"
              />
            ))}
          </div>
          {/* <Pagination
            links={pageLinks}
            prevPage={prevPage}
            nextPage={nextPage}
            setCurrentPage={setCurrentPage}
          /> */}
        </article>
      </main>
    </MainLayout>
  );
};

export default SearchKarya;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
