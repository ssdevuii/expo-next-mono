import React, { FormEventHandler } from "react";
import { useTranslation } from "next-i18next";
import s from "./style.module.scss";

// * Components
import Select from "react-select";
import classNames from "classnames";
import Image from "next/image";

export const MatkulSelect: React.FC<{
  children: string[];
  value: string;
  onChange: (val: string) => void;
}> = ({ children, value, onChange }) => {
  const { t } = useTranslation();

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <Select
      placeholder={t("translation.search_matkul")}
      classNames={{
        container(props) {
          return classNames("rounded-xl bg-slate-300", s.matkul);
        },
        control(props) {
          return "h-full rounded-xl";
        },
      }}
      options={options}
    />
  );
};

export const YearSelect: React.FC<{
  children: string[];
  value: string;
  onChange: (val: string) => void;
}> = ({ children, value, onChange }) => {
  const { t } = useTranslation();
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <Select
      placeholder={t("translation.search_tahun")}
      classNames={{
        container() {
          return classNames("rounded-xl bg-slate-300", s.tahun);
        },
        control() {
          return "h-full rounded-xl";
        },
        placeholder: () => ``,
      }}
      options={options}
    />
  );
};

export const NameInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <input
      className={classNames(s.input, "border bg-white ")}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      type="text"
      placeholder={t("translation.search_nama")}
    />
  );
};

export const SearchButton = () => {
  const { t } = useTranslation();
  return (
    <button className={classNames(s.searchButton, "relative")} type="submit">
      <div className="relative py-2">
        <Image
          className={s.searchIcon}
          src={"/assets/icons/bx-search-alt 1.svg"}
          alt="search icon"
          width={50}
          height={50}
        />
      </div>
      <span>{t("translation.search_button")}</span>
    </button>
  );
};

export const SearchForm: React.FC<{
  children: React.ReactNode;
  className: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}> = ({ className, onSubmit, children }) => {
  const { t } = useTranslation();
  return (
    <div className={classNames(s.container, className)}>
      <span className={s.lable}>{t("translation.search_label")}</span>
      <form className={s.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};
