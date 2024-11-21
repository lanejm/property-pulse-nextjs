/** @type {import('next').NextConfig} */
const nextConfig = {
  //need this in order to access profile image from google
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
