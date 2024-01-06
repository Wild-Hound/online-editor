import { useDebouncedState } from "@mantine/hooks";
import "./App.scss";
import CodeEditor from "./containers/CodeEditor";
import Preview from "./containers/Preview";
import styles from "./styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPlugin } from "./utils/plugin";

const { editor_wrappers } = styles;

function App() {
  const [code, setCode] = useDebouncedState<string | undefined>("", 200);
  const [translatedCode, setTranslatedCode] = useState("");

  useEffect(() => {
    if (!code) {
      return;
    }

    transformCode(code);
  }, [code]);

  useEffect(() => {
    startESBuildService();
  }, []);

  const startESBuildService = async () => {
    try {
      await esbuild.transform("console.log('hello world')", {
        loader: "ts",
      });
    } catch (err) {
      if (
        `${err}`.includes('You need to call "initialize" before calling this')
      ) {
        await esbuild.initialize({
          worker: true,
          wasmURL: "/esbuild.wasm",
        });
        console.info("init esbuild");
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value);
  };

  const transformCode = async (code: string) => {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPlugin()],
    });

    console.log(result.outputFiles[0].text);
    // let result = await esbuild.transform(code, {
    //   loader: "ts",
    // });
    // setTranslatedCode(result?.code);
  };

  return (
    <>
      <div className={editor_wrappers}>
        <CodeEditor onChange={handleEditorChange} />
        <Preview translatedCode={translatedCode} />
      </div>
    </>
  );
}

export default App;
