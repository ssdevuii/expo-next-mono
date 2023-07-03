import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import s from './style.module.scss'

// * components

// * assets
import searchIcon from '../../assets/icons/bx-search-alt 1.svg'
export const SemesterSelect = ({ children, onChange, value }) => {
  const { t } = useTranslation()
  return (
    <CustomSelect wrapperClassName={s.matkul} label={t('standing_shorter_semester')} onChange={onChange} value={value}>
      {children}
    </CustomSelect>
  )
}

export const YearSelect = ({ children, onChange, value }) => {
  const { t } = useTranslation()
  return (
    <CustomSelect wrapperClassName={s.tahun} label={t('standing_shorter_year')} onChange={onChange} value={value}>
      {children}
    </CustomSelect>
  )
}

export const StandingShorter = ({ children, onSubmit = () => {} }) => {
  const { t } = useTranslation()

  return (
    <div className={cx(s.container)}>
      <span className={s.lable}>{t('standing_shorter_label')}</span>
      <form className={s.form} onSubmit={onSubmit}>
        {children}
        <button className={s.searchButton} type="submit">
          <img className={s.searchIcon} src={searchIcon} alt="search icon" />
          <span>{t('standing_shorter_submit')}</span>
        </button>
      </form>
    </div>
  )
}
