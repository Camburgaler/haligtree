import "core-js/actual/structured-clone";

import { deepCloneAndMap, deepFreeze } from "@/app/util/script";
import Armor from "@/app/util/types/armor";
import Equippable from "@/app/util/types/equippable";

describe("Util Scripts", () => {
    test("deepFreeze throws error", () => {
        expect(() => deepFreeze(null)).toThrow();
    });

    test("deepCloneAndMap skips invalid keys", () => {
        const obj: Equippable = {
            id: "alberichs-robe",
            name: "Alberich's Robe",
            stats: {
                VIG: 0,
                MND: 0,
                END: 0,
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 0,
            },
            total: 0,
        };
        const obj2: Armor = {
            id: "alberichs-robe",
            name: "Alberich's Robe",
            defenses: {
                physical: 0,
                slash: 0,
                strike: 0,
                pierce: 0,
                magic: 0,
                fire: 0,
                lightning: 0,
                holy: 0,
            },
            resistances: {
                "scarlet-rot": 0,
                poison: 0,
                hemorrhage: 0,
                frostbite: 0,
                sleep: 0,
                madness: 0,
                "death-blight": 0,
            },
            poise: 0,
            weight: 0,
        };

        const result: Equippable = deepCloneAndMap(obj, [obj2]);

        expect(result).toEqual(obj);
    });

    test("deepCloneAndMap skips invalid values", () => {
        type Temp = {
            id?: string;
        };
        const obj: Equippable = {
            id: "alberichs-robe",
            name: "Alberich's Robe",
            stats: {
                VIG: 0,
                MND: 0,
                END: 0,
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 0,
            },
            total: 0,
        };
        const obj2: Temp = {
            id: undefined,
        };

        const result: Equippable = deepCloneAndMap(obj, [obj2]);

        expect(result).toEqual(obj);
    });
});
