import React from "react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import { Table, Tbody, Td, Th, Thead, Tr } from "~/components/table/table";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MainLayout from "~/layouts/main";

const Invitation = () => {
  const { status } = useSession({ required: true });
  const { t } = useTranslation();
  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const invitations = api.team.getInvitation.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const acceptInvitationMutation = api.team.acceptInvitation.useMutation();
  const rejectInvitationMutation = api.team.cancleInvitation.useMutation();

  const acceptInvitation = async (invitationId: number) => {
    await acceptInvitationMutation.mutateAsync(invitationId);
    await invitations.refetch();
  };

  const rejectinvitation = async (invitationId: number) => {
    await rejectInvitationMutation.mutateAsync(invitationId);
    await invitations.refetch();
  };

  return (
    <MainLayout>
      <main className="App">
        <Head>
          <title>
            {t("invitation.head_title")} - {t("app_title")}
          </title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {/* <Alert isDisplayed={isAlertDisplayed} onClose={closeAlert}>
        <Alert.Text>
          Tolak undangan dari tim <Alert.Bold>{alertMessage}</Alert.Bold>
        </Alert.Text>

        <Alert.ActionContainer>
          <Alert.Button type="accept" onClick={rejectInvitation}>
            Ya
          </Alert.Button>
          <Alert.Button type="reject" onClick={closeAlert}>
            Tidak
          </Alert.Button>
        </Alert.ActionContainer>
      </Alert> */}

        <Breadcrumb>
          <Item to="/dashboard">Dashboard</Item>
          <Item to="/dashboard/invitation">Undangan</Item>
        </Breadcrumb>

        <section className="page_header">
          <h1 className="page_header_title">{t("invitation.header_title")}</h1>
          <span className="page_header_desc">
            {t("invitation.header_desc", { user: user.data?.name })}
          </span>
        </section>

        <article className="page_article invitation">
          <Table className="invitation__table">
            <Thead>
              <Tr>
                <Th className="invitation__thead__th">#</Th>
                <Th className="invitation__thead__th">
                  {t("invitation.tableHead_invitation")}
                </Th>
                <Th className="invitation__thead__th">
                  {t("invitation.tableHead_action")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {invitations.data?.map(({ Team, id }, i) => (
                <Tr key={id}>
                  <Td>
                    <span className="invitation__table__span">{i + 1}</span>
                  </Td>

                  <Td>
                    <span className="invitation__table__span">{Team.name}</span>
                  </Td>

                  <Td>
                    <form className="invitation__table__action" method="POST">
                      {/* TODO: pas diterima */}
                      <button
                        type="button"
                        className="invitation__table__action__button accept"
                        onClick={(e) => {
                          e.preventDefault();
                          void acceptInvitation(id);
                        }}
                        title={t("invitation.action_accept_title", {
                          name: Team.name,
                        })}
                      >
                        {t("invitation.action_accept")}
                      </button>

                      <button
                        type="button"
                        className="invitation__table__action__button decline"
                        onClick={(e) => {
                          e.preventDefault();
                          void rejectinvitation(id);
                        }}
                        title={t("invitation.action_reject_title", {
                          name: Team.name,
                        })}
                      >
                        {t("invitation.action_reject")}
                      </button>
                    </form>
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

export default Invitation;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
