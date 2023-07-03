import { EditorState, convertFromRaw } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CustomEditor: React.FC<{
  state: string;
  className?: string;
}> = ({ state, className }) => {
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const docState = convertFromRaw(JSON.parse(state));
    setEditorState(EditorState.createWithContent(docState));
  }, [state]);

  return (
    <div className="">
      <Editor
        editorClassName={className}
        editorState={editorState}
        toolbarHidden={true}
        readOnly={true}
      />
    </div>
  );
};

export default CustomEditor;
