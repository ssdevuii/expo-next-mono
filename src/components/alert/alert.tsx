import React from "react";
import classNames from "classnames";
import s from "./style.module.scss";
import Image from "next/image";

const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  type: "accept" | "reject";
}> = ({ children, onClick, type }) => (
  <button
    onClick={onClick}
    className={classNames(
      s.alert__button,
      type === "accept"
        ? s.alert__button__accept
        : type === "reject" && s.alert__button__reject
    )}
  >
    {children}
  </button>
);

const Action: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={s.alert__action}>{children}</div>
);

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={s.alert__body}>
    <span className={s.alert__body__text}>{children}</span>
  </div>
);
const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className={s.alert__body__text__bold}>{children}</span>
);

const Alert: React.FC<{
  children: React.ReactNode;
  isDisplayed: boolean;
  onClose: () => void;
}> & {
  Text: React.FC<{ children: React.ReactNode }>;
  Bold: React.FC<{ children: React.ReactNode }>;
  ActionContainer: React.FC<{ children: React.ReactNode }>;
  Button: typeof Button;
} = ({ children, isDisplayed, onClose }): JSX.Element => {
  // close and open state
  return (
    <div className={classNames(s.container, isDisplayed && s.isDisplayed)}>
      <div className={s.alert}>
        <button
          className={s.alert__close}
          title="close alert"
          onClick={onClose}
        >
          <Image
            className={s.alert__close__icon}
            src={"/assets/icons/close.svg"}
            alt="close"
            width={24}
            height={24}
          />
        </button>

        {children}
        {/* Body di sini */}
        {/* Action dan button di sini! */}
      </div>
    </div>
  );
};

Alert.Text = Text;
Alert.Bold = Bold;
Alert.ActionContainer = Action;
Alert.Button = Button;

export default Alert;
