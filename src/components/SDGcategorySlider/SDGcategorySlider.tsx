import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import s from "./style.module.scss";
import { useTranslation } from "next-i18next";

// assets
import SDG_data from "~/data/SDG";
import Link from "next/link";

const toggleDisable = (click) => {
  click.preventDefault();
  click.stopPropagation();
};

// TODO: more better way to to detect touch and mouse.
const SDGcategorySlider = () => {
  const { t } = useTranslation("SDG");
  const containerRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [styleTouchUser, setstyleTouchUser] = useState("");

  const onFirstTouch = useCallback(() => {
    setstyleTouchUser(s.user__touch);

    // we only need to know once that a human touched the screen, so we can stop listening now
    window.removeEventListener("touchstart", onFirstTouch, false);
  }, []);

  const toggleCliclOnDrag = useCallback((enable = false) => {
    const slider = containerRef.current.querySelector("#container-slider");

    if (enable) {
      slider.childNodes.forEach((link) => {
        link.addEventListener("click", toggleDisable);
      });
    } else {
      slider.childNodes.forEach((link) => {
        link.removeEventListener("click", toggleDisable);
      });
    }
  }, []);

  const getDragVAlue = useCallback(
    (e) => {
      toggleCliclOnDrag(true);
      setTranslateX((s) => {
        const result = s + e.movementX;
        return result <= 0 && sliderWidth + result >= 0 ? result : s;
      });
    },
    [sliderWidth, toggleCliclOnDrag]
  );

  const toggleDrag = useCallback(() => {
    // if draged
    containerRef.current.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      toggleCliclOnDrag();
      containerRef.current.addEventListener("mousemove", getDragVAlue);
    });

    // if not draged
    containerRef.current.addEventListener("mouseup", (e) => {
      e.stopPropagation();
      containerRef.current.removeEventListener("mousemove", getDragVAlue);
    });
  }, [getDragVAlue, toggleCliclOnDrag]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const slider = container.querySelector("#container-slider");

    window.addEventListener("touchstart", onFirstTouch, false);
    setSliderWidth(slider.offsetWidth - container.offsetWidth);
    container.addEventListener("mouseenter", toggleDrag);

    return () => {
      container.removeEventListener("mouseenter", toggleDrag);
      window.removeEventListener("touchstart", onFirstTouch, false);
    };
  }, [onFirstTouch, toggleDrag]);

  return (
    <div className={s.container} ref={containerRef}>
      <div
        id="container-slider"
        style={{ transform: `translate3D(${translateX}px, 0, 0)` }}
        className={s.slider}
      >
        {SDG_data.map(({ id, translation_id, imgSrc }) => (
          <Link
            key={id}
            className={s.card}
            href={`/kategori/${id}`}
            draggable="false"
          >
            <img
              className={s.image}
              src={imgSrc}
              draggable="false"
              alt="dummy"
            />
            <span className={s.title} draggable="false">
              {t(`SDG:${translation_id}`)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SDGcategorySlider;
