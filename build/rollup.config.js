import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6
import buble from '@rollup/plugin-buble'; // Transpile/polyfill with reasonable browser support
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files



export default {
  input: 'src/main.js', // Path relative to package.json
  output: {
    name: 'VueTable',
    exports: 'named',
  },
  plugins: [
    resolve(),
    commonjs(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    buble(), // Transpile to ES5
  ],
};