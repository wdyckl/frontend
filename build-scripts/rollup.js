const path = require("path");

const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const json = require("@rollup/plugin-json");
const babel = require("rollup-plugin-babel");
const { string } = require("rollup-plugin-string");

const { options: babelOptions } = require("./babel");

const paths = require("./paths.js");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

/**
 * @param {Object} arg
 * @param { import("rollup").InputOption } arg.input
 */
const createRollupConfig = ({
  input,
  // entry,
  outputRoot,
  defineOverlay,
  isProdBuild,
  latestBuild,
  isStatsBuild,
  dontHash,
}) => {
  return {
    /**
     * @type { import("rollup").InputOptions }
     */
    inputOptions: {
      input,
      plugins: [
        resolve({ extensions, preferBuiltins: false, browser: true }),
        commonjs({
          namedExports: {
            "js-yaml": ["safeDump", "safeLoad"],
          },
        }),
        json(),
        babel({
          ...babelOptions({ latestBuild }),
          extensions,
        }),
        string({
          // Required to be specified
          include: ["**/*.html", "**/*.css"],
        }),
      ],
    },
    /**
     * @type { import("rollup").OutputOptions }
     */
    outputOptions: {
      // https://rollupjs.org/guide/en/#outputdir
      dir: path.resolve(
        outputRoot,
        latestBuild ? "frontend_latest" : "frontend_es5"
      ),
      // https://rollupjs.org/guide/en/#outputformat
      format: latestBuild ? "es" : "iife",
      // https://rollupjs.org/guide/en/#outputexternallivebindings
      externalLiveBindings: false,
    },
  };
};

const createAppConfig = ({ isProdBuild, latestBuild, isStatsBuild }) => {
  const config = createRollupConfig({
    input: {
      app: "./src/entrypoints/app.ts",
      authorize: "./src/entrypoints/authorize.ts",
      onboarding: "./src/entrypoints/onboarding.ts",
      core: "./src/entrypoints/core.ts",
      compatibility: "./src/entrypoints/compatibility.ts",
      "custom-panel": "./src/entrypoints/custom-panel.ts",
      "hass-icons": "./src/entrypoints/hass-icons.ts",
    },
    outputRoot: paths.root,
    isProdBuild,
    latestBuild,
    isStatsBuild,
  });

  return config;
};

module.exports = {
  createAppConfig,
};
