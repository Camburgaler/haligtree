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
                <option value="azula">Farum Azula</option>
                <option value="haligtree">Haligtree</option>
                <option value="shadow">Shadow</option>
                <option value="charo">Charo</option>
                <option value="cerulean">Cerulean Coast</option>
                <option value="jagged">Jagged Peak</option>
                <option value="finger">Finger Ruins</option>
                <option value="abyssal">Abyssal Woods</option>
                <option value="keep">Shadow Keep</option>
                <option value="shaman">Shaman Village</option>
                <option value="rauh">Rauh</option>
                <option value="bud">Church of the Bud</option>
                <option value="enir-ilim">Enir-Ilim</option>
            </select>
        </div>
    );
}
