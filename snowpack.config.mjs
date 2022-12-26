import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    target: 'es2020',
    sourcemap: 'external',
    splitting: true,
    treeshake: true,
  },
  packageOptions: {
    polyfillNode: false,
    rollup: {
      plugins: [
        commonjs(),
        // nodePolyfills(),
        resolve({
          browser: true,
          preferBuiltins: true,
        }),
      ],
    },
  },
  devOptions: {
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    jsxInject: "import React from 'react'",
  },
};
