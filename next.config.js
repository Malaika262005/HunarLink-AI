/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage se images load karne ke liye (baad mein kaam aayega)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

module.exports = nextConfig;