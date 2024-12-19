import React from "react";
import cx from "classnames";
import s from "./style.module.scss";

export const Thead: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <thead>{children}</thead>;
};

export const Tbody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

export const Tr: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => {
  return <tr>{children}</tr>;
};

export const Th: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...rest }) => {
  return (
    <th>
      <span {...rest} className={cx(s.table__head, className)}>
        {children}
      </span>
    </th>
  );
};

export const Td: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children }) => {
  return <td>{children}</td>;
};

export const TdSpan: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, ...rest }) => {
  return (
    <td>
      <span {...rest} className={s.table__body__span}>
        {children}
      </span>
    </td>
  );
};

export const Table: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...rest }) => {
  return (
    <div className={cx(s.table__container, className)} {...rest}>
      <table>{children}</table>
    </div>
  );
};
