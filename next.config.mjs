/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ NESSUN redirect o rewrite: la home (/) resta home
  async redirects() {
    return [];
  },
  async rewrites() {
    return { beforeFiles: [], afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
