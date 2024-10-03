/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };
  
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
      config.resolve.fallback = {
        fs: false,
      }
  
      if (!isServer) {
        config.output.publicPath = '/_next/';
      }
  
      return config;
    },
  };
  
  export default nextConfig;