/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["dgalywyr863hv.cloudfront.net", "via.placeholder.com"],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
