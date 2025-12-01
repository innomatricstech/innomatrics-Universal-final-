/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {},   // <-- new plugin for v4
    autoprefixer: {},
  },
};
