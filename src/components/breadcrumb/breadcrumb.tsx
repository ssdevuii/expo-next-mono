import React from "react";
import cx from "classnames";
import s from "./style.module.scss";
import Link from "next/link";

export const Item: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  to: string;
}> = ({ children, disabled, to }) => (
  <>
    {disabled ? (
      <span className={cx(s.text, s.text__noHover)}>{children}</span>
    ) : (
      <Link href={to} className={s.text} aria-disabled>
        {children}
      </Link>
    )}
    <span className={s.slash}>/</span>
  </>
);

export const Breadcrumb: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className={s.container}>{children}</div>;
};
