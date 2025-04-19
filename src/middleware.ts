import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64"); // Generate a nonce
    const isDev = process.env.NODE_ENV === "development";

    const res = NextResponse.next();
    res.headers.set(
        "Content-Security-Policy",
        [
            [
                "script-src",
                "http:",
                "https:",
                `'nonce-${nonce}'`,
                "'strict-dynamic'",
                "'unsafe-inline'",
                "'self'",
                isDev ? "'unsafe-eval'" : "",
            ].join(" "),
            ["object-src", "'none'"].join(" "),
            ["base-uri", "'none'"].join(" "),
            //["require-trusted-types-for", "'script'"].join(" "),
        ]
            .filter(Boolean)
            .join("; ")
    );

    // Pass the nonce as a header so the page can use it
    res.headers.set("X-Nonce", nonce);

    return res;
}

export const config = {
    matcher: "/:path*",
};
