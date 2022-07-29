/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['images.prismic.io', 'images.unsplash.com', 'kajabi-storefronts-production.kajabi-cdn.com', 'static.paytrail.com', 'eazybreak.fi', 'badges.smartum.fi']
  }
}

module.exports = nextConfig
