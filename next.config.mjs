/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // AI agents that ask for Markdown (Accept: text/markdown) get llms-full.txt instead of the HTML page.
  // beforeFiles so the rule runs ahead of the app/ page for "/". Humans can preview it at /index.md.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          destination: '/llms-full.txt',
        },
      ],
    };
  },
};

export default nextConfig;
