import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (code: string) => {
  return {
    name: "fetchPlugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: code,
          };
        }

        // check if file is cached
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // return cached file
        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        const fileType = args.path.match(/.css$/) ? "css" : "jsx";

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents =
          fileType === "css"
            ? `
              const style = document.createElement('style');
              style.innerText = '${escaped}';
              document.head.appendChild(style);
            `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // cache fetched file
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
