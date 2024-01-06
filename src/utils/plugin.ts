import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);

        if (args.importer === "index.js") {
          return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
        }

        if (args.importer) {
          const str = args.path.replace("./", "");
          return { path: `${args.importer}/${str}`, namespace: "a" };
        }

        return { path: args.path, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
                import react from "react";
                console.log("hi");
                `,
          };
        }

        const { data } = await axios.get(args.path);

        return {
          loader: "jsx",
          contents: data,
        };
      });
    },
  };
};
