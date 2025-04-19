import "core-js/actual/structured-clone";

import {
    DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
    DEFAULT_INFUSION_MAP_NUMBER,
} from "@/app/util/constants";
import { WeaponResultRow } from "@/app/weapons/components/WeaponResultRow";
import { act, fireEvent, render, screen } from "@testing-library/react";

const arBreakdown = {
    standard: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    heavy: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    keen: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    quality: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    magic: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    fire: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    "flame-art": {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    lightning: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    sacred: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    poison: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    blood: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    cold: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
    occult: {
        baseDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
        scalingDmg: {
            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
        },
    },
};

describe("WeaponResultRow", () => {
    test("Renders", () => {
        render(
            <table>
                <tbody>
                    <WeaponResultRow
                        weaponName="Test"
                        attackRatings={{ ...DEFAULT_INFUSION_MAP_NUMBER }}
                        max={0}
                        arBreakdown={arBreakdown}
                        rank={0}
                    />
                </tbody>
            </table>
        );

        expect(screen.getByText("Test")).toBeInTheDocument();
    });

    test("highlights row", () => {
        render(
            <table>
                <tbody>
                    <WeaponResultRow
                        weaponName="Test"
                        attackRatings={{
                            ...DEFAULT_INFUSION_MAP_NUMBER,
                        }}
                        max={0}
                        arBreakdown={arBreakdown}
                        rank={0}
                    />
                </tbody>
            </table>
        );

        const cell = document.getElementsByTagName("td")[3];

        act(() => {
            fireEvent.mouseEnter(cell);
        });

        const row = document.getElementsByTagName("tr")[0];

        expect(row.style.backgroundColor).toBe("rgba(255, 255, 255, 0.1)");
    });

    test("handles undefined attackRatings", () => {
        render(
            <table>
                <tbody>
                    <WeaponResultRow
                        weaponName="Test"
                        attackRatings={{
                            ...DEFAULT_INFUSION_MAP_NUMBER,
                            standard: undefined,
                        }}
                        max={0}
                        arBreakdown={arBreakdown}
                        rank={0}
                    />
                </tbody>
            </table>
        );

        expect(document.getElementsByTagName("td")[3].textContent).toBe("-");
    });

    test("handles undefined arBreakdown", () => {
        render(
            <table>
                <tbody>
                    <WeaponResultRow
                        weaponName="Test"
                        attackRatings={{
                            ...DEFAULT_INFUSION_MAP_NUMBER,
                            standard: undefined,
                        }}
                        max={0}
                        arBreakdown={{ ...arBreakdown, standard: undefined }}
                        rank={0}
                    />
                </tbody>
            </table>
        );

        expect(document.getElementsByTagName("td")[3].textContent).toBe("-");
    });
});
