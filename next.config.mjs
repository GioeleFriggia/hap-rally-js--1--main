/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita che un warning ESLint ti blocchi la build su Vercel
  eslint: { ignoreDuringBuilds: true },

  // Consenti immagini remote usate dalla Gallery Drive
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.googleapis.com" }, // alt=media
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // thumbnails
    ],
  },

  // (facoltativo) se usi URL di Drive pubblici diretti
  // images: { domains: ['lh3.googleusercontent.com', 'www.googleapis.com'] },
};

export default nextConfig;
