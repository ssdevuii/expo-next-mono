import { EditorState, convertFromRaw } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CustomEditor = ({ state }: { state: string }) => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  useEffect(() => {
    const docState = convertFromRaw(JSON.parse(state) as unknown);
    setEditorState(EditorState.createWithContent(docState));
  }, [state]);

  return (
    <div className="">
      <Editor editorState={editorState} toolbarHidden={true} readOnly={true} />
    </div>
  );
};

export default CustomEditor;
