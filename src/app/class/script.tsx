import Equippable from "../util/types/equippable";
import StatMap, { StatMapKey } from "../util/types/statMap";

const MUTUALLY_EXCLUSIVE_TALISMANS = [
    ["radagons-scarseal", "radagons-soreseal"],
    ["marikas-scarseal", "marikas-soreseal"],
];

/**
 * Returns a StatMap that contains the total stats of all the items in the given array.
 * Items without stats are ignored.
 * If an item has no stat for a particular statId, 0 is assumed for that statId.
 * The returned StatMap object is initialized with all statIds set to 0.
 * @param {Equippable[]} items The array of items to calculate the total stats from.
 * @returns {StatMap<number>} The total stats of all the items in the given array.
 */
export function getItemStats(items: Equippable[]): StatMap<number> {
    return items.reduce(
        (totalStats: StatMap<number>, item: Equippable) =>
            (Object.keys(totalStats) as StatMapKey[]).reduce(
                (acc: StatMap<number>, statId: StatMapKey) => {
                    acc[statId]! += item.stats ? item.stats[statId]! : 0;
                    return acc;
                },
                totalStats
            ),
        {
            VIG: 0,
            END: 0,
            MND: 0,
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        }
    );
}

/**
 * Checks if the given talismanId is mutually exclusive with any of the equippedTalismans.
 * A talismanId is mutually exclusive with an equippedTalismans if they share an id in one of the MUTUALLY_EXCLUSIVE_TALISMANS groups.
 * @param {Equippable[]} equippedTalismans The array of equipped talismans to check against.
 * @param {string} talismanId The id of the talisman to check.
 * @returns {boolean} True if the talismanId is mutually exclusive with any of the equippedTalismans, false otherwise.
 */
export function isMutuallyExcluded(
    equippedTalismans: Equippable[],
    talismanId: string
): boolean {
    return MUTUALLY_EXCLUSIVE_TALISMANS.some((idGroup) =>
        equippedTalismans.some(
            (t) =>
                t.id != talismanId &&
                idGroup.includes(t.id) &&
                idGroup.includes(talismanId)
        )
    );
}
