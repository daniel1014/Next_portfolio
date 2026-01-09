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
        return {
            beforeFiles: [
                // 使用 beforeFiles 確保在 Next.js 頁面/靜態文件檢查之前就執行代理
                // 這樣可以避免本地的 404 或其他路由干擾
                {
                    source: '/babyfeed',
                    destination: 'https://baby-feeding-timer.vercel.app/babyfeed',
                },
                {
                    source: '/babyfeed/:path*',
                    destination: 'https://baby-feeding-timer.vercel.app/babyfeed/:path*',
                },
                {
                    source: '/trustvibe',
                    destination: 'https://trustvibe-landing-page.vercel.app/trustvibe',
                },
                {
                    source: '/trustvibe/:path*',
                    destination: 'https://trustvibe-landing-page.vercel.app/trustvibe/:path*',
                },
            ],
        };
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
