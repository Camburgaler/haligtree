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
                borderRadius: "0.5rem",
                flexDirection: "row",
                position: "absolute",
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
                <option value="limgrave">Limgrave</option>
                <option value="nox">Nox</option>
                <option value="liurnia">Liurnia</option>
                <option value="caelid">Caelid</option>
                <option value="mohgwyn">Mohgwyn</option>
                <option value="altus">Altus</option>
                <option value="gelmir">Gelmir</option>
                <option value="leyndell">Leyndell</option>
                <option value="mountaintops">Mountaintops</option>
                <option value="farum-azula">Farum Azula</option>
                <option value="haligtree">Haligtree</option>
            </select>
        </div>
    );
}
