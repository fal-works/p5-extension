import {
  distributionDirectory,
  moduleName,
  bannerComment,
  input,
  external,
  createPlugins
} from "./rollup-config-common";

export default {
  input,
  output: {
    file: `${distributionDirectory}/${moduleName}.mjs`,
    format: "es",
    sourcemap: false,
    banner: bannerComment,
    preferConst: true
  },
  external,
  plugins: createPlugins({ declaration: true })
};
