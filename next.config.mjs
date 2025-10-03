/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false, // disable React Compiler
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
