import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const res = NextResponse.next();

    res.headers.set(
        "Content-Security-Policy",
        [
            "script-src 'sha256-{HASHED_INLINE_SCRIPT}' 'strict-dynamic'",
            "object-src 'none'",
            "base-uri 'none'",
        ].join("; ")
    );

    return res;
}
