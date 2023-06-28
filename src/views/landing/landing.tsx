import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

// * Components

import LanguageSwitcher from "~/components/languageSwitcher/languageSwitcher";

import axios from "axios";
import Link from "next/link";
import SDGcategorySlider from "~/components/SDGcategorySlider/SDGcategorySlider";
import KaryaCard from "~/components/karyaCard/karyaCard";
import PopularCard from "~/components/popularCard/PopularCard";
import Loading from "~/components/loading/loading";

const Landing = () => {
  const { t } = useTranslation(["translation", "landing"]);
  // const history = useHistory()

  const [popularKarya, setPopularKarya] = useState([]);
  const [latestKarya, setLatestKarya] = useState([]);
  const [valueMatkul, setValueMatkul] = useState();
  const [valueTahun, setValueTahun] = useState();
  const [valueNama, setValueNama] = useState();
  const [subects, setSubects] = useState(["Mata kuliah"]);

  const onMatkulChange = useCallback((e) => {
    setValueMatkul(e);
  }, []);
  const onTahunChange = useCallback((e) => {
    setValueTahun(e);
  }, []);
  const onNamaChange = useCallback((e) => {
    setValueNama(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();

      // history.push(`/pencarian/${valueMatkul || 'matkul'}/${valueTahun || 'tahun'}/${valueNama || ''}`)
    },
    [valueMatkul, valueNama, valueTahun]
  );

  useEffect(() => {
    const fetchSearch = async () => {
      // TODO: impement this
    };

    const fetchProject = async () => {
      // TODO: impement this
    };
  }, []);

  return (
    <main className="App">
      <section className="landing__jumbotron" data-testid="landing-jumbotron">
        <LanguageSwitcher />

        <div className="landing__jumbotron__text">
          <h1 className="landing__jumbotron__title">
            {t("landing:jumbotron_title")}
            <span className="landing__jumbotron__desc">
              {t("landing:jumbotron_subTitle")}
            </span>
          </h1>
        </div>

        {/* <SearchForm className="landing__jumbotron__search" onSubmit={onSubmit}>
          <MatkulSelect onChange={onMatkulChange} value={valueMatkul}>
            {subects}
          </MatkulSelect>

          <YearSelect onChange={onTahunChange} value={valueTahun}>
            {["2022", "2021", "2020", "2019"]}
          </YearSelect>

          <NameInput onChange={onNamaChange} value={valueNama} />
          <SearchButton />
        </SearchForm> */}
      </section>

      <section className="landing_category">
        <div className="landing__section__header">
          <h2 className="landing__section__header__title">
            {t("landing:category_title")}
          </h2>
          <p className="landing__section__header__desc">
            {t("landing:category_desc")}
          </p>
        </div>

        <SDGcategorySlider />
      </section>

      <article className="landing__karya" id="maincontent">
        <div className="landing__section__header">
          <h2 className="landing__section__header__title">
            {t("landing:karya_title")}
          </h2>
          <p className="landing__section__header__desc">
            {t("landing:karya_desc")}
          </p>
        </div>

        <div
          className={`landing__karya__content ${
            latestKarya.length === 0 ? "landing__karya__content--loading" : ""
          }`}
        >
          {latestKarya.length === 0 && <Loading />}
          {latestKarya.map((v, i) => (
            <KaryaCard key={i} data={v} />
          ))}
        </div>

        <Link href="/karya" className="landing__section__more">
          {t("landing:moreButton")}
        </Link>
      </article>

      <section className="landing__popular">
        <div className="landing__section__header">
          <h2 className="landing__section__header__title">
            {t("landing:popular_title")}
          </h2>
          <p className="landing__section__header__desc">
            {t("landing:popular_desc")}
          </p>
        </div>

        <div
          className={`landing__popular__content ${
            popularKarya.length === 0
              ? "landing__popular__content--loading"
              : ""
          }`}
        >
          {popularKarya.length === 0 && <Loading />}
          {popularKarya.map((v, i) => (
            <PopularCard key={i} data={v} />
          ))}
        </div>

        <Link href="/populer" className="landing__section__more">
          {t("landing:moreButton")}
        </Link>
      </section>
    </main>
  );
};

export default Landing;
