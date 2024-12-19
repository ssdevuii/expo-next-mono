import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import useClickOutside from "../../hooks/useClickOutside";
import s from "./style.module.scss";
import { signOut, useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";

const UserAvatar = () => {
  const { data: user } = useSession();
  const profile = api.user.getOwnProfile.useQuery();
  const { t, ready } = useTranslation();

  const [isDetailDisplayed, setIsDetailDisplayed] = useState(false);
  const detailRef = useRef(null);
  useClickOutside(detailRef, () => setIsDetailDisplayed(false));

  const closeHandler = useCallback(() => {
    setIsDetailDisplayed((s) => !s);
  }, []);

  const openHandler = useCallback(() => {
    if (!isDetailDisplayed) {
      setIsDetailDisplayed(true);
    }
  }, [isDetailDisplayed]);

  const logoutClickHandler = useCallback(() => {
    void signOut();
  }, []);

  return (
    <>
      <div className={classNames(s.container)}>
        <div className={s.user__avatar}>
          <Image
            className={s.user__avatar__img}
            src={user?.user.image ?? ""}
            alt={user?.user.name ?? ""}
            referrerPolicy="no-referrer"
            width={100}
            height={100}
          />

          <button
            aria-label={t("accessibility.userAvatar_buttonExpand")}
            title={ready ? t("accessibility.userAvatar_buttonExpand") : ""}
            className={classNames(
              s.button,
              s.button__polos,
              !isDetailDisplayed && s.button__polos__active
            )}
            onClick={openHandler}
          >
            {" "}
            <Image
              src={"/assets/icons/more-down.svg"}
              alt="more icon"
              width={50}
              height={50}
            />
          </button>

          <button
            aria-label={t("accessibility.userAvatar_buttonClose")}
            title={t("accessibility.userAvatar_buttonClose")}
            onKeyDown={(e) => {
              e.preventDefault();
              if (e.key === "Enter" || e.key === " ") {
                closeHandler();
              }
            }}
            className={classNames(
              s.button,
              s.button__polos,
              s.button__polos__rotate180,
              isDetailDisplayed && s.button__polos__active,
              "relative"
            )}
          >
            <Image
              src={"/assets/icons/more-down.svg"}
              alt="more icon"
              width={50}
              height={50}
            />
          </button>
        </div>

        <div
          ref={detailRef}
          className={classNames(
            s.user__detail,
            isDetailDisplayed ? s.active : ""
          )}
        >
          <div className={s.header}>
            <Image
              className={s.avatar}
              src={user?.user.image ?? ""}
              alt={user?.user.name ?? ""}
              referrerPolicy="no-referrer"
              width={100}
              height={100}
            />

            <div className={s.desc}>
              <span className={s.name}>{user && user.user.name}</span>
              <span className={s.nim}>{profile.data?.identityNumber}</span>
            </div>
          </div>

          {profile.isSuccess && profile.data?.Role.id !== 3 && (
            <Link
              className={classNames(s.button, s.link, s.dashboard)}
              href="/dashboard"
              onClick={closeHandler}
            >
              {t("translation.user_dashboard")}
            </Link>
          )}

          <button
            className={classNames(s.button, s.link, s.logout)}
            onClick={logoutClickHandler}
          >
            {t("translation.user_logout")}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserAvatar;
