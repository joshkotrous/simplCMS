/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.symlinks = false;
    config.module.rules.push({
      test: /node_modules\/@aws-crypto\/crc32/,
      use: "null-loader",
    });
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
    // Add a custom function to filter out problematic tsconfig files
    tsconfigPath: "tsconfig.json",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  transpilePackages: ["simplcms"],
};

export default nextConfig;
