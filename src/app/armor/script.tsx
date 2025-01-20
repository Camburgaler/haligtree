import { CHESTPIECES, GAUNTLETS, HELMETS, LEGGINGS } from "../util/constants";
import Armor from "../util/types/armor";
import ArmorSet from "../util/types/armorSet";

export function resetAll(): void {
    [
        ...(document.getElementsByName(
            "locked-items"
        ) as NodeListOf<HTMLSelectElement>),
    ].forEach((select) => (select.selectedIndex = 0));
}

export function itemStatsToString(item: Armor): string[] {
    let weight = item.weight.toFixed(1);
    let poise = item.poise.toString();
    let standard =
        [
            item.defenses.physical,
            item.defenses.strike,
            item.defenses.slash,
            item.defenses.pierce,
        ]
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Standard, ";
    let physical = item.defenses.physical.toFixed(1) + " Physical, ";
    let strike = item.defenses.strike.toFixed(1) + " Strike, ";
    let slash = item.defenses.slash.toFixed(1) + " Slash, ";
    let pierce = item.defenses.pierce.toFixed(1) + " Pierce, ";
    let elemental =
        [
            item.defenses.magic,
            item.defenses.fire,
            item.defenses.lightning,
            item.defenses.holy,
        ]
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Elemental, ";
    let magic = item.defenses.magic.toFixed(1) + " Magic, ";
    let fire = item.defenses.fire.toFixed(1) + " Fire, ";
    let lightning = item.defenses.lightning.toFixed(1) + " Lightning, ";
    let holy = item.defenses.holy.toFixed(1) + " Holy, ";
    let resistances = Object.values(item.resistances).reduce(
        (total: any, res: any, i: number) =>
            total +
            res +
            " " +
            [
                "Scarlet Rot",
                "Poison",
                "Hemorrhage",
                "Frostbite",
                "Sleep",
                "Madness",
                "Death",
            ][i] +
            ", ",
        ""
    );

    return [
        weight,
        poise,
        standard + physical + strike + slash + pierce,
        elemental + magic + fire + lightning + holy,
        resistances,
    ];
}

export function setStatsToString(set: ArmorSet): string[] {
    let imaginary: Armor = {
        id: "IMAGINARY",
        name: "IMAGINARY",
        weight:
            set.helmet?.weight! +
            set.chestpiece?.weight! +
            set.gauntlets?.weight! +
            set.leggings?.weight!,
        poise:
            set.helmet?.poise! +
            set.chestpiece?.poise! +
            set.gauntlets?.poise! +
            set.leggings?.poise!,
        defenses: {
            physical:
                set.helmet?.defenses.physical! +
                set.chestpiece?.defenses.physical! +
                set.gauntlets?.defenses.physical! +
                set.leggings?.defenses.physical!,
            strike:
                set.helmet?.defenses.strike! +
                set.chestpiece?.defenses.strike! +
                set.gauntlets?.defenses.strike! +
                set.leggings?.defenses.strike!,
            slash:
                set.helmet?.defenses.slash! +
                set.chestpiece?.defenses.slash! +
                set.gauntlets?.defenses.slash! +
                set.leggings?.defenses.slash!,
            pierce:
                set.helmet?.defenses.pierce! +
                set.chestpiece?.defenses.pierce! +
                set.gauntlets?.defenses.pierce! +
                set.leggings?.defenses.pierce!,
            magic:
                set.helmet?.defenses.magic! +
                set.chestpiece?.defenses.magic! +
                set.gauntlets?.defenses.magic! +
                set.leggings?.defenses.magic!,
            fire:
                set.helmet?.defenses.fire! +
                set.chestpiece?.defenses.fire! +
                set.gauntlets?.defenses.fire! +
                set.leggings?.defenses.fire!,
            lightning:
                set.helmet?.defenses.lightning! +
                set.chestpiece?.defenses.lightning! +
                set.gauntlets?.defenses.lightning! +
                set.leggings?.defenses.lightning!,
            holy:
                set.helmet?.defenses.holy! +
                set.chestpiece?.defenses.holy! +
                set.gauntlets?.defenses.holy! +
                set.leggings?.defenses.holy!,
        },
        resistances: {
            scarletRot:
                set.helmet?.resistances.scarletRot! +
                set.chestpiece?.resistances.scarletRot! +
                set.gauntlets?.resistances.scarletRot! +
                set.leggings?.resistances.scarletRot!,
            poison:
                set.helmet?.resistances.poison! +
                set.chestpiece?.resistances.poison! +
                set.gauntlets?.resistances.poison! +
                set.leggings?.resistances.poison!,
            hemorrhage:
                set.helmet?.resistances.hemorrhage! +
                set.chestpiece?.resistances.hemorrhage! +
                set.gauntlets?.resistances.hemorrhage! +
                set.leggings?.resistances.hemorrhage!,
            frostbite:
                set.helmet?.resistances.frostbite! +
                set.chestpiece?.resistances.frostbite! +
                set.gauntlets?.resistances.frostbite! +
                set.leggings?.resistances.frostbite!,
            sleep:
                set.helmet?.resistances.sleep! +
                set.chestpiece?.resistances.sleep! +
                set.gauntlets?.resistances.sleep! +
                set.leggings?.resistances.sleep!,
            madness:
                set.helmet?.resistances.madness! +
                set.chestpiece?.resistances.madness! +
                set.gauntlets?.resistances.madness! +
                set.leggings?.resistances.madness!,
            deathBlight:
                set.helmet?.resistances.deathBlight! +
                set.chestpiece?.resistances.deathBlight! +
                set.gauntlets?.resistances.deathBlight! +
                set.leggings?.resistances.deathBlight!,
        },
    };

    return itemStatsToString(imaginary);
}
function fitness(item: Armor, sortBy: string): number {
    switch (sortBy) {
        case "sort-average":
            return (
                Object.values(item.defenses).reduce(
                    (total: any, n) => total + n,
                    0
                ) ?? 0
            );
        case "sort-standard":
            return (
                [
                    item.defenses.physical,
                    item.defenses.strike,
                    item.defenses.slash,
                    item.defenses.pierce,
                ].reduce((total, n) => total + n, 0) ?? 0
            );
        case "sort-physical":
            return item.defenses.physical ?? 0;
        case "sort-strike":
            return item.defenses.strike ?? 0;
        case "sort-slash":
            return item.defenses.slash ?? 0;
        case "sort-pierce":
            return item.defenses.pierce ?? 0;
        case "sort-elemental":
            return (
                [
                    item.defenses.magic,
                    item.defenses.fire,
                    item.defenses.lightning,
                    item.defenses.holy,
                ].reduce((total, n) => total + n, 0) ?? 0
            );
        case "sort-magic":
            return item.defenses.magic ?? 0;
        case "sort-fire":
            return item.defenses.fire ?? 0;
        case "sort-lightning":
            return item.defenses.lightning ?? 0;
        case "sort-holy":
            return item.defenses.holy ?? 0;
        case "sort-resistances":
            return (
                Object.values(item.resistances).reduce(
                    (total, n) => total + n,
                    0
                ) ?? 0
            );
        case "sort-scarlet-rot":
            return item.resistances.scarletRot ?? 0;
        case "sort-poison":
            return item.resistances.poison ?? 0;
        case "sort-hemorrhage":
            return item.resistances.hemorrhage ?? 0;
        case "sort-frostbite":
            return item.resistances.frostbite ?? 0;
        case "sort-sleep":
            return item.resistances.sleep ?? 0;
        case "sort-madness":
            return item.resistances.madness ?? 0;
        case "sort-death":
            return item.resistances.deathBlight ?? 0;
        case "sort-poise":
            return item.poise ?? 0;
        // case "sort-custom":
        //     return (
        //         [item.defenses.physical * 0.5, item.defenses.holy].reduce(
        //             (total, n) => total + n,
        //             0
        //         ) ?? 0
        //     );
        default:
            return -1;
    }
}

function armorSetContains(set: ArmorSet, item: Armor): boolean {
    return (
        set.helmet?.id === item.id ||
        set.chestpiece?.id === item.id ||
        set.gauntlets?.id === item.id ||
        set.leggings?.id === item.id
    );
}

export function dominated(
    itemList: Armor[],
    lockedItems: ArmorSet,
    ignoredItems: Armor[],
    sortBy: string
): Armor[] {
    if (itemList.some((item: Armor) => armorSetContains(lockedItems, item))) {
        return [
            itemList.find((item: any) => armorSetContains(lockedItems, item))!,
        ];
    }

    // remove ignored items from itemList
    itemList = itemList.filter(
        // (item: Armor) => !ignoredItems.includes(item)
        (item: Armor) => !ignoredItems.some((i) => i.id === item.id)
    );

    let sorted = [...itemList];
    sorted.sort((a, b) => a.weight - b.weight);

    let approved: Armor[] = [];
    sorted.forEach((item) => {
        if (
            !approved.some(
                (other) => fitness(item, sortBy) <= fitness(other, sortBy)
            )
        ) {
            approved.push(item);
        }
    });

    return approved;
}

export function knapSack(
    equipLoadBudget: number,
    helmets: Armor[],
    chestpieces: Armor[],
    gauntlets: Armor[],
    leggings: Armor[],
    sortBy: string
): ArmorSet[] {
    // Convert max equip load to integer by multiplying by 10
    const equipLoadBudgetInt = Math.round(equipLoadBudget * 10);

    // Initialize DP table
    const dp: ArmorSet[][] = Array(5)
        .fill(0)
        .map(() =>
            Array(equipLoadBudgetInt + 1)
                .fill(null)
                .map(() => {
                    let set: ArmorSet = {};
                    set.weight = 0;
                    set.fitness = 0;
                    return set;
                })
        );

    const equipment = [helmets, chestpieces, gauntlets, leggings];
    // Fill DP table
    for (let i = 0; i < 4; i++) {
        const pieces = equipment[i];

        for (const piece of pieces) {
            // Convert piece weight to integer
            const pieceWeight = piece.weight;
            const pieceWeightInt = Math.round(pieceWeight * 10);
            const pieceStat = fitness(piece, sortBy);

            for (
                let wInt = equipLoadBudgetInt;
                wInt >= pieceWeightInt;
                wInt--
            ) {
                if (
                    dp[i][wInt - pieceWeightInt].weight! + pieceWeight <=
                    equipLoadBudgetInt
                ) {
                    const newFitness =
                        dp[i][wInt - pieceWeightInt].fitness! + pieceStat;
                    if (newFitness > dp[i + 1][wInt].fitness!) {
                        // helmet
                        dp[i + 1][wInt].helmet =
                            i === 0
                                ? piece
                                : dp[i][wInt - pieceWeightInt].helmet ??
                                  HELMETS[0];
                        // chestpiece
                        dp[i + 1][wInt].chestpiece =
                            i === 1
                                ? piece
                                : dp[i][wInt - pieceWeightInt].chestpiece ??
                                  CHESTPIECES[0];
                        // gauntlets
                        dp[i + 1][wInt].gauntlets =
                            i === 2
                                ? piece
                                : dp[i][wInt - pieceWeightInt].gauntlets ??
                                  GAUNTLETS[0];
                        // leggings
                        dp[i + 1][wInt].leggings =
                            i === 3
                                ? piece
                                : dp[i][wInt - pieceWeightInt].leggings ??
                                  LEGGINGS[0];
                        // fitness
                        dp[i + 1][wInt].fitness = newFitness;
                        // weight
                        dp[i + 1][wInt].weight =
                            dp[i][wInt - pieceWeightInt].weight! + pieceWeight;
                    }
                }
            }
        }

        // Carry forward the best set from the previous category without adding a new piece
        for (let w = 0; w <= equipLoadBudgetInt; w++) {
            if (dp[i + 1][w].fitness! < dp[i][w].fitness!) {
                dp[i + 1][w] = dp[i][w];
            }
        }
    }

    // Extract top 3 sets
    const topSets: ArmorSet[] = [];
    for (let wInt = equipLoadBudgetInt; wInt >= 0; wInt--) {
        if (dp[4][wInt].fitness! > 0) {
            let duplicate = false;
            for (const set of topSets) {
                if (
                    dp[4][wInt].helmet === set.helmet &&
                    dp[4][wInt].chestpiece === set.chestpiece &&
                    dp[4][wInt].gauntlets === set.gauntlets &&
                    dp[4][wInt].leggings === set.leggings
                ) {
                    duplicate = true;
                    break;
                }
            }
            if (duplicate) continue;
            topSets.push(dp[4][wInt]);
            if (topSets.length === 3) break;
        }
    }

    return topSets;
}
