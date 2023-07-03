import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const Footer = () => {
  const { t } = useTranslation();
  const [year, setYear] = useState(2000);

  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="footer">
      <div className="footer__follow">
        {/* <div className="footer__follow__text">
          {t("translation.footer_follow")}
        </div> */}
        {/* <div className="footer__line" /> */}
        <a
          className="footer__follow__link"
          href="https://www.instagram.com/informatics.uii/"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/assets/icons/bxl-instagram-alt.svg"
            className="follow__follow__icon"
            alt="instagram icon"
            width={30}
            height={30}
          />
        </a>
        <a
          className="footer__follow__link"
          href="https://www.facebook.com/informatics.uii"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/assets/icons/bxl-facebook-square.svg"
            className="follow__follow__icon"
            alt="facebook icon"
            width={30}
            height={30}
          />
        </a>
      </div>
      <div className="footer__copyright__text">
        Copyright © {year} All rights reserved Student Staff for Informatics
        Expo
      </div>
    </footer>
  );
};

export default Footer;
