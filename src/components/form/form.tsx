/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import s from "./style.module.scss";
// import { Editor } from "react-draft-wysiwyg";
import classNames from "classnames";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "draft-js";

const Label: React.FC<{
  children: React.ReactNode;
  className?: string;
  label: string;
  required?: boolean;
}> = ({ label = "label", children, required = true, ...rest }) => (
  <label className={s.label}>
    <span
      className={classNames(s.label__span, required ? s.required : s.optional)}
      {...rest}
    >
      {label}
    </span>
    {children}
  </label>
);

const Input: React.FC<{
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
}> = ({
  label = "input",
  value = "",
  onChange,
  required = true,
  type,
  placeholder,
  error,
  name = "",
  ...rest
}) => (
  <Label label={label} required={required}>
    <input
      className={classNames(
        s.input__text,
        "disabled:text-slate-500",
        error && s.error
      )}
      onChange={onChange}
      value={value}
      name={name}
      required={required}
      type={type || "text"}
      placeholder={placeholder || ""}
      {...rest}
    />
    {error && <span className={s.label__error}>{error}</span>}
  </Label>
);

const MultipleInputWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "", ...rest }) => (
  <div className={classNames(s.double__input__wrapper, className)} {...rest}>
    {children}
  </div>
);

// * SELECT
const Select: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
}> = ({
  children,
  label = "select",
  value = "",
  onChange,
  required = true,
  error,
}) => (
  <Label label={label} required={required}>
    <select
      className={s.select}
      value={value}
      onChange={onChange}
      required={required}
    >
      {children}
    </select>
    {error && <span className={s.label__error}>{error}</span>}
  </Label>
);

const Option: React.FC<{
  children: React.ReactNode;
  value?: string | number;
  selected?: boolean;
}> = ({ value = "", children = null, selected }) => (
  <option value={value} className={s.option} selected={selected}>
    {children || value}
  </option>
);

const TextArea: React.FC<{
  editorState: EditorState;
  onEditorStateChange: (editorState: EditorState) => void;
  required: boolean;
  label: string;
}> = ({ editorState, onEditorStateChange, required, label = "textArea" }) => (
  <Label label={label} required={required}>
    <Editor
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "list",
          "textAlign",
          "link",
          "history",
        ],

        inline: {
          inDropdown: false,
          options: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "monospace",
          ],
        },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: false },
        history: { inDropdown: false },
      }}
      editorState={editorState}
      toolbarClassName={s.editorToolbar}
      wrapperClassName={s.editorWraper}
      editorClassName={s.editor}
      onEditorStateChange={onEditorStateChange}
    />
  </Label>
);

const ImgFile: React.FC<{
  required?: boolean;
  value?: string;
  onChange?: (e: File) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  fileButton?: string;
  removeBurronLabel?: string;
  maxSize?: number;
}> = ({
  label = "file",
  required = true,
  onChange,
  fileButton = "Ubah",
  name = "imgFile",
  removeBurronLabel = "",
  error,
  value="",
  maxSize = 2000000,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ src, alt }, setImg] = useState<{
    src: string;
    alt: string;
  }>({ src: "", alt: "" });
  const [errorText, setErrorText] = useState<string | null | undefined>(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > maxSize) {
        setErrorText("Image size above limit.");
      }

      reader.readAsDataURL(e.target.files[0]);
      setImg({ src: String(reader.result), alt: e.target.files[0].name });
      onChange && onChange(e.target.files[0]);
    }

    reader.onloadend = () => {
      if (e.target.files && e.target.files[0]) {
        setImg({ src: String(reader.result), alt: e.target.files[0].name });
        onChange && onChange(e.target.files[0]);
      }
    };
  };

  const selectHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const resetHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (inputRef.current) {
      setErrorText(null);
      inputRef.current.value = "";
      setImg({ src: "", alt: "" });
    }
  };

  return (
    <>
      <label className={s.label} htmlFor="imgFile">
        <span
          className={classNames(
            s.label__span,
            required ? s.required : s.optional
          )}
          {...rest}
        >
          {label}
        </span>
      </label>

      <div className={classNames(s.fileImg__container, errorText && s.error)}>
        <input
          {...rest}
          id="imgFile"
          type="file"
          name={name}
          required={required}
          accept=".png, .jpg, .jpeg"
          className={s.fileImg}
          onChange={handleChange}
          ref={inputRef}
        />

        { value && <img src={value} alt={alt}/> }

        <img src={src} alt={alt} className={s.fileImg__preview} />

        <div className={s.fileImg__action}>
          <button
            className={classNames(s.fileImg__action__button, s.add)}
            onClick={selectHandler}
            title={fileButton}
            type="button"
          >
            {fileButton}
          </button>

          <button
            className={classNames(s.fileImg__action__button, s.remove)}
            onClick={resetHandler}
            title={removeBurronLabel}
            aria-labelledby={removeBurronLabel}
            type="button"
          >
            <img src={"/assets/icons/trash-icon.svg"} alt="remove file" />
          </button>
        </div>
        {errorText && <span className={s.label__error}>{errorText}</span>}
      </div>
    </>
  );
};

interface SubmitProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  className?: string;
}

const Submit: React.FC<SubmitProps> = ({ children, className, ...rest }) => (
  <button
    type="submit"
    title="Submit"
    className={classNames(s.button, className)}
    {...rest}
  >
    {children}
  </button>
);

interface FormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ children, className, ...rest }) => {
  return (
    <form className={classNames(s.form, "w-full", className)} {...rest}>
      {children}
    </form>
  );
};

export {
  Form,
  TextArea,
  Input,
  Select,
  Option,
  MultipleInputWrapper,
  ImgFile,
  Submit,
};
