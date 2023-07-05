import React, { useMemo, useState } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import { useRouter } from "next/router";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import MainLayout from "~/layouts/main";
import {
  Form,
  Input,
  MultipleInputWrapper,
  Option,
  Select,
  Submit,
} from "~/components/form/form";

const TeamForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const { status } = useSession({ required: true });

  const createTeamMutation = api.team.createTeam.useMutation();
  const subjects = api.subject.getAll.useQuery();
  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const [teamName, setTeamName] = useState("");
  const [subjectAndLecturer, setSubjectAndLecturer] = useState<
    { lecturerId: number; subjectId: number }[]
  >([]);

  const subjectOptionMemo = useMemo(() => {
    if (subjects.data == null || subjectAndLecturer == null) return [];
    return subjects.data;
  }, [subjectAndLecturer, subjects.data]);

  const handleTeamName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void createTeamMutation
      .mutateAsync({ name: teamName, subjectAndLecturer })
      .then(({ id }) => {
        return void router.push(`/dashboard/project?teamId=${id}`);
      })
      .catch((err) => {
        console.error(err);
        alert("gagal membuat tim, cek cosole untuk detailnya");
      });
  };

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {id
              ? t("teamForm.edit_head_title")
              : t("teamForm.create_head_title")}{" "}
            - {t("translation.app_title")}
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
          <Form className="form" method="GET" onSubmit={handleSubmit}>
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
              value={user.data?.name ?? ""}
              label={t("teamForm.form_leader")}
            />

            <Input
              value={teamName}
              onChange={handleTeamName}
              label={t("teamForm.form_teamName")}
              // error={teamNameError}
              name="teamName"
            />

            {subjectAndLecturer.map(({ lecturerId, subjectId }, i) => (
              <MultipleInputWrapper key={i} className="double_select_container">
                <Select
                  value={subjectId ?? 0}
                  onChange={(e) => {
                    setSubjectAndLecturer((s) => {
                      if (s[i] != undefined) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        s[i].subjectId = Number(e.target.value);
                      }
                      return [...s];
                    });
                  }}
                  label={
                    i + 1 > 3
                      ? t("teamForm.form_subjects", { count: i + 1 })
                      : t(`teamForm.form_subjects_${i + 1}`, { count: i + 1 })
                  }
                >
                  <Option value={0}>-</Option>
                  {subjectOptionMemo.map(({ id, name }, i) => (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  ))}
                </Select>

                <Select
                  value={lecturerId ?? 0}
                  onChange={(e) => {
                    setSubjectAndLecturer((s) => {
                      if (s[i] != undefined) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        s[i].lecturerId = Number(e.target.value);
                      }
                      return [...s];
                    });
                  }}
                  label={
                    i + 1 > 3
                      ? t("teamForm.form_lectures", { count: i + 1 })
                      : t(`teamForm.form_lecture_${i + 1}`, { count: i + 1 })
                  }
                >
                  <Option value={0}>-</Option>
                  {[
                    subjectOptionMemo.find((sub) => sub.id == subjectId),
                  ][0]?.Lecturers.map(({ id, User }, i) => (
                    <Option value={id} key={id}>
                      {User.name}
                    </Option>
                  ))}
                </Select>
              </MultipleInputWrapper>
            ))}

            <div className="select__action__button__container">
              <button
                className="select__action__button  add flex items-center justify-center"
                onClick={() =>
                  setSubjectAndLecturer((s) => [
                    ...s,
                    { lecturerId: 0, subjectId: 0 },
                  ])
                }
                title={t("teamForm.form_lectureSelect_add_title")}
                type="button"
              >
                <img
                  src={"/assets/icons/plus-icon.svg"}
                  alt="add one subject and lecture"
                />
              </button>

              <button
                className="select__action__button remove flex items-center justify-center"
                title={t("teamForm.form_lectureSelect_remove_title")}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setSubjectAndLecturer((s) => {
                    return [...s.slice(0, -1)];
                  });
                }}
              >
                <img
                  src={"/assets/icons/trash-icon.svg"}
                  alt="remove last subject and lecture"
                />
              </button>
            </div>

            <Submit>
              {id ? t("teamForm.form_submit") : t("teamForm.form_edit")}
            </Submit>
          </Form>
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
