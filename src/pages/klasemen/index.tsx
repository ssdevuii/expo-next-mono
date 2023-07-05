import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// * components
import { Table, TdSpan, Thead, Th, Tr, Tbody } from "~/components/table/table";
// import {
//   StandingShorter,
//   SemesterSelect,
//   YearSelect,
// } from "~/components/standingShorter/standingShorter";
import Loading from "~/components/loading/loading";
import Head from "next/head";
import { useRouter } from "next/router";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";
import Link from "next/link";
import MainLayout from "~/layouts/main";

const getYearsFrom = (yearStart = 2010) => {
  const timeNow = new Date().getFullYear();
  const listYear: string[] = [];
  for (let i = yearStart; i <= timeNow; i++) {
    listYear.push(i.toString());
  }
  return listYear;
};

const Standings = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tahun, semester } = router.query;
  const klasemen = api.klasemen.getBestTen.useQuery({ semester: 5, year: 4 });

  const semesterOptions = [
    t("standing_shorter_semester"),
    // t('standing_shorter_semester_odd'),
    t("standing_shorter_semester_even"),
  ];
  const yearOptions = ["Tahun", ...getYearsFrom(2021).reverse()];

  const [standings, setStandings] = useState([]);
  const [semesterValue, setSemesterValue] = useState(semester);
  const [yearValue, setYearValue] = useState(tahun);

  const onSemesterChange = useCallback((e) => {
    setSemesterValue(e);
  }, []);

  const onYearChange = useCallback((e) => {
    setYearValue(e);
  }, []);

  const onSubmit = useCallback(() => {
    // e.preventDefault();
    void router.push(
      `/klasemen?year${String(yearValue)}&semester=${String(semesterValue)}`
    );
  }, [router, semesterValue, yearValue]);

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {t("standings.head_title")} - {t("translation.app_title")}
          </title>
        </Head>

        <section className="page_header" id="maincontent">
          <h1 className="page_header_title">{t("standings.header_title")}</h1>
          <span className="page_header_desc">{t("standings.header_desc")}</span>

          {/* <StandingShorter onSubmit={onSubmit}>
          <SemesterSelect value={semesterValue} onChange={onSemesterChange}>
            {semesterOptions}
          </SemesterSelect>
          <YearSelect value={yearValue} onChange={onYearChange}>
            {yearOptions}
          </YearSelect>
        </StandingShorter> */}
        </section>

        <article className="page_article">
          {/* <h2 className="page_article_title standing__article__title">
            {t("standings.semester", { semester, tahun })}
          </h2> */}

          {klasemen.isLoading ? (
            <Loading />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>{t("standings.table_name")}</Th>
                  <Th>{t("standings.table_team")}</Th>
                  {/* <Th>{t('standings.table_matkul')}</Th> */}
                  <Th>Category</Th>
                  <Th>{t("standings.table_like")}</Th>
                </Tr>
              </Thead>

              <Tbody className="standing__table__body">
                {klasemen.data?.map(
                  ({ id, name, Team, _count, Category }, i) => (
                    <Tr key={i}>
                      <TdSpan>{i + 1}</TdSpan>
                      <TdSpan>
                        <Link href={`/karya/${id}`}>{name}</Link>
                      </TdSpan>
                      <TdSpan>{Team.name}</TdSpan>
                      <TdSpan>{Category.name}</TdSpan>
                      <TdSpan>{_count.Likes}</TdSpan>
                    </Tr>
                  )
                )}
              </Tbody>
            </Table>
          )}

          {/* <div className="standing__article__info">
          <span className="standing__article__info__span">
            {t("standings.info", {
              time: "Selasa 15 Januari 2021 jam 15.00 WIB",
            })}
          </span>
          <span className="standing__article__info__span">
            {t("standings.term")}
          </span>
        </div> */}
        </article>
      </main>
    </MainLayout>
  );
};

export default Standings;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
