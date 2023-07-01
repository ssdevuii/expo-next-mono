import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import s from "./style.module.scss";

// * Hooks
import useClickOutside from "~/hooks/useClickOutside";

interface OptionProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  value: string;
  selected: boolean;
  onClick: () => void;
}

const Option: React.FC<OptionProps> = ({
  children,
  value,
  selected = false,
  onClick,
  className,
  ...rest
}) => {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div
      {...rest}
      onClick={handleClick}
      tabIndex={-1}
      className={classNames(s.option, className)}
      role="option"
      aria-label={String(children)}
      data-value={value}
      aria-selected={selected}
    >
      {children || value}
    </div>
  );
};

const idFormater = (id: string) => id.replace?.(" ", "_");

interface CustomSelectProps {
  children: string[];
  value: string;
  wrapperClassName: string;
  onChange: (val: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  children = ["N", "O", "_", "V", "A", "L", "U", "E"],
  value,
  wrapperClassName,
  onChange,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [activedescendant, setActivedescendant] = useState("");

  const focusItem = useCallback(
    (element: Element) => {
      onChange(element.getAttribute("data-value") ?? "");
      setActivedescendant(element.id);

      // ? NGAPAIN
      if (selectRef.current?.scrollHeight > selectRef.current?.clientHeight) {
        const scrollBottom =
          selectRef.current?.clientHeight + selectRef.current?.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;

        if (elementBottom > scrollBottom) {
          selectRef.current.scrollTop =
            elementBottom - selectRef.current.clientHeight;
        } else if (element.offsetTop < selectRef.current.scrollTop) {
          selectRef.current.scrollTop = element.offsetTop;
        }
      }
    },
    [onChange]
  );

  const onOptionVisible = useCallback(() => {
    setIsOptionVisible(true);
    selectRef.current?.focus();
  }, []);

  const onOptionHidden = useCallback(() => {
    setIsOptionVisible(false);
    selectRef.current?.blur();
  }, []);

  const onPopupButtonClick: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        e.preventDefault();
        onOptionVisible();
      },
      [onOptionVisible]
    );

  const handleOptionClick = useCallback(
    (e: string) => {
      setActivedescendant(idFormater(e));
      onChange(e);
      onOptionHidden();
    },
    [onChange, onOptionHidden]
  );

  const keyDownEvent: React.KeyboardEventHandler<HTMLDivElement> = useCallback(
    (ev) => {
      ev.preventDefault();
      let nextItem = selectRef.current?.querySelector(
        `#${idFormater(activedescendant)}`
      );

      switch (ev.key) {
        case "Escape":
          onOptionHidden();
          break;
        case "ArrowDown":
        case "ArrowUp":
          if (ev.key === "ArrowUp") {
            nextItem = nextItem?.previousElementSibling;
          } else {
            nextItem = nextItem?.nextElementSibling;
          }

          if (nextItem) {
            focusItem(nextItem);
          }
          break;
        case "Home":
          const firstItem = selectRef.current?.querySelector('[role="option"]');

          if (firstItem) {
            focusItem(firstItem);
          }

          break;
        case "End":
          const itemList =
            selectRef.current?.querySelectorAll('[role="option"]') ?? [];

          if (itemList.length > 1) {
            focusItem(itemList[itemList.length - 1] as Element);
          }
          break;
        case "Enter":
          onOptionHidden();
          break;
        case " ":
          onOptionHidden();
          break;
        default:
          onOptionHidden();
          break;
      }
    },
    [activedescendant, focusItem, onOptionHidden]
  );

  useClickOutside<HTMLDivElement>(selectRef, () => {
    onOptionHidden();
  });

  useEffect(() => {
    if (!value) {
      onChange(children[0] ?? "");
      setActivedescendant(idFormater(children[0] ?? ""));
    }
  }, [activedescendant, children, onChange, value]);

  return (
    <div className={classNames(s.select, wrapperClassName)}>
      <button
        className={s.optionLable}
        aria-haspopup="listbox"
        onClick={onPopupButtonClick}
        aria-expanded={isOptionVisible}
      >
        {value}
      </button>

      <div
        role="listbox"
        ref={selectRef}
        data-value={value}
        tabIndex={-1}
        aria-activedescendant={activedescendant}
        className={classNames(s.optionGroup, isOptionVisible && s.show)}
        onKeyDown={keyDownEvent}
      >
        {children.map((option, i) => (
          <Option
            key={i}
            id={idFormater(option)}
            onClick={() => handleOptionClick(option)}
            className={
              idFormater(option) === activedescendant
                ? s.active
                : value === option
                ? s.active
                : ""
            }
            value={option}
            selected={option === value}
          >
            {option}
          </Option>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
