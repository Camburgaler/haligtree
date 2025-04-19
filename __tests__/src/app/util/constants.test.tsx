import "core-js/actual/structured-clone";

import {
    ATTACK_POWER_STAT_IDS,
    DEFAULT_INFUSION_MAP_BOOLEAN,
    SCALING_MULTIPLIERS,
    STAT_IDS,
    STATUS_IDS,
} from "@/app/util/constants";

describe("Constants", () => {
    test("STATUS_IDS", () => {
        expect(STATUS_IDS).toEqual([
            "bleed",
            "poison",
            "frost",
            "scarlet-rot",
            "madness",
            "sleep",
        ]);
    });

    test("STAT_IDS", () => {
        expect(STAT_IDS).toEqual([
            "VIG",
            "MND",
            "END",
            ...ATTACK_POWER_STAT_IDS,
        ]);
    });

    test("DEFAULT_INFUSION_MAP_BOOLEAN", () => {
        expect(DEFAULT_INFUSION_MAP_BOOLEAN).toEqual({
            standard: false,
            heavy: false,
            keen: false,
            quality: false,
            magic: false,
            fire: false,
            "flame-art": false,
            lightning: false,
            sacred: false,
            poison: false,
            blood: false,
            cold: false,
            occult: false,
            unique: false,
        });
    });

    test("SCALING_MULTIPLIERS", () => {
        expect(SCALING_MULTIPLIERS).toEqual({
            S: 1.5,
            A: 1.2,
            B: 1.0,
            C: 0.8,
            D: 0.5,
            E: 0.3,
        });
    });
});
