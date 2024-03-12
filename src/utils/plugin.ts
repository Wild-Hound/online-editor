import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const unpkgPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (args.importer === "index.js") {
          return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
        }

        if (args.resolveDir && args.resolveDir !== "/") {
          const str = args.path.replace("./", "");
          return {
            path: `https://unpkg.com${args.resolveDir}/${str}`,
            namespace: "a",
          };
        }

        if (args.importer) {
          const str = args.path.replace("./", "");
          return { path: `${args.importer}/${str}`, namespace: "a" };
        }

        return { path: args.path, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
                import react from "nested-test-pkg";
                console.log("hi");
                `,
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

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // cache fetched file
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
