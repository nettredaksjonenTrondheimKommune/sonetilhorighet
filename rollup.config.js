import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const plugins = [
  babel({
    exclude: 'node_modules/**',
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
  }),
  json(),
  resolve({
    browser: true,
    // import .jsx without extension
    extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
    // avoid bundling multiple versions
    dedupe: ['react', 'react-dom', 'prop-types', 'flat'],
  }),
  replace({
    // remove `if (process.env.NODE_ENV === "production")`-blocks
    'process.env.NODE_ENV': '"production"',
  }),
  commonjs(),
  postcss({
    modules: true,
  }),
  terser(),
];

const entrypoints = ['alle', 'barnehage', 'bydel', 'helsestasjon', 'omsorgssone', 'skole', 'tommekalender'];

export default entrypoints.map((name) => ({
  input: `src/pages/${name}.js`,
  output: {
    file: `${pkg.name}/${name}-${pkg.version}.js`,
    format: 'iife',
  },
  plugins,
}));
