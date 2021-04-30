import resolve from 'rollup-plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import serve from 'rollup-plugin-serve'
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs'
export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  watch: {
    include: "src/**",
    exclude: "node_modules"
  },
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.ts', '.json', '.jsx', 'tsx'],
    }), htmlTemplate({
      template: 'example/demo.html',
      target: 'dist/index.html',
    }),
    serve('dist'),
    typescript(),
    commonjs(),
  ]
}