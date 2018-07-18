import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/google-analytics.js',
  format: 'cjs',
  plugins: [
    babel(),
  ],
  dest: 'dist/index.js',
};
