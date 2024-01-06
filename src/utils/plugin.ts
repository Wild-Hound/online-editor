import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);

        if (args.importer) {
          return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
        }

        return { path: args.path, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
                import message from "tiny-test-pkg";
                console.log(message);
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
