/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts"],
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
