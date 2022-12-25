/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
    '@snowpack/plugin-postcss',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
    sourcemap: 'external',
    preload: true,
    splitting: true,
    treeshake: true,
  },
  packageOptions: {},
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    jsxInject: "import React from 'react'",
  },
};
