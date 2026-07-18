/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during production builds (not recommended for long term)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
