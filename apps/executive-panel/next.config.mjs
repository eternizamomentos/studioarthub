/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: { optimizePackageImports: [] }
};
export default nextConfig;