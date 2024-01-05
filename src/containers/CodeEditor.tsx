import Editor from "@monaco-editor/react";
import styles from "../styles/CodeEditor.module.scss";
import { useDebouncedState } from "@mantine/hooks";
import React, { useEffect } from "react";
import * as esbuild from "esbuild";

const { wrapper } = styles;

interface Props {
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<Props> = ({ onChange }) => {
  function handleEditorValidation(markers: any[]) {
    // model markers
    markers.forEach((marker) => console.log("onValidate:", marker.message));
  }

  return (
    <div className={wrapper}>
      <Editor
        height="50vh"
        defaultLanguage="typescript"
        defaultValue={`
    // Write content below
    `}
        onChange={onChange}
        onValidate={handleEditorValidation}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
