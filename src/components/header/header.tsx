import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import classnames from "classnames";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import UserAvatar from "../userAvatar/userAvatar";

// assets
// const Auth = loadable(() => import("../authPopup/authPopup"));
// const UserAvatar = loadable(() => import("../userAvatar/userAvatar"));

const Logo = () => (
  <Link href="/" className="logo__container">
    <picture className="logo__img">
      <source
        media="(min-width:650px)"
        srcSet={"/assets/images/UII-Biru.png"}
      ></source>
      <img src={"/assets/images/UII-Biru.png"} alt="Logo UII" />
    </picture>

    <div className="logo__text">
      <span>INFORMATICS</span>
      <span>EXPO</span>
    </div>
  </Link>
);

// const MobileNav = ({ isUserLoggedIn, isOnLoginPage, onLogout, onLogin }) => {
//   const { t, ready } = useTranslation("translation", { useSuspense: false });
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const drawerOpenHandler = () => {
//     setIsDrawerOpen(true);
//   };
//   const drawerCloseHandler = () => {
//     setIsDrawerOpen(false);
//   };

//   return (
//     <>
//       <button
//         className="header__button header__button--polos"
//         onClick={drawerOpenHandler}
//         tabIndex={-1}
//       >
//         <svg viewBox="0 0 24 24">
//           <path
//             fill="currentColor"
//             d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
//           />
//         </svg>
//       </button>

//       <ul
//         className={classnames(
//           "nav__ul",
//           "nav__ul__mobile",
//           isDrawerOpen && "nav__ul__mobile--active"
//         )}
//         tabIndex={-1}
//         aria-hidden={!isDrawerOpen}
//       >
//         <li className="header__li mobile-header">
//           <Logo />

//           <button
//             className="header__button header__button--polos"
//             onClick={drawerCloseHandler}
//           >
//             <svg viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
//               />
//             </svg>
//           </button>
//         </li>

//         <li className="header__li">
//           <NavLink
//             className="header__link"
//             activeClassName="header__button--active"
//             exact
//             to="/"
//             onClick={drawerCloseHandler}
//           >
//             {ready && t("nav_beranda")}
//           </NavLink>
//         </li>

//         <li className="header__li">
//           <NavLink
//             className="header__link"
//             activeClassName="header__button--active"
//             to="/klasemen"
//             onClick={drawerCloseHandler}
//           >
//             {ready && t("nav_klasemen")}
//           </NavLink>
//         </li>

//         {isUserLoggedIn && (
//           <>
//             <li className="header__li">
//               <NavLink
//                 className="header__link"
//                 activeClassName="header__button--active"
//                 onClick={drawerCloseHandler}
//                 to="/dashboard"
//               >
//                 Dashboard
//               </NavLink>
//             </li>

//             <li className="header__li">
//               <button
//                 className="header__button"
//                 onClick={() => {
//                   drawerCloseHandler();
//                   onLogout();
//                 }}
//               >
//                 {ready && t("user_logout")}
//               </button>
//             </li>
//           </>
//         )}

//         {!isUserLoggedIn && isOnLoginPage && (
//           <li className="header__li">
//             <button
//               className="header__button"
//               onClick={() => {
//                 drawerCloseHandler();
//                 onLogin();
//               }}
//             >
//               {ready && t("nav_signIn")}
//             </button>
//           </li>
//         )}
//       </ul>
//     </>
//   );
// };

const Header = () => {
  const { t } = useTranslation();
  const [styleOnTop, setStyleOnTop] = useState("");
  const { data: user, status } = useSession();

  const [isAuthPopoupVisible, setisAuthPopoupVisible] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setStyleOnTop(y > 0 ? "shadow" : "");
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <header
      className={classnames("header", "top-0", styleOnTop)}
      data-testid="header-header"
    >
      <nav className="nav">
        <Logo />

        {/* <MobileNav
          isOnLoginPage={isOnLoginPage}
          isUserLoggedIn={isUserLogedIn}
          onLogin={openAuthPopup}
          onLogout={logoutHandler}
        /> */}

        <ul className="nav__ul nav__ul__desktop">
          <li className="header__li">
            <Link
              className="header__link"
              // activeClassName="header__button--active"
              href="/"
            >
              {t("translation.nav_beranda")}
            </Link>
          </li>

          <li className="header__li">
            <Link
              className="header__link"
              // activeClassName="header__button--active"
              href="/klasemen"
            >
              {t("translation.nav_klasemen")}
            </Link>
          </li>

          <li className="header__li">
            {status == "authenticated" && <UserAvatar />}
            {status == "unauthenticated" && (
              <button
                type="button"
                className="header__button"
                onClick={() => void signIn()}
              >
                {t("translation.nav_signIn")}
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
