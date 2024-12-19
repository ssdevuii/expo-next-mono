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
import MainLayout from "~/layouts/main";
import { useS3Upload } from "next-s3-upload";

const TeamForm = () => {
  const { status } = useSession({ required: true });

  const { t } = useTranslation();
  const router = useRouter();
  const { teamId, id } = router.query;

  const [file, setFile] = useState<File>();
  const { uploadToS3 } = useS3Upload();
  const [karyaName, setKaryaName] = useState("");
  const [description, setDescription] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const [category, setCategory] = useState(1);

  const [demoURL, setDemoURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const team = api.team.getById.useQuery(Number(teamId), {
    enabled: status === "authenticated" && teamId != null,
  });
  const createProjectMutation = api.project.create.useMutation();

  const expoDate = api.expoDate.getActive.useQuery();
  const categories = api.category.getAll.useQuery();

  const [{ karyaNameError, posterError }, setErrorMessage] = useState<{
    karyaNameError?: string;
    posterError?: string;
  }>({
    karyaNameError: undefined,
    posterError: undefined,
  });

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  const descStateHandler = useCallback((e: EditorState) => {
    setDescription(e);
  }, []);

  const nameStateHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setKaryaName(value);

      setErrorMessage((s) => ({
        ...s,
        karyaNameError:
          value.length < 5 ? t("karyaForm.form_karyaName_error") : undefined,
      }));
    },
    [t]
  );

  const categoryStateHandler = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategory(Number(e.target.value));
    },
    []
  );

  const videoStateHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVideoURL(e.target.value);
    },
    []
  );

  const demoStateHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDemoURL(e.target.value);
    },
    []
  );

  const handleCreate = async () => {
    try {
      if (expoDate?.data?.id && teamId && file) {
        const { url } = await uploadToS3(file);
        await createProjectMutation.mutateAsync({
          teamId: Number(teamId),
          name: karyaName,
          categoryId: category,
          poster: file.name,
          gdriveLink: url,
          expoDateId: expoDate?.data?.id,
          description: JSON.stringify(
            convertToRaw(description?.getCurrentContent())
          ),
          demoLink: demoURL,
          videoLink: videoURL,
        });

        void router.push(`/dashboard/team/invite?teamId=${String(teamId)}`);
      }
    } catch (error) {
      alert("Submit error, see console for detail.");
      setIsSubmiting(false);
      console.dir(error);
    }
  };

  // * submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setIsSubmiting(true);
    void handleCreate();
  };

  return (
    <MainLayout>
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
          <Form className="form" onSubmit={handleSubmit} method="post">
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
              required
            />

            <Select
              value={category}
              onChange={categoryStateHandler}
              label={t("karyaForm.form_category")}
              required
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
              required
              label={t("karyaForm.form_demoURL")}
            />

            <Input
              value={videoURL}
              type="url"
              onChange={videoStateHandler}
              required
              label={t("karyaForm.form_videoUrl")}
            />

            {/* TODO: accessibility */}
            <ImgFile
              label={t("karyaForm.form_poster")}
              fileButton={
                file
                  ? t("karyaForm.form_changeButton")
                  : t("karyaForm.form_selectButton")
              }
              maxSize={20000000}
              onChange={handleFileChange}
              required={true}
              removeBurronLabel={t("karyaForm.form_deleteButton")}
              error={posterError}
            />

            {/* <div>
              <FileInput
                onChange={handleFileChange}
                accept=".png, .jpg, .jpeg"
              />

              <button onClick={openFileDialog}>Upload file</button>

              {imageUrl && <img src={imageUrl} />}
            </div> */}

            {/* TODO: accessibility */}
            <Submit disabled={isSubmiting}>{t("karyaForm.form_submit")}</Submit>
          </Form>

          {isSubmiting && (
            <Loading className="loading__submit" text="Submitting project" />
          )}
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
