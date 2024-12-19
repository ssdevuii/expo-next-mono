import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { useTranslation } from "next-i18next";
import { api } from "~/utils/api";
import Image from "next/image";
import s from "./style.module.scss";
// import classNames from "classnames";
// import App from "next/app";
// import { root } from ".eslintrc.cjs";


Modal.setAppElement("#__next");

const LikeModal: React.FC<{ isOpen : boolean; onRequestClose: () => void; projectId: number }> = ({ isOpen, onRequestClose, projectId }) => {
  const { t } = useTranslation();
  const likedBy = api.project.getLikedBy.useQuery(projectId);

  if (!isOpen) {
    return null;
  }

  const uniqueUsers = likedBy.data ? Array.from(new Set(likedBy.data.map(user => user.User.id)))
    .map(id => likedBy.data.find(user => user.User.id === id)) : [];

  const modalContent=(
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={s.modal} overlayClassName={s.modalOverlay}>
      <button onClick={onRequestClose} className={s.modal__closeButton}>×</button>
      <div className={s.modal__viewLikes}>
        <h2 className={s.modal__viewLikes__title}>{t("Liked By")}</h2>
        {likedBy.isLoading ? (
          <p>Loading...</p>
        ) : likedBy.isError ? (
          <p>Error loading data</p>
        ) : (
          <ul className={s.modal__likeList}>
            {uniqueUsers.map((user) => (
              <li key={user?.User.id} className={s.modal__likeList__item}>
                <Image src={user?.User.image ?? ""} alt={user?.User.name ?? ""} width={50} height={50} className={s.modal__likeList__avatar} />
                <span>{user?.User.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
    
  return ReactDOM.createPortal(modalContent, document.body);

};

export default LikeModal;
