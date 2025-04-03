import "core-js/actual/structured-clone";

import { ATTACK_POWER_TYPE_MODE_ALL } from "@/app/util/constants";
import WeaponsPage from "@/app/weapons/page";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("Weapons Page", () => {
    test("Renders", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        expect(screen.getByText("Weapon Finder")).toBeInTheDocument();
    });

    test("updates stats", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let statInputs = document.querySelectorAll(
            'input[name="stat"]'
        ) as NodeListOf<HTMLInputElement>;

        act(() => {
            fireEvent.change(statInputs[0], { target: { value: "20" } });
        });

        expect(screen.getAllByRole("row").length).toBe(50);

        act(() => {
            fireEvent.change(statInputs[0], { target: { value: "0" } });
        });

        expect(statInputs[0].value).toBe("1");

        act(() => {
            fireEvent.change(statInputs[0], { target: { value: "100" } });
        });

        expect(statInputs[0].value).toBe("99");
    });

    test("updates categories", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let categoryInputs = document.querySelectorAll(
            'input[name="category"]'
        ) as NodeListOf<HTMLInputElement>;

        act(() => {
            categoryInputs[0].click();
        });

        expect(screen.getAllByRole("row").length).toBe(21);
    });

    test("updates infusions", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let infusionInputs = document.querySelectorAll(
            'input[name="infusion"]'
        ) as NodeListOf<HTMLInputElement>;

        act(() => {
            infusionInputs[0].click();
        });

        const rows = screen.getAllByRole("row");

        expect(rows.length).toBe(17);
        rows.slice(1).forEach((row) => {
            expect(row.childNodes[3].textContent).toBe("-");
        });
    });

    test("updates attack power types", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let attackPowerTypeInputs = document.querySelectorAll(
            'input[name="attack-power-type"]'
        ) as NodeListOf<HTMLInputElement>;

        act(() => {
            attackPowerTypeInputs[0].click();
        });

        expect(screen.getAllByRole("row").length).toBe(3);
    });

    test("sets all infusions", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let setNoneInfusionButton = document.getElementById(
            "infusion-none"
        ) as HTMLButtonElement;

        act(() => {
            setNoneInfusionButton.click();
        });

        let infusionInputs = document.querySelectorAll(
            'input[name="infusion"]'
        ) as NodeListOf<HTMLInputElement>;

        infusionInputs.forEach((infusionInput) => {
            expect(infusionInput.checked).toBe(false);
        });

        let setAnyInfusionButton = document.getElementById(
            "infusion-any"
        ) as HTMLButtonElement;

        act(() => {
            setAnyInfusionButton.click();
        });

        infusionInputs.forEach((infusionInput) => {
            expect(infusionInput.checked).toBe(true);
        });
    });

    test("sets all attack power types", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let setNoneAttackPowerTypeButton = document.getElementById(
            "attack-power-none"
        ) as HTMLButtonElement;

        act(() => {
            setNoneAttackPowerTypeButton.click();
        });

        let attackPowerTypeInputs = document.querySelectorAll(
            'input[name="attack-power-type"]'
        ) as NodeListOf<HTMLInputElement>;

        attackPowerTypeInputs.forEach((attackPowerTypeInput) => {
            expect(attackPowerTypeInput.checked).toBe(false);
        });

        let setAnyAttackPowerTypeButton = document.getElementById(
            "attack-power-any"
        ) as HTMLButtonElement;

        act(() => {
            setAnyAttackPowerTypeButton.click();
        });

        attackPowerTypeInputs.forEach((attackPowerTypeInput) => {
            expect(attackPowerTypeInput.checked).toBe(true);
        });
    });

    test("sets all categories", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let setNoneCategoryButton = document.getElementById(
            "category-none"
        ) as HTMLButtonElement;

        act(() => {
            setNoneCategoryButton.click();
        });

        let categoryInputs = document.querySelectorAll(
            'input[name="category"]'
        ) as NodeListOf<HTMLInputElement>;

        categoryInputs.forEach((categoryInput) => {
            expect(categoryInput.checked).toBe(false);
        });

        let setAnyCategoryButton = document.getElementById(
            "category-any"
        ) as HTMLButtonElement;

        act(() => {
            setAnyCategoryButton.click();
        });

        categoryInputs.forEach((categoryInput) => {
            expect(categoryInput.checked).toBe(true);
        });
    });

    test("sets all weapon categories", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let setNoneWeaponCategoryButton = document.getElementById(
            "category-weapon-none"
        ) as HTMLButtonElement;

        act(() => {
            setNoneWeaponCategoryButton.click();
        });

        let weaponCategoryInputs = document.querySelectorAll(
            'input[class="weapon"]'
        ) as NodeListOf<HTMLInputElement>;

        weaponCategoryInputs.forEach((weaponCategoryInput) => {
            expect(weaponCategoryInput.checked).toBe(false);
        });

        let setAnyWeaponCategoryButton = document.getElementById(
            "category-weapon-any"
        ) as HTMLButtonElement;

        act(() => {
            setAnyWeaponCategoryButton.click();
        });

        weaponCategoryInputs.forEach((weaponCategoryInput) => {
            expect(weaponCategoryInput.checked).toBe(true);
        });
    });

    test("resets all", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        let statInputs = document.querySelectorAll(
            'input[name="stat"]'
        ) as NodeListOf<HTMLInputElement>;
        let notReinforcedRadio = document.getElementById(
            "min-upgrade"
        ) as HTMLInputElement;
        let requiredStatsCheckbox = document.getElementById(
            "requirements"
        ) as HTMLInputElement;
        let onlyBuffableCheckbox = document.getElementById(
            "buffable"
        ) as HTMLInputElement;
        let splitDamageCheckbox = document.getElementById(
            "split-damage"
        ) as HTMLInputElement;
        let statusEffectsCheckbox = document.getElementById(
            "status-effects"
        ) as HTMLInputElement;
        let twoHandedRadio = document.getElementById(
            "2h-always"
        ) as HTMLInputElement;
        let setNoneInfusionButton = document.getElementById(
            "infusion-none"
        ) as HTMLButtonElement;
        let setNoneAttackPowerTypeButton = document.getElementById(
            "attack-power-none"
        ) as HTMLButtonElement;
        let attackPowerIncludeButton = document.getElementById(
            "attack-power-include"
        ) as HTMLButtonElement;
        let attackPowerTypeAllRadio = document.getElementById(
            "attack-power-type-all"
        ) as HTMLInputElement;

        act(() => {
            statInputs.forEach((statInput) => {
                fireEvent.change(statInput, { target: { value: "11" } });
            });
            notReinforcedRadio.click();
            requiredStatsCheckbox.click();
            onlyBuffableCheckbox.click();
            splitDamageCheckbox.click();
            statusEffectsCheckbox.click();
            twoHandedRadio.click();
            setNoneInfusionButton.click();
            setNoneAttackPowerTypeButton.click();
            attackPowerIncludeButton.click();
            attackPowerTypeAllRadio.click();
        });

        let rows = screen.getAllByRole("row");

        expect(rows.length).toBe(21);
        rows.slice(1).forEach((row) => {
            expect(row.childNodes[1].textContent).toBe("No Results...");
        });

        let resetAllButton = document.getElementById(
            "reset-all"
        ) as HTMLButtonElement;

        act(() => {
            resetAllButton.click();
        });

        let infusionInputs = document.querySelectorAll(
            'input[name="infusion"]'
        ) as NodeListOf<HTMLInputElement>;
        let attackPowerTypeInputs = document.querySelectorAll(
            'input[name="attack-power-type"]'
        ) as NodeListOf<HTMLInputElement>;

        statInputs.forEach((statInput) => {
            expect(statInput.value).toBe("10");
        });
        expect(notReinforcedRadio.checked).toBe(false);
        expect(requiredStatsCheckbox.checked).toBe(true);
        expect(onlyBuffableCheckbox.checked).toBe(false);
        expect(splitDamageCheckbox.checked).toBe(true);
        expect(statusEffectsCheckbox.checked).toBe(false);
        expect(twoHandedRadio.checked).toBe(false);
        infusionInputs.forEach((infusionInput) => {
            expect(infusionInput.checked).toBe(true);
        });
        expect(attackPowerIncludeButton.textContent).toContain("INCLUDE");
        expect(attackPowerTypeAllRadio.checked).toBe(false);
        attackPowerTypeInputs.forEach((attackPowerTypeInput) => {
            expect(attackPowerTypeInput.checked).toBe(true);
        });
    });

    test("loads local storage", () => {
        localStorage.clear();

        const localStats = {
            STR: 11,
            DEX: 11,
            INT: 11,
            FTH: 11,
            ARC: 11,
        };
        const localReinforced = false;
        const localRequireStats = false;
        const localBuffableOnly = true;
        const localSplitDamage = false;
        const localStatusEffects = true;
        const localTwoHanded = true;
        const localInfusions = {
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
        };
        const localAttackPowerTypeMode = ATTACK_POWER_TYPE_MODE_ALL;
        const localAttackPowerTypesInclude = false;
        const localAttackPowerTypes = {
            physical: false,
            magic: false,
            fire: false,
            lightning: false,
            holy: false,
            bleed: false,
            poison: false,
            frost: false,
            "scarlet-rot": false,
            madness: false,
            sleep: false,
        };
        const localCategories = {
            dagger: false,
            "straight-sword": false,
            greatsword: false,
            "colossal-sword": false,
            "thrusting-sword": false,
            "heavy-thrusting-sword": false,
            "curved-sword": false,
            "curved-greatsword": false,
            katana: false,
            twinblade: false,
            hammer: false,
            "great-hammer": false,
            flail: false,
            axe: false,
            greataxe: false,
            spear: false,
            "great-spear": false,
            halberd: false,
            scythe: false,
            whip: false,
            fist: false,
            claw: false,
            "colossal-weapon": false,
            torch: false,
            "thrusting-shield": false,
            "hand-to-hand-art": false,
            "throwing-blade": false,
            "backhand-blade": false,
            "perfume-bottle": false,
            "beast-claw": false,
            "light-greatsword": false,
            "great-katana": false,
            "light-bow": true,
            bow: true,
            greatbow: true,
            crossbow: true,
            ballista: true,
            "small-shield": true,
            "medium-shield": true,
            greatshield: true,
            "glintstone-staff": true,
            "sacred-seal": true,
        };

        localStorage.setItem("localStats", JSON.stringify(localStats));
        localStorage.setItem(
            "localReinforced",
            JSON.stringify(localReinforced)
        );
        localStorage.setItem(
            "localRequireStats",
            JSON.stringify(localRequireStats)
        );
        localStorage.setItem(
            "localBuffableOnly",
            JSON.stringify(localBuffableOnly)
        );
        localStorage.setItem(
            "localSplitDamage",
            JSON.stringify(localSplitDamage)
        );
        localStorage.setItem(
            "localStatusEffects",
            JSON.stringify(localStatusEffects)
        );
        localStorage.setItem("localTwoHanded", JSON.stringify(localTwoHanded));
        localStorage.setItem("localInfusions", JSON.stringify(localInfusions));
        localStorage.setItem(
            "localAttackPowerTypeMode",
            JSON.stringify(localAttackPowerTypeMode)
        );
        localStorage.setItem(
            "localAttackPowerTypesInclude",
            JSON.stringify(localAttackPowerTypesInclude)
        );
        localStorage.setItem(
            "localAttackPowerTypes",
            JSON.stringify(localAttackPowerTypes)
        );
        localStorage.setItem(
            "localCategories",
            JSON.stringify(localCategories)
        );

        render(<WeaponsPage />);

        const statInputs = document.querySelectorAll(
            'input[name="stat"]'
        ) as NodeListOf<HTMLInputElement>;
        const notReinforcedRadio = document.getElementById(
            "min-upgrade"
        ) as HTMLInputElement;
        const requiredStatsCheckbox = document.getElementById(
            "requirements"
        ) as HTMLInputElement;
        const onlyBuffableCheckbox = document.getElementById(
            "buffable"
        ) as HTMLInputElement;
        const splitDamageCheckbox = document.getElementById(
            "split-damage"
        ) as HTMLInputElement;
        const statusEffectsCheckbox = document.getElementById(
            "status-effects"
        ) as HTMLInputElement;
        const twoHandedRadio = document.getElementById(
            "2h-always"
        ) as HTMLInputElement;
        const infusionInputs = document.querySelectorAll(
            'input[name="infusion"]'
        ) as NodeListOf<HTMLInputElement>;
        const attackPowerIncludesButton = document.getElementById(
            "attack-power-include"
        ) as HTMLButtonElement;
        const attackPowerTypeAllRadio = document.getElementById(
            "attack-power-type-all"
        ) as HTMLInputElement;
        const attackPowerTypeInputs = document.querySelectorAll(
            'input[name="attack-power-type"]'
        ) as NodeListOf<HTMLInputElement>;
        const categoryInputs = document.querySelectorAll(
            'input[name="category"]'
        ) as NodeListOf<HTMLInputElement>;

        statInputs.forEach((statInput) => {
            expect(statInput.value).toBe(
                localStats[
                    statInput.id.toUpperCase() as keyof typeof localStats
                ].toString()
            );
        });
        expect(notReinforcedRadio.checked).toBe(!localReinforced);
        expect(requiredStatsCheckbox.checked).toBe(localRequireStats);
        expect(onlyBuffableCheckbox.checked).toBe(localBuffableOnly);
        expect(splitDamageCheckbox.checked).toBe(localSplitDamage);
        expect(statusEffectsCheckbox.checked).toBe(localStatusEffects);
        expect(twoHandedRadio.checked).toBe(localTwoHanded);
        infusionInputs.forEach((infusionInput) => {
            expect(infusionInput.checked).toBe(
                localInfusions[
                    infusionInput.id
                        .split("-")
                        .slice(1)
                        .join("-") as keyof typeof localInfusions
                ]
            );
        });
        expect(attackPowerIncludesButton.textContent).toContain(
            localAttackPowerTypesInclude ? "INCLUDE" : "EXCLUDE"
        );
        expect(attackPowerTypeAllRadio.checked).toBe(
            !localAttackPowerTypesInclude
        );
        attackPowerTypeInputs.forEach((attackPowerTypeInput) => {
            expect(attackPowerTypeInput.checked).toBe(
                localAttackPowerTypes[
                    attackPowerTypeInput.id
                        .split("-")
                        .slice(3)
                        .join("-") as keyof typeof localAttackPowerTypes
                ]
            );
        });
        categoryInputs.forEach((categoryInput) => {
            expect(categoryInput.checked).toBe(
                localCategories[
                    categoryInput.id as keyof typeof localCategories
                ]
            );
        });
    });

    test("sets reinforced to true", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        const notReinforcedRadio = document.getElementById(
            "min-upgrade"
        ) as HTMLInputElement;

        act(() => {
            notReinforcedRadio.click();
        });

        expect(notReinforcedRadio.checked).toBe(true);

        const reinforcedRadio = document.getElementById(
            "max-upgrade"
        ) as HTMLInputElement;

        act(() => {
            reinforcedRadio.click();
        });

        expect(reinforcedRadio.checked).toBe(true);
    });

    test("sets two handed to false", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        const twoHandedRadio = document.getElementById(
            "2h-always"
        ) as HTMLInputElement;

        act(() => {
            twoHandedRadio.click();
        });

        expect(twoHandedRadio.checked).toBe(true);

        const oneHandedRadio = document.getElementById(
            "2h-never"
        ) as HTMLInputElement;

        act(() => {
            oneHandedRadio.click();
        });

        expect(oneHandedRadio.checked).toBe(true);
    });

    test("sets attack power type", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        const attackPowerTypeAllRadio = document.getElementById(
            "attack-power-type-all"
        ) as HTMLInputElement;

        act(() => {
            attackPowerTypeAllRadio.click();
        });

        expect(attackPowerTypeAllRadio.checked).toBe(true);

        const attackPowerTypeAny = document.getElementById(
            "attack-power-type-any"
        ) as HTMLInputElement;

        act(() => {
            attackPowerTypeAny.click();
        });

        expect(attackPowerTypeAny.checked).toBe(true);

        const attackPowerTypeExactly = document.getElementById(
            "attack-power-type-exactly"
        ) as HTMLInputElement;

        act(() => {
            attackPowerTypeExactly.click();
        });

        expect(attackPowerTypeExactly.checked).toBe(true);
    });

    test("updates sortBy", () => {
        localStorage.clear();
        render(<WeaponsPage />);

        const columnHeaders = document.querySelectorAll(
            "th"
        ) as NodeListOf<HTMLTableCellElement>;

        for (let i = 3; i < columnHeaders.length; i++) {
            act(() => {
                fireEvent.mouseOver(columnHeaders[i]);
                columnHeaders[i].click();
            });

            const rows = screen.getAllByRole("row");
            let tempRows = [...rows];
            expect(
                tempRows.sort(
                    (a, b) =>
                        Number.parseInt(b!.childNodes[i]!.textContent!) -
                        Number.parseInt(a!.childNodes[i]!.textContent!)
                )
            ).toEqual(rows);
        }

        for (let i = 2; i < columnHeaders.length; i++) {
            act(() => {
                fireEvent.mouseOver(columnHeaders[i]);
                columnHeaders[i].click();
            });

            act(() => {
                columnHeaders[i].click();
            });

            const rows = screen.getAllByRole("row");
            let tempRows = [...rows];
            expect(
                tempRows.sort(
                    (a, b) =>
                        Number.parseInt(a!.childNodes[i]!.textContent!) -
                        Number.parseInt(b!.childNodes[i]!.textContent!)
                )
            ).toEqual(rows);
        }
    });
});
