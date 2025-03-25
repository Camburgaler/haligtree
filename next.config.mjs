/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/:path",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic';object-src 'none';base-uri 'none';",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
