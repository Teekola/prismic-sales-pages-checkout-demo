/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['images.prismic.io', 'images.unsplash.com']
  }
}

module.exports = nextConfig
