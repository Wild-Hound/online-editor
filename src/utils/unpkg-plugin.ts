import * as esbuild from "esbuild-wasm";

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
    },
  };
};
