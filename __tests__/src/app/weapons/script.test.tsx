import "core-js/actual/structured-clone";

import {
    DEFAULT_ATTACK_POWER_TYPE_MAP_BOOLEAN,
    DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
    DEFAULT_CATEGORY_MAP_BOOLEAN,
    DEFAULT_INFUSION_MAP_NUMBER,
} from "@/app/util/constants";
import {
    mapResults,
    mapWeapons,
    SortByWeapon,
    WeaponResult,
} from "@/app/weapons/script";
import { render, screen } from "@testing-library/react";

const stats = {
    STR: 10,
    DEX: 10,
    INT: 10,
    FTH: 10,
    ARC: 10,
};
const twoHanded = false;
const requireStats = true;
const categories = {
    dagger: true,
    "straight-sword": true,
    greatsword: true,
    "colossal-sword": true,
    "thrusting-sword": true,
    "heavy-thrusting-sword": true,
    "curved-sword": true,
    "curved-greatsword": true,
    katana: true,
    twinblade: true,
    hammer: true,
    "great-hammer": true,
    flail: true,
    axe: true,
    greataxe: true,
    spear: true,
    "great-spear": true,
    halberd: true,
    scythe: true,
    whip: true,
    fist: true,
    claw: true,
    "colossal-weapon": true,
    torch: true,
    "thrusting-shield": true,
    "hand-to-hand-art": true,
    "throwing-blade": true,
    "backhand-blade": true,
    "perfume-bottle": true,
    "beast-claw": true,
    "light-greatsword": true,
    "great-katana": true,
    "light-bow": false,
    bow: false,
    greatbow: false,
    crossbow: false,
    ballista: false,
    "small-shield": false,
    "medium-shield": false,
    greatshield: false,
    "glintstone-staff": false,
    "sacred-seal": false,
};
const infusions = {
    standard: true,
    heavy: true,
    keen: true,
    quality: true,
    magic: true,
    fire: true,
    "flame-art": true,
    lightning: true,
    sacred: true,
    poison: true,
    blood: true,
    cold: true,
    occult: true,
    unique: true,
};
const buffableOnly = false;
const allowSplitDamage = true;
const attackPowerTypesInclude = true;
const attackPowerTypeMode = "any";
const attackPowerTypes = {
    physical: true,
    magic: true,
    fire: true,
    lightning: true,
    holy: true,
    bleed: true,
    poison: true,
    frost: true,
    "scarlet-rot": true,
    madness: true,
    sleep: true,
};
const reinforced = true;
const considerStatusEffects = false;

function weaponResultDisplayable(result: WeaponResult): boolean {
    return Object.values(result.attackRatings).some((rating) => rating > 0);
}

function weaponResultsAreDisplayable(results: WeaponResult[]): boolean {
    return results.some((result) => weaponResultDisplayable(result));
}

describe("Weapon Script", () => {
    test("mapWeapons", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(22);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with attackPowerTypesInclude false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            false,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(19);

        expect(weaponResultsAreDisplayable(result)).toBe(false);
    });

    test("mapWeapons with attackPowerTypeMode all", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            "all",
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(19);

        expect(weaponResultsAreDisplayable(result)).toBe(false);
    });

    test("mapWeapons with attackPowerTypeMode all and no selected attack power types", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            "all",
            DEFAULT_ATTACK_POWER_TYPE_MAP_BOOLEAN,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(19);

        expect(weaponResultsAreDisplayable(result)).toBe(false);
    });

    test("mapWeapons with attackPowerTypeMode all and no one selected attack power type", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            "all",
            { ...DEFAULT_ATTACK_POWER_TYPE_MAP_BOOLEAN, physical: true },
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(22);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with attackPowerTypeMode all and attackPowerTypesInclude false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            false,
            "all",
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(22);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with attackPowerTypeMode exactly", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            "exactly",
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(19);

        expect(weaponResultsAreDisplayable(result)).toBe(false);
    });

    test("mapWeapons with attackPowerTypeMode exactly and no selected attack power types", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            "exactly",
            DEFAULT_ATTACK_POWER_TYPE_MAP_BOOLEAN,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(19);

        expect(weaponResultsAreDisplayable(result)).toBe(false);
    });

    test("mapWeapons with attackPowerTypeMode exactly and attackPowerTypesInclude false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            false,
            "exactly",
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(22);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with 99 STR and twoHanded", () => {
        const result = mapWeapons(
            { ...stats, STR: 99 },
            true,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(76);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with 20 STR", () => {
        const result = mapWeapons(
            { ...stats, STR: 20 },
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(49);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with only bow categories selected", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            {
                ...DEFAULT_CATEGORY_MAP_BOOLEAN,
                "light-bow": true,
                bow: true,
                greatbow: true,
                crossbow: true,
                ballista: true,
            },
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(5);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with requireStats false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            false,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(340);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with reinforced false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            false,
            considerStatusEffects
        );

        expect(result.length).toBe(22);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons woth allowSplitDamage false", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            buffableOnly,
            false,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(20);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapWeapons with buffableOnly true", () => {
        const result = mapWeapons(
            stats,
            twoHanded,
            requireStats,
            categories,
            infusions,
            true,
            allowSplitDamage,
            attackPowerTypesInclude,
            attackPowerTypeMode,
            attackPowerTypes,
            reinforced,
            considerStatusEffects
        );

        expect(result.length).toBe(14);

        expect(weaponResultsAreDisplayable(result)).toBe(true);
    });

    test("mapResults", () => {
        const results: WeaponResult[] = [
            {
                weaponName: "test",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 10 },
                max: 10,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 10,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
            {
                weaponName: "test2",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 11 },
                max: 11,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 11,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
        ];
        const sortBy: SortByWeapon = { column: "max", desc: true };

        render(
            <table>
                <tbody>{mapResults(results, sortBy)}</tbody>
            </table>
        );

        expect(screen.getAllByRole("row").length).toBe(2);

        const data = screen.getAllByRole("cell");
        expect(data[0].textContent).toBe("1");
        expect(data[1].textContent).toBe("test2");
        expect(data[2].textContent).toBe("11");
        expect(data[3].textContent).toBe("11");
        expect(data[4].textContent).toBe("-");
    });

    test("mapResults with sortBy ascending", () => {
        const results: WeaponResult[] = [
            {
                weaponName: "test",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 10 },
                max: 10,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 10,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
            {
                weaponName: "test2",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 11 },
                max: 11,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 11,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
        ];
        const sortBy: SortByWeapon = { column: "max", desc: false };

        render(
            <table>
                <tbody>{mapResults(results, sortBy)}</tbody>
            </table>
        );

        expect(screen.getAllByRole("row").length).toBe(2);

        const data = screen.getAllByRole("cell");
        expect(data[0].textContent).toBe("1");
        expect(data[1].textContent).toBe("test");
        expect(data[2].textContent).toBe("10");
        expect(data[3].textContent).toBe("10");
        expect(data[4].textContent).toBe("-");
    });

    test("mapResults with sortBy standard", () => {
        const results: WeaponResult[] = [
            {
                weaponName: "test",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 10 },
                max: 10,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 10,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
            {
                weaponName: "test2",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 11 },
                max: 11,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 11,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
        ];
        const sortBy: SortByWeapon = { column: "standard", desc: true };

        render(
            <table>
                <tbody>{mapResults(results, sortBy)}</tbody>
            </table>
        );

        expect(screen.getAllByRole("row").length).toBe(2);

        const data = screen.getAllByRole("cell");
        expect(data[0].textContent).toBe("1");
        expect(data[1].textContent).toBe("test2");
        expect(data[2].textContent).toBe("11");
        expect(data[3].textContent).toBe("11");
        expect(data[4].textContent).toBe("-");
    });

    test("mapResults with sortBy standard and sortBy ascending", () => {
        const results: WeaponResult[] = [
            {
                weaponName: "test",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 10 },
                max: 10,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 10,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
            {
                weaponName: "test2",
                attackRatings: { ...DEFAULT_INFUSION_MAP_NUMBER, standard: 11 },
                max: 11,
                arBreakdown: {
                    standard: {
                        baseDmg: {
                            ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER,
                            physical: 11,
                        },
                        scalingDmg: { ...DEFAULT_ATTACK_POWER_TYPE_MAP_NUMBER },
                    },
                },
                spellScaling: 0,
            },
        ];
        const sortBy: SortByWeapon = { column: "standard", desc: false };

        render(
            <table>
                <tbody>{mapResults(results, sortBy)}</tbody>
            </table>
        );

        expect(screen.getAllByRole("row").length).toBe(2);

        const data = screen.getAllByRole("cell");
        expect(data[0].textContent).toBe("1");
        expect(data[1].textContent).toBe("test");
        expect(data[2].textContent).toBe("10");
        expect(data[3].textContent).toBe("10");
        expect(data[4].textContent).toBe("-");
    });
});
