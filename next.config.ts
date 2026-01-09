import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
    // Prevent trailing slash redirect loops when proxying to /babyfeed
    trailingSlash: false,
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Proxy /babyfeed to baby-feeding-timer app
    async rewrites() {
        return [
            {
                source: '/babyfeed/:path*',
                destination: 'https://baby-feeding-timer.vercel.app/babyfeed/:path*',
            },
            {
                source: '/babyfeed',
                destination: 'https://baby-feeding-timer.vercel.app/babyfeed',
            },
        ];
    },
};

export default withSentryConfig(nextConfig, {
    org: "danielwong",
    project: "javascript-nextjs",

    silent: !process.env.CI,

    sourcemaps: {
        deleteSourcemapsAfterUpload: true,
    },
});
