import "core-js/actual/structured-clone";

import ClassPage from "@/app/class/page";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("Class Page", () => {
    test("Renders", () => {
        render(<ClassPage />);

        expect(screen.getByText("Starting Class")).toBeInTheDocument();
    });

    test("class stat is less than desired stat", () => {
        render(<ClassPage />);

        const desiredVig = document.getElementById("desired-VIG");

        act(() => {
            fireEvent.input(desiredVig!, { target: { value: "99" } });
        });

        const vigFinalStat = document.getElementById("final-VIG");

        expect(vigFinalStat).toHaveValue(99);
    });

    test("update selected talismans", () => {
        render(<ClassPage />);

        const radagonsScarseal = document.getElementById(
            "radagons-scarseal"
        ) as HTMLInputElement;

        act(() => {
            radagonsScarseal.click();
        });

        const radagonsSoreseal = document.getElementById(
            "radagons-soreseal"
        ) as HTMLInputElement;

        expect(radagonsSoreseal.disabled).toBe(true);

        act(() => {
            radagonsScarseal.click();
        });

        expect(radagonsSoreseal.disabled).toBe(false);
    });

    test("resets all", () => {
        render(<ClassPage />);

        const desiredVig = document.getElementById("desired-VIG");
        const desiredEnd = document.getElementById("desired-END");
        const desiredMnd = document.getElementById("desired-MND");
        const desiredStr = document.getElementById("desired-STR");
        const desiredDex = document.getElementById("desired-DEX");
        const desiredInt = document.getElementById("desired-INT");
        const desiredFth = document.getElementById("desired-FTH");
        const desiredArc = document.getElementById("desired-ARC");

        const helmetSelect = document.getElementById(
            "helmet"
        ) as HTMLSelectElement;
        const chestpieceSelect = document.getElementById(
            "chestpiece"
        ) as HTMLSelectElement;

        const radagonsScarseal = document.getElementById(
            "radagons-scarseal"
        ) as HTMLInputElement;
        const starscourgeHeirloom = document.getElementById(
            "starscourge-heirloom"
        ) as HTMLInputElement;
        const prosthesisWearerHeirloom = document.getElementById(
            "prosthesis-wearer-heirloom"
        ) as HTMLInputElement;
        const stargazerHeirloom = document.getElementById(
            "stargazer-heirloom"
        ) as HTMLInputElement;

        act(() => {
            fireEvent.input(desiredVig!, { target: { value: "99" } });
            fireEvent.input(desiredEnd!, { target: { value: "99" } });
            fireEvent.input(desiredMnd!, { target: { value: "99" } });
            fireEvent.input(desiredStr!, { target: { value: "99" } });
            fireEvent.input(desiredDex!, { target: { value: "99" } });
            fireEvent.input(desiredInt!, { target: { value: "99" } });
            fireEvent.input(desiredFth!, { target: { value: "99" } });
            fireEvent.input(desiredArc!, { target: { value: "99" } });

            fireEvent.change(helmetSelect, {
                target: { value: "albinauric-mask" },
            });
            fireEvent.change(chestpieceSelect, {
                target: { value: "commoners-garb" },
            });

            radagonsScarseal.click();
            starscourgeHeirloom.click();
            prosthesisWearerHeirloom.click();
            stargazerHeirloom.click();
        });

        const finalVig = document.getElementById("final-VIG");
        const finalEnd = document.getElementById("final-END");
        const finalMnd = document.getElementById("final-MND");
        const finalStr = document.getElementById("final-STR");
        const finalDex = document.getElementById("final-DEX");
        const finalInt = document.getElementById("final-INT");
        const finalFth = document.getElementById("final-FTH");
        const finalArc = document.getElementById("final-ARC");

        const radagonsSoreseal = document.getElementById(
            "radagons-soreseal"
        ) as HTMLInputElement;
        const twoFingersHeirloom = document.getElementById(
            "two-fingers-heirloom"
        ) as HTMLInputElement;
        const marikasScarseal = document.getElementById(
            "marikas-scarseal"
        ) as HTMLInputElement;
        const marikasSoreseal = document.getElementById(
            "marikas-soreseal"
        ) as HTMLInputElement;
        const millicentsProsthesis = document.getElementById(
            "millicents-prosthesis"
        ) as HTMLInputElement;
        const outerGodHeirloom = document.getElementById(
            "outer-god-heirloom"
        ) as HTMLInputElement;

        expect(finalVig).toHaveValue(96);
        expect(finalEnd).toHaveValue(96);
        expect(finalMnd).toHaveValue(99);
        expect(finalStr).toHaveValue(91);
        expect(finalDex).toHaveValue(91);
        expect(finalInt).toHaveValue(94);
        expect(finalFth).toHaveValue(98);
        expect(finalArc).toHaveValue(98);

        expect(radagonsSoreseal.disabled).toBe(true);
        expect(twoFingersHeirloom.disabled).toBe(true);
        expect(marikasScarseal.disabled).toBe(true);
        expect(marikasSoreseal.disabled).toBe(true);
        expect(millicentsProsthesis.disabled).toBe(true);
        expect(outerGodHeirloom.disabled).toBe(true);

        const resetButton = screen.getByRole("button", {
            name: "Reset All",
        }) as HTMLButtonElement;

        act(() => {
            resetButton.click();
        });

        expect(desiredVig).toHaveValue(0);
        expect(desiredEnd).toHaveValue(0);
        expect(desiredMnd).toHaveValue(0);
        expect(desiredStr).toHaveValue(0);
        expect(desiredDex).toHaveValue(0);
        expect(desiredInt).toHaveValue(0);
        expect(desiredFth).toHaveValue(0);
        expect(desiredArc).toHaveValue(0);

        expect(helmetSelect).toHaveValue("no-helmet");
        expect(chestpieceSelect).toHaveValue("no-chestpiece");

        expect(radagonsScarseal.checked).toBe(false);
        expect(radagonsSoreseal.checked).toBe(false);
        expect(starscourgeHeirloom.checked).toBe(false);
        expect(prosthesisWearerHeirloom.checked).toBe(false);
        expect(stargazerHeirloom.checked).toBe(false);
        expect(twoFingersHeirloom.checked).toBe(false);
        expect(marikasScarseal.checked).toBe(false);
        expect(marikasSoreseal.checked).toBe(false);
        expect(millicentsProsthesis.checked).toBe(false);
        expect(outerGodHeirloom.checked).toBe(false);
    });
});
