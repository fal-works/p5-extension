import {
  distributionDirectory,
  moduleName,
  umdName,
  bannerComment,
  input,
  external,
  createPlugins
} from "./rollup-config-common";

export default {
  input,
  output: {
    file: `${distributionDirectory}/${moduleName}.js`,
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
  external,
  plugins: createPlugins()
};
