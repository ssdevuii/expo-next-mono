import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

// * Components
import {
  MultipleInputWrapper,
  Form,
  Input,
  Select,
  Option,
  Submit,
  TextArea,
  ImgFile,
} from "~/components/form/form";
import Head from "next/head";
import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import Loading from "~/components/loading/loading";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const TeamForm = () => {
  const { status } = useSession({ required: true });

  const { t } = useTranslation();
  const router = useRouter();
  const { teamId, id } = router.query;

  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const team = api.team.getById.useQuery(Number(teamId), {
    enabled: status === "authenticated" && teamId != null,
  });

  const expoDate = api.expoDate.getActive.useQuery();
  const categories = api.category.getAll.useQuery();

  const [karyaName, setKaryaName] = useState("");
  const [description, setDescription] = useState<EditorState>();
  const [category, setCategory] = useState(1);

  const [demoURL, setDemoURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [poster, setPoster] = useState(null);

  const [isSubmiting, setIsSubmiting] = useState(false);

  const [{ karyaNameError, posterError }, setErrorMessage] = useState({
    karyaNameError: undefined,
    posterError: undefined,
  });

  const descStateHandler = useCallback((e) => {
    setDescription(e);
  }, []);

  const nameStateHandler = useCallback(
    (e) => {
      const value = e.target.value;
      setKaryaName(value);

      setErrorMessage((s) => ({
        ...s,
        karyaNameError:
          value.length < 5 ? t("karyaForm.form_karyaName_error") : null,
      }));
    },
    [t]
  );

  const categoryStateHandler = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  const videoStateHandler = useCallback((e) => {
    setVideoURL(e.target.value);
  }, []);

  const demoStateHandler = useCallback((e) => {
    setDemoURL(e.target.value);
  }, []);

  const posterStateHandler = useCallback((e) => {
    setPoster(() => {
      setErrorMessage((s) => ({
        ...s,
        posterError: null,
      }));

      return e;
    });
  }, []);

  // * submit
  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();

      setErrorMessage((s) => ({
        ...s,
        posterError: poster === null ? t("karyaForm.form_poster_error") : null,
      }));

      // ! validasi
      // if (poster === null || karyaNameError !== null) return
      // TODO loading
      setIsSubmiting(true);

      try {
        const data = {
          teamId: teamId,
          name: karyaName,
          categoryId: category,
          poster,
          expoDateId: expoDate?.data?.id,
          description: JSON.stringify(
            convertToRaw(description?.getCurrentContent())
          ),
          demoLink: demoURL,
          videoLink: videoURL,
        };
        router.push(`/dashboard/team/${teamId}/undang`);
      } catch (error) {
        alert("Submit error, check your internet connection.");
        setIsSubmiting(false);
        console.dir(error);
      }
    },
    [poster, t, teamId, karyaName, category, expoDate?.data?.id, description, demoURL, videoURL, router]
  );

  useEffect(() => {
    setDescription((d) => d || EditorState.createEmpty());
  }, []);

  return (
    <main className="App">
      <Head>
        <title>
          {t("karyaForm.create_head_title")} - {t("translation.app_title")}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Breadcrumb>
        <Item to="/dashboard">Dashboard</Item>
        {id && (
          <Item to={`/dashboard/project/${String(id)}`}>
            {t("karyaForm.edit_header_title")}
          </Item>
        )}
        {teamId && (
          <Item to={`/dashboard/project/${String(teamId)}`} disabled={true}>
            {t("karyaForm.create_header_title")}
          </Item>
        )}
      </Breadcrumb>

      <section className="page_header">
        <h1 className="page_header_title">
          {id
            ? t("karyaForm.edit_header_title")
            : t("karyaForm.create_header_title")}
        </h1>

        <span className="page_header_desc">
          {t("karyaForm.create_header_desc", { user: user.data?.name ?? "" })}
        </span>
      </section>

      <article className="page_article teamForm">
        <Form className="form" onSubmit={submitHandler} method="post">
          {team.isSuccess && (
            <Input
              value={team?.data?.name}
              disabled={true}
              label={t("karyaForm.form_teamName")}
            />
          )}

          <Input
            value={karyaName}
            error={karyaNameError}
            onChange={nameStateHandler}
            label={t("karyaForm.form_karyaName")}
            name="karyaName"
          />

          <Select
            value={category}
            onChange={categoryStateHandler}
            label={t("karyaForm.form_category")}
          >
            {categories.data?.map(({ name, id }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>

          {expoDate.isSuccess && expoDate.data && (
            <MultipleInputWrapper>
              <Input
                value={`${expoDate.data?.startDate?.getDate()}/${
                  expoDate.data?.startDate?.getMonth() + 1
                }/${expoDate.data?.startDate.getFullYear()} - ${expoDate.data?.endDate?.getDate()}/${
                  expoDate.data?.endDate?.getMonth() + 1
                }/${expoDate.data?.endDate.getFullYear()}`}
                disabled={true}
                label={t("karyaForm.form_period")}
              />

              <Input
                value={String(expoDate?.data.year)}
                disabled={true}
                label={t("karyaForm.form_year")}
              />
            </MultipleInputWrapper>
          )}

          {description && (
            <TextArea
              editorState={description}
              onEditorStateChange={descStateHandler}
              required={true}
              label={t("karyaForm.form_desc")}
            />
          )}

          <Input
            value={demoURL}
            type="url"
            onChange={demoStateHandler}
            required={false}
            label={t("karyaForm.form_demoURL")}
          />

          <Input
            value={videoURL}
            type="url"
            onChange={videoStateHandler}
            required={false}
            label={t("karyaForm.form_videoUrl")}
          />

          {/* TODO: accessibility */}
          <ImgFile
            label={t("karyaForm.form_poster")}
            fileButton={
              poster
                ? t("karyaForm.form_changeButton")
                : t("karyaForm.form_selectButton")
            }
            onChange={posterStateHandler}
            required={false}
            removeBurronLabel={t("karyaForm.form_deleteButton")}
            error={posterError}
          />

          {/* TODO: accessibility */}
          <Submit disabled={isSubmiting}>{t("karyaForm.form_submit")}</Submit>
        </Form>

        {isSubmiting && (
          <Loading className="loading__submit" text="Submitting project" />
        )}
      </article>
    </main>
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
