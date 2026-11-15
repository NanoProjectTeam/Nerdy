/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/wispbyte-api/:path*',
        destination: 'http://nerdy.freesrv.com:15371/api/:path*',
      },
    ];
  },
};

export default nextConfig;
