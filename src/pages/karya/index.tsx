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

const ListKarya = () => {
  const { t } = useTranslation();
  const projects = api.project.getLatest.useQuery(100);

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

export default ListKarya;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
