/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@refinedev/antd"],
    'env': {
        API: "http://api.bobrov95.website/api"
    },
    'poweredByHeader': false
};

export default nextConfig;