import styles from "../styles/CodeEditor.module.scss";
import React, { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const { wrapper } = styles;

interface Props {
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<Props> = ({ onChange }) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [2792],
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [2792],
      });

      console.log(monaco);
    }
  }, [monaco]);

  function handleEditorValidation(markers: any[]) {
    // model markers
    markers.forEach((marker) => console.log("onValidate:", marker));
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
