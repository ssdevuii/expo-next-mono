import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { useTranslation } from "next-i18next";

// assets
import plusIcon from "/assets/icons/plus-icon.svg";
import trashIcon from "/assets/icons/trash-icon.svg";

import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import { useRouter } from "next/router";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import MainLayout from "~/layouts/main";

const TeamForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const { status } = useSession({ required: true });
  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {id
              ? t("teamForm.edit_head_title")
              : t("teamForm.create_head_title")}{" "}
            - {t("app_title")}
          </title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <Breadcrumb>
          <Item to="/dashboard">Dashboard</Item>
          {id && (
            <Item to={`/dashboard/karya/${String(id)}`} disabled={true}>
              {t("teamForm.edit_head_title")}
            </Item>
          )}
          {!id && (
            <Item to={`/dashboard/karya`}>
              {t("teamForm.create_head_title")}
            </Item>
          )}
        </Breadcrumb>

        <section className="page_header">
          <h1 className="page_header_title">
            {id
              ? t("teamForm.edit_header_title")
              : t("teamForm.create_header_title")}
          </h1>
          <span className="page_header_desc">
            {t("teamForm.create_header_desc", { user: user.data?.name })}
          </span>
        </section>

        <article className="page_article teamForm">
          {/* <Form className="form" method="GET" onSubmit={() => {}}>
          <Input
            disabled
            value="Fakultas Teknologi Industri"
            label={t("teamForm.form_faculty")}
          />
          <Input
            disabled
            value="Informatika"
            label={t("teamForm.form_study")}
          />
          <Input
            disabled
            value={leaderName}
            label={t("teamForm.form_leader")}
          />

          <Input
            value={teamName}
            onChange={teamNameHandler}
            label={t("teamForm.form_teamName")}
            error={teamNameError}
            name="teamName"
          />

          {subjectAndLecture.map(({ subject, lecturer }, i) => (
            <MultipleInputWrapper key={i} className="double_select_container">
              <Select
                value={subject?.index || 0}
                onChange={(e) => {
                  subjectSelectHandler(e.target.value, i);
                }}
                label={
                  i + 1 > 3
                    ? t("teamForm.form_subjects", { count: i + 1 })
                    : t(`teamForm.form_subjects_${i + 1}`, { count: i + 1 })
                }
              >
                {subjectAndLectureOptions.map(({ id, name }, i) => (
                  <Option value={i} key={i}>
                    {name}
                  </Option>
                ))}
              </Select>

              <Select
                value={lecturer.index || 0}
                onChange={(e) => lecturerSelectHandler(e.target.value, i)}
                label={
                  i + 1 > 3
                    ? t("teamForm.form_lectures", { count: i + 1 })
                    : t(`teamForm.form_lecture_${i + 1}`, { count: i + 1 })
                }
              >
                {subjectAndLectureOptions[subject?.index || 0].lecturers.map(
                  ({ id, user }, i) => (
                    <Option value={i} key={i}>
                      {user.name}
                    </Option>
                  )
                )}
              </Select>
            </MultipleInputWrapper>
          ))}

          <div className="select__action__button__container">
            <button
              className="select__action__button  add"
              onClick={addSubjectLecturerSelect}
              title={t("teamForm.form_lectureSelect_add_title")}
              type="button"
            >
              <img src={plusIcon} alt="add one subject and lecture" />
            </button>

            {subjectAndLecture.length > 1 && (
              <button
                className="select__action__button remove"
                onClick={removeSubjectLecturerSelect}
                title={t("teamForm.form_lectureSelect_remove_title")}
                type="button"
              >
                <img src={trashIcon} alt="remove last subject and lecture" />
              </button>
            )}
          </div>

          <Submit>
            {id ? t("teamForm.form_submit") : t("teamForm.form_edit")}
          </Submit>
        </Form> */}
        </article>
      </main>
    </MainLayout>
  );
};

export default TeamForm;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
