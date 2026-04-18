/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Corrupted `.next/cache/webpack/*.pack.gz` restores throw (`hasStartTime`, etc.) and
   * leave `next dev` serving HTML without CSS / bogus 404s. Disk + memory pack restore
   * still touches those files; disabling webpack cache in dev avoids PackFileCacheStrategy
   * entirely (slower cold compiles, stable HMR). Production builds are unaffected.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
