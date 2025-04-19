import "core-js/actual/structured-clone";

import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("Home Page", () => {
    test("Renders", () => {
        render(<Home />);

        expect(
            screen.getByText(
                "Create, view, and optimize builds for Elden Ring."
            )
        ).toBeInTheDocument();
    });
});
