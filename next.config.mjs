/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bqabyyjojxuywoujxezp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/pathway-images/**',
      },
    ],
  },
};

export default nextConfig;