import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Head from "next/head";
import { Breadcrumb, Item } from "~/components/breadcrumb/breadcrumb";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import MainLayout from "~/layouts/main";
import { type GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";

const Dashboard = () => {
  const { status } = useSession({ required: true });
  const { t } = useTranslation();
  const user = api.user.getOwnProfile.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const teams = api.team.getOwnTeam.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const invitationCount = api.team.getInvitationCount.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const deleteTeam = api.team.deleteTeam.useMutation();

  const handleDeleteTeam = (teamId: number) => {
    if (confirm("Delete Team?")) {
      deleteTeam
        .mutateAsync(teamId)
        .then(() => {
          alert("Delete Team Success");
        })
        .catch((err) => {
          console.error(err);
          alert("Delete Team Failed");
        });
    }
  };

  return (
    <MainLayout>
      <main className="App" id="maincontent">
        <Head>
          <title>
            {t("dashboard.head_title")} - {t("app_title")}
          </title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <Breadcrumb>
          <Item to="/dashboard">Dashboard</Item>
        </Breadcrumb>

        <section className="page_header">
          <h1 className="page_header_title">{t("dashboard.header_title")}</h1>
          <span className="page_header_desc">
            {t("dashboard.header_desc", { user: user.data?.name })}
          </span>
        </section>

        <article className="page_article dashboard">
          <div className="dashboard__header">
            <Link href="/dashboard/team" className="dashboard__header__button">
              {t("dashboard.button_createNewTeam")}
            </Link>
            <Link
              href="/dashboard/invitation"
              className="dashboard__header__button blue"
            >
              {t("dashboard.button_invitation")}
              <span className="invitaiton__count">{invitationCount.data}</span>
            </Link>
          </div>

          {teams.data?.length === 0 && "No Teams"}
          <div className="dashboard__card__container">
            {teams.data?.map((team, i) => (
              <div
                key={team.id}
                className={`dashboard__card ${
                  team.Projects.length == 0 ? "noKarya" : ""
                }`}
              >
                <div className="dashboard__card__header">
                  <h2 className="dashboard__card__header__team">{team.name}</h2>

                  <div className={`w-full`}>
                    {team.Projects?.map((project) => (
                      <div
                        key={project.id}
                        className="line-clamp-2 flex w-full justify-between"
                      >
                        <div>
                          <span className="circle" />
                          <span className="dashboard__card__desc__category">
                            {project?.Category.name}
                          </span>
                        </div>
                        <div>
                          <span className="circle" />
                          <span className="dashboard__card__desc__name">
                            {!project
                              ? t("dashboard.card_noKarya")
                              : project.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard__card__members">
                  <span className="dashboard__card__members__title">
                    {t("dashboard.card_team")}
                  </span>
                  <div className="dashboard__card__member__list">
                    {team.Members?.map(({ status, User }, i) => {
                      return (
                        status === "Leader" && (
                          <div className="member" key={User.id}>
                            <span className="name">{User.name}</span>
                            <span className="role">{status}</span>
                          </div>
                        )
                      );
                    })}
                  </div>

                  {team.Projects && team.Members.length <= 4 && (
                    <Link
                      href={`/dashboard/team/invite?teamId=${team.id}`}
                      className="dashboard__card__members__invite"
                      title={t("dashboard.card_buttonCompleteTheKarya")}
                    >
                      + invite
                    </Link>
                  )}
                </div>

                <div className="dashboard__card__action">
                  {team.Projects.length == 0 ? (
                    <Link
                      href={`/dashboard/project?teamId=${team.id}`}
                      className="action__button"
                      title={t("dashboard.card_buttonCompleteTheKarya")}
                    >
                      {t("dashboard.card_buttonCompleteTheKarya")}
                    </Link>
                  ) : (
                    <Link
                      // href={`/dashboard/karya/${team.Projects.id}`}
                      href="#"
                      className="action__button"
                      title={t("dashboard.card_buttonEditKarya")}
                    >
                      {t("dashboard.card_buttonEditKarya")}
                    </Link>
                  )}

                  {/* <button className="action__button--disabeled">{t('dashboard.card_buttonEditTeam')}</button> */}
                  <Link
                    href={`/dashboard/team/${team.id}`}
                    className="action__button"
                    title={t("dashboard.card_buttonEditTeam")}
                  >
                    {t("dashboard.card_buttonEditTeam")}
                  </Link>

                  <button
                    className="relative flex h-10 w-10 rounded-md bg-slate-500 p-2"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Image
                      src={"/assets/icons/trash-icon.svg"}
                      alt="remove file"
                      className="block h-6 w-6"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </main>
    </MainLayout>
  );
};

export default Dashboard;

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale as string)),
    },
  };
};
