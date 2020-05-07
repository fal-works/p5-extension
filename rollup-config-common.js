import resolve from "@rollup/plugin-node-resolve";
import cleanup from "rollup-plugin-cleanup";

// ----------------------------------------------------------------------------

const version = "0.8.1";

const moduleName = "p5-extension";
const umdName = "p5ex";
const year = "2019-2020";
const description = `* An extension for p5.js.`;

const bannerComment = `/**
 * ${moduleName}
 *
${description}
 * GitHub repository: {@link https://github.com/fal-works/${moduleName}}
 *
 * @module ${moduleName}
 * @copyright ${year} FAL
 * @author FAL <contact@fal-works.com>
 * @license MIT
 * @version ${version}
 */
`;

const distributionDirectory = "lib";

// ----------------------------------------------------------------------------

export { distributionDirectory, moduleName, umdName, bannerComment };

export const input = `out/${moduleName}.js`;
export const external = ["p5", "@fal-works/creative-coding-core"];

export const createPlugins = () => [
  resolve(),
  cleanup({
    comments: /^\*\*/, // preserve jsdoc comments
    sourcemap: false,
    extensions: ["js"],
  }),
];
