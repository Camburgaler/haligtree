import "core-js/actual/structured-clone";

import { NavLinks } from "@/app/util/components/NavLinks";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

describe("NavLinks", () => {
    test("Renders", () => {
        render(<NavLinks />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Starting Class")).toBeInTheDocument();
        expect(screen.getByText("Armor Optimizer")).toBeInTheDocument();
        expect(screen.getByText("Weapon Finder")).toBeInTheDocument();
        expect(screen.getByText("About")).toBeInTheDocument();
    });

    test("home path", () => {
        // mock the next/navigation usePathname hook
        (usePathname as jest.Mock).mockReturnValue("/");
        render(<NavLinks />);

        expect(screen.getByText("Home")).toHaveClass("current");
    });

    test("class path", () => {
        // mock the next/navigation usePathname hook
        (usePathname as jest.Mock).mockReturnValue("/class");
        render(<NavLinks />);

        expect(screen.getByText("Starting Class")).toHaveClass("current");
    });

    test("armor path", () => {
        // mock the next/navigation usePathname hook
        (usePathname as jest.Mock).mockReturnValue("/armor");
        render(<NavLinks />);

        expect(screen.getByText("Armor Optimizer")).toHaveClass("current");
    });

    test("weapons path", () => {
        // mock the next/navigation usePathname hook
        (usePathname as jest.Mock).mockReturnValue("/weapons");
        render(<NavLinks />);

        expect(screen.getByText("Weapon Finder")).toHaveClass("current");
    });

    test("about path", () => {
        // mock the next/navigation usePathname hook
        (usePathname as jest.Mock).mockReturnValue("/about");
        render(<NavLinks />);

        expect(screen.getByText("About")).toHaveClass("current");
    });
});
