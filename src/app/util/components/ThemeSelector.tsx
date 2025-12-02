"use client";

import { useEffect, useState } from "react";

export function ThemeSelector() {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        console.log("Setting theme to", theme);

        let newTheme = theme;
        if (newTheme === "system") {
            localStorage.removeItem("theme");
        } else {
            localStorage.setItem("theme", newTheme);
        }
        newTheme =
            newTheme === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : newTheme;

        document.documentElement.dataset.theme = newTheme;

        console.log("Theme set to", document.documentElement.dataset.theme);
    }, [theme]);

    return (
        <div
            style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.5rem",
                color: "var(--contrast)",
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--secondary)",
                borderRadius: "0.5rem",
                flexDirection: "row",
                position: "fixed",
                top: "0.5rem",
                right: "0.5rem",
            }}
        >
            <label htmlFor="theme-selector">Theme:</label>
            <select
                style={{
                    minHeight: "24px",
                    minWidth: "100px",
                }}
                id="theme-selector"
                onChange={(e) => setTheme(e.target.value)}
                value={theme}
            >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="neon">Neon</option>
            </select>
        </div>
    );
}
