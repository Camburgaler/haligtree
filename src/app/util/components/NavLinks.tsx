"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <header
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                borderBottom: "1px solid #ccc",
            }}
        >
            {/* Top row: avatar (left) and login/logout (right) */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    {user && (
                        <img
                            src={user.picture!}
                            alt={user.name!}
                            title={user.name! + "\n" + user.email!}
                            style={{
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                    )}
                </div>

                <h1
                    style={{
                        margin: 0,
                        padding: 0,
                        fontFamily: "Mantinia, serif",
                        color: "var(--accent)",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    HALIGTREE
                </h1>

                <a
                    href={user ? "/api/auth/logout" : "/api/auth/login"}
                    style={{
                        padding: "0.5rem 1rem",
                        textWrap: "wrap",
                        maxWidth: "25%",
                    }}
                >
                    {user ? "Logout" : "Login (currently does nothing)"}
                </a>
            </div>

            {/* Bottom row: nav links centered */}
            <nav
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "1rem",
                    textAlign: "center",
                }}
            >
                <h3>
                    <Link
                        href="/"
                        className={pathname === "/" ? "current" : ""}
                    >
                        Home
                    </Link>
                </h3>
                <h3>
                    <Link
                        href="/class"
                        className={pathname === "/class" ? "current" : ""}
                    >
                        Starting Class
                    </Link>
                </h3>
                <h3>
                    <Link
                        href="/armor"
                        className={pathname === "/armor" ? "current" : ""}
                    >
                        Armor Optimizer
                    </Link>
                </h3>
                <h3>
                    <Link
                        href="/weapons"
                        className={pathname === "/weapons" ? "current" : ""}
                    >
                        Weapon Finder
                    </Link>
                </h3>
                <h3>
                    <Link
                        href="/about"
                        className={pathname === "/about" ? "current" : ""}
                    >
                        About
                    </Link>
                </h3>
            </nav>
        </header>
    );
}
