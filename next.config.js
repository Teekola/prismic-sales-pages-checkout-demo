/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['images.prismic.io', 'wroomdev.s3.amazonaws.com']
  }
}

module.exports = nextConfig
