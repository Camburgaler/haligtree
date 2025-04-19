import "core-js/actual/structured-clone";

import { DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER } from "@/app/util/constants";
import { TableDataWithHover } from "@/app/weapons/components/TableDataWithHover";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("TableDataWithHover", () => {
    test("Renders", () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <TableDataWithHover
                            attackRating={10}
                            max={10}
                            data={{
                                baseDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                                scalingDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                            }}
                            infId="standard"
                            rowHighlighted={() => {}}
                        />
                    </tr>
                </tbody>
            </table>
        );

        expect(screen.getByText("10")).toBeInTheDocument();
    });

    test("handles mouse events", () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <TableDataWithHover
                            attackRating={10}
                            max={10}
                            data={{
                                baseDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                    bleed: 10,
                                },
                                scalingDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                            }}
                            infId="standard"
                            rowHighlighted={() => {}}
                        />
                    </tr>
                </tbody>
            </table>
        );

        const cell = screen.getByText("10");

        act(() => {
            fireEvent.mouseEnter(cell);
        });

        expect(cell).toHaveStyle("font-weight: bold");

        act(() => {
            fireEvent.mouseLeave(cell);
        });

        expect(cell).not.toHaveStyle("font-weight: bold");

        act(() => {
            fireEvent.mouseEnter(cell);
        });

        const popUp = screen.getByText("Standard Breakdown");

        act(() => {
            fireEvent.mouseEnter(popUp);
        });

        expect(popUp).not.toBeInTheDocument();
    });

    test("displays negative scaling", () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <TableDataWithHover
                            attackRating={10}
                            max={10}
                            data={{
                                baseDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                                scalingDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                    physical: -5,
                                },
                            }}
                            infId="standard"
                            rowHighlighted={() => {}}
                        />
                    </tr>
                </tbody>
            </table>
        );

        const cell = screen.getByText("10");

        act(() => {
            fireEvent.mouseEnter(cell);
        });

        expect(screen.getByText("-5.0")).toBeInTheDocument();
    });

    test("displays 0 attack rating", () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <TableDataWithHover
                            attackRating={0}
                            max={0}
                            data={{
                                baseDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                                scalingDmg: {
                                    ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                                },
                            }}
                            infId="standard"
                            rowHighlighted={() => {}}
                        />
                    </tr>
                </tbody>
            </table>
        );

        expect(screen.getByText("-")).toBeInTheDocument();
    });
});
