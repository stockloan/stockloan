/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextBuildId = require('next-build-id');
module.exports = {
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,

  // Uncoment to add domain whitelist
  images: {
    domains: [
      // product image host
      'kr.object.fin-ncloudstorage.com',
    ],
  },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },

  async rewrites() {
    // Proxy
    return [
      // Paxnet
      {
        source: `/api/paxnet/:path*`,
        destination: process.env.NEXT_PUBLIC_PAXNET_SERVICE_URL + `/:path*`,
      },
      // Better
      {
        source: `/api/better/:path*`,
        destination:
          process.env.NEXT_PUBLIC_ADMIN_BETTER_SERVICE_URL + `/api/:path*`,
      },
    ];
  },
};
