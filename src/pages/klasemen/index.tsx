import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";

// * components
import { Table, TdSpan, Thead, Th, Tr, Tbody } from "~/components/table/table";
import Loading from "~/components/loading/loading";
import Head from "next/head";
import { useRouter } from "next/router";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";
import Link from "next/link";
import MainLayout from "~/layouts/main";
import Select from "react-select";

const Standings = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { expoId } = router.query;
  const expoDate = api.expoDate.getAll.useQuery();
  const klasemen = api.klasemen.getBestTen.useQuery({
    id: expoId ? Number(expoId) : undefined,
  });

  const expoDateoprionMemo = useMemo(() => {
    if (!expoDate.data) return [];
    return expoDate.data.map((expo) => ({
      label: expo.name,
      value: expo.id,
    }));
  }, [expoDate.data]);

  const onExpodateChange = (val: string) => {
    void router.push(`/klasemen?expoId=${val}`, undefined, { shallow: true });
  };

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {t("standings.head_title")} - {t("translation.app_title")}
          </title>
        </Head>

        <section className="page_header mb-2" id="maincontent">
          <h1 className="page_header_title">{t("standings.header_title")}</h1>
          <span className="page_header_desc">{t("standings.header_desc")}</span>

          <div className="mx-auto w-fit">
            <Select
              className="w-60"
              options={expoDateoprionMemo}
              onChange={(val) => onExpodateChange(String(val?.value))}
              placeholder="Expo Period"
            ></Select>
          </div>
        </section>

        <article className="page_article mt-2">
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
