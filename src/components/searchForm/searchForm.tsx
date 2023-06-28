import React from "react";
import { useTranslation } from "next-i18next";
import s from "./style.module.scss";

// * Components
import CustomSelect from "../customSelect/customSelect";

// * assets
import searchIcon from "../../assets/icons/bx-search-alt 1.svg";

export const MatkulSelect = ({ children, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <CustomSelect
      wrapperClassName={s.matkul}
      label={t("search_matkul")}
      onChange={onChange}
      value={value}
    >
      {children}
    </CustomSelect>
  );
};
MatkulSelect.propTypes = {
  children: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export const YearSelect = ({ children, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <CustomSelect
      wrapperClassName={s.tahun}
      label={t("search_tahun")}
      onChange={onChange}
      value={value}
    >
      {children}
    </CustomSelect>
  );
};
YearSelect.propTypes = {
  children: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export const NameInput = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <input
      className={s.input}
      onChange={onChange}
      value={value}
      type="text"
      placeholder={t("search_nama")}
    />
  );
};
NameInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export const SearchButton = () => {
  const { t } = useTranslation();
  return (
    <button className={s.searchButton} type="submit">
      <img className={s.searchIcon} src={searchIcon} alt="search icon" />
      <span>{t("search_button")}</span>
    </button>
  );
};

export const SearchForm = ({ className, onSubmit, children }) => {
  const { t } = useTranslation();
  return (
    <div className={cx(s.container, className)}>
      <span className={s.lable}>{t("search_label")}</span>
      <form className={s.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};
