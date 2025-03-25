import "core-js/actual/structured-clone";

import ArmorResultRow from "@/app/armor/components/armorResult/ArmorResultRow";
import { render, screen } from "@testing-library/react";

describe("ArmorResultRow", () => {
    test("Renders", () => {
        render(
            <ArmorResultRow
                name="Test"
                id="test"
                armorId="test"
                stats={["0", "1", "2", "3", "4"]}
                addIgnoredItem={() => null}
                hotkey="1"
            />
        );

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    test("clicks ignore button", () => {
        const addIgnoredItem = jest.fn();
        render(
            <ArmorResultRow
                name="Test"
                id="test"
                armorId="test"
                stats={["0", "1", "2", "3", "4"]}
                addIgnoredItem={addIgnoredItem}
                hotkey="1"
            />
        );

        screen.getByRole("button").click();
        expect(addIgnoredItem).toHaveBeenCalled();
    });
});
