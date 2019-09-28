import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

const moduleName = "p5-extension";
const umdName = "p5ex";
const version = "0.1.2";
const year = "2019";
const description = `* An extension of p5.js.`;

const bannerComment = `/**
${description}
* GitHub repository: {@link https://github.com/fal-works/${moduleName}}
* @module ${moduleName}
* @copyright ${year} FAL
* @author FAL <contact@fal-works.com>
* @license MIT
* @version ${version}
*/
`;

export default {
  input: `src/${moduleName}.ts`,
  output: [
    {
      file: `lib/${moduleName}.js`,
      format: "umd",
      name: umdName,
      sourcemap: false,
      banner: bannerComment,
      preferConst: true,
      globals: {
        p5: "p5",
        "@fal-works/creative-coding-core": "CreativeCodingCore"
      }
    },
    {
      file: `lib/${moduleName}.mjs`,
      format: "es",
      sourcemap: false,
      banner: bannerComment,
      preferConst: true
    }
  ],
  external: ["p5", "@fal-works/creative-coding-core"],
  plugins: [
    resolve({}),
    typescript({
      useTsconfigDeclarationDir: true
    })
  ]
};
