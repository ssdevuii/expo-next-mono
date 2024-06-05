import React from "react";
import Modal from "react-modal";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import classNames from "classnames";
import Image from "next/image";
import App from "next/app";
import { root } from ".eslintrc.cjs";

Modal.setAppElement("#__next");

const LikeModal: React.FC<{ isOpen: boolean; onRequestClose: () => void; projectId: number }> = ({ isOpen, onRequestClose, projectId }) => {
  const { t } = useTranslation();
  const likedBy = api.project.getLikedBy.useQuery(projectId);
//const likedBy = api.project.likeProjectById;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>{t("karya:liked_by")}</h2>
    {likedBy.isLoading ? (
        <p>Loading...</p>
    ) : likedBy.isError ? (
        <p>Error loading data</p>
    ) : (
        <ul className="like-list">
            {likedBy.data?.map((user) => (
                <li key={user.id} className="like-list-item">
                    <Image src={user.User.image ?? ""} alt={user.User.name ?? ""} width={50} height={50} className="like-list-avatar" />
                    <span>{user.User.name}</span>
                </li>
            ))}
        </ul>
    )}
      <button onClick={onRequestClose} className="close-button">
        {t("karya:close")}
      </button>
    </Modal>
  );
};

export default LikeModal;
