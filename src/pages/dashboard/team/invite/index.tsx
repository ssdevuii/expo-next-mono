import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Head from "next/head";
import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import { Form, Input, Submit } from "~/components/form/form";
import { Table, Tbody, Td, Th, Thead, Tr } from "~/components/table/table";
import Alert from "~/components/alert/alert";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "~/layouts/main";

const Invite = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { status } = useSession({ required: true });

  const { teamId } = router.query;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [invitedName, setInvitedName] = useState("");
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);

  const [cancelId, setCancelId] = useState<null | number>(null);

  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const invitations = api.team.getInvitedMemberByTeamId.useQuery(
    Number(teamId),
    { enabled: teamId != null }
  );

  const sendInvitation = api.team.sendInvitation.useMutation();
  const cancleInvitation = api.team.cancleInvitation.useMutation();

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const emailValidation = /.+@students\.uii\.ac\.id/;
    if (emailValidation.test(e.target.value)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    setEmail(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (invitations.isSuccess) {
      sendInvitation
        .mutateAsync({
          teamId: Number(teamId),
          email: email,
        })
        .then(() => {
          alert("Invitation sent!");
        })
        .catch((err) => {
          console.error(err);
          alert("Invitation error! please check console.");
        });
    } else {
      console.error("LOL INVITATION ERROR, don't invite other team");
      alert("Invitation error! please check console.");
    }
  };

  const showAlert = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      to: string,
      id: number
    ) => {
      e.preventDefault();
      console.log("file: index.tsx:75 ~ Invite ~ id:", id);
      setCancelId(id);
      setInvitedName(` ${to}`);
      setIsAlertDisplayed(true);
    },
    []
  );

  const closeAlert = useCallback(() => {
    setInvitedName("");
    setCancelId(null);
    setIsAlertDisplayed(false);
  }, []);

  const onAlertAccept = useCallback(() => {
    setIsAlertDisplayed(false);
    if (cancelId != null) {
      cancleInvitation
        .mutateAsync(cancelId)
        .then(() => {
          setCancelId(null);
          alert("Invitation revoke!");
        })
        .catch((err) => {
          setCancelId(null);
          console.error(err);
          alert("Invitation error! please check console.");
        });
    }
  }, [cancelId, cancleInvitation]);

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {t("invite.head_title")} - {t("translation.app_title")}
          </title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <Alert isDisplayed={isAlertDisplayed} onClose={closeAlert}>
          <Alert.Text>
            {t("invite.action_alert_text", { user: invitedName })}
            {/* <Alert.Bold>{invitedName}</Alert.Bold> */}
          </Alert.Text>

          <Alert.ActionContainer>
            <Alert.Button type="accept" onClick={onAlertAccept}>
              {t("invite.action_alert_accept")}
            </Alert.Button>
            <Alert.Button type="reject" onClick={closeAlert}>
              {t("invite.action_alert_reject")}
            </Alert.Button>
          </Alert.ActionContainer>
        </Alert>

        <Breadcrumb>
          <Item to="/dashboard">Dashboard</Item>
          <Item to={`/dashboard/team/${String(teamId)}/invite`}>
            {t("invite.head_title")}
          </Item>
        </Breadcrumb>

        <section className="page_header">
          {/* TODO: ganti nama tim dynamic */}
          <h1 className="page_header_title">
            {t("invite.header_title", { team: "test" })}
          </h1>
          <span className="page_header_desc">
            {t("invite.header_desc", { user: user.data?.name })}
          </span>

          <Form className="invite__form mx-auto" onSubmit={handleSubmit}>
            <Input
              label={t("invite.form_eamil")}
              value={email}
              name="email"
              type="email"
              error={
                emailError
                  ? "Please provide only Students e-mail address"
                  : undefined
              }
              onChange={emailChangeHandler}
              placeholder="nim@students.uii.ac.id"
            />
            {/* TODO: accessibility */}
            <Submit disabled={emailError} className="invite__form__submit">
              {t("invite.form_submit")}
            </Submit>
          </Form>
        </section>

        <article className="page_article invite">
          <Table className="invite__table">
            <Thead>
              <Tr>
                <Th className="invite__thead__th">#</Th>
                <Th className="invite__thead__th">
                  {t("invite.tableHead_to")}
                </Th>
                <Th className="invite__thead__th">
                  {t("invite.tableHead_status")}
                </Th>
                <Th className="invite__thead__th">
                  {t("invite.tableHead_action")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {invitations.data?.map(({ id, status, User }, i) => (
                <Tr key={id}>
                  <Td>
                    <span className="invite__table__span">{i + 1}</span>
                  </Td>

                  <Td>
                    <span className="invite__table__span">{User.email}</span>
                  </Td>

                  <Td>
                    <span className="invite__table__span">
                      {status == "Member" ||
                        (status == "Leader" &&
                          t("invite.tableHead_status_acepted"))}
                      {status == "Invited" &&
                        t("invite.tableHead_status_waiting")}
                      {/* : t("invite.tableHead_status_decline") */}
                    </span>
                  </Td>

                  <Td>
                    {/* TODO: accessibility */}
                    {i != 0 && (
                      <form className="invite__table__action" method="POST">
                        {/* TODO: tidak ada button jika status diterima. */}
                        <button
                          type="button"
                          className="invite__table__action__button decline"
                          onClick={(e) => showAlert(e, User.email ?? "", id)}
                        >
                          {t("invite.action_cancel")}
                        </button>
                      </form>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </article>
      </main>
    </MainLayout>
  );
};

export default Invite;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
