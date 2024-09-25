import {
    CORRECTIONS,
    DAMAGE_TYPE_MODE_All,
    DAMAGE_TYPE_MODE_ANY,
    INFUSIONS,
    WEAPONS,
} from "../util/constants";
import CategoryMap from "../util/interfaces/categoryMap";
import DamageTypeMap from "../util/interfaces/damageTypeMap";
import InfusionMap from "../util/interfaces/infusionMap";
import StatMap from "../util/interfaces/statMap";
import Correction from "../util/types/correction";
import Infusion from "../util/types/infusion";
import Weapon from "../util/types/weapon";
import WeaponInfusion from "../util/types/weaponInfusion";
import { WeaponResultRow } from "./components/WeaponResultRow";

// TYPES
export type WeaponResult = {
    weaponName: string;
    attackRatings: InfusionMap<number>;
    max: number;
    arBreakdown: InfusionMap<{
        baseDmg: DamageTypeMap<number>;
        scalingDmg: DamageTypeMap<number>;
    }>;
};
export type SortBy = {
    dmgType: string;
    desc: boolean;
};

// HELPER FUNCTIONS
const isSplitDamage = (dmg: DamageTypeMap<number>): boolean => {
    let temp: DamageTypeMap<number> = {
        physical: dmg.physical,
        magic: dmg.magic,
        fire: dmg.fire,
        lightning: dmg.lightning,
        holy: dmg.holy,
    };
    return (
        Object.values(temp).reduce(
            (dmgTypes: number, dmg: number | undefined) => {
                return dmg! > 0 ? dmgTypes + 1 : dmgTypes;
            },
            0
        )! > 1
    );
};

const anyDamageTypes = (
    dmg: DamageTypeMap<number>,
    damageTypes: DamageTypeMap<boolean>,
    damageTypesInclude: boolean
): boolean => {
    let result: boolean = Object.entries(dmg).some(
        ([key, value]) => damageTypes[key] && value
    );
    return damageTypesInclude ? result : !result;
};

const allDamageTypes = (
    dmg: DamageTypeMap<number>,
    damageTypes: DamageTypeMap<boolean>,
    damageTypesInclude: boolean
): boolean => {
    let result: boolean = true;
    if (!(Object.values(damageTypes) as boolean[]).includes(true)) {
        result = false;
    } else {
        result = Object.entries(dmg).every(([key, value]) =>
            damageTypes[key] ? value! > 0 : true
        ) as boolean;
    }
    return damageTypesInclude ? result : !result;
};

const exactlyDamageTypes = (
    dmg: DamageTypeMap<number>,
    damageTypes: DamageTypeMap<boolean>,
    damageTypesInclude: boolean
): boolean => {
    let result: boolean = Object.entries(damageTypes).every(([key, value]) =>
        value ? dmg[key]! > 0 : dmg[key]! == 0 || dmg[key]! == undefined
    ) as boolean;
    return damageTypesInclude ? result : !result;
};

// FUNCTIONS
function corrections(
    calc: Correction,
    stats: StatMap,
    masks: StatMap
): StatMap {
    let result: StatMap = {
        STR: 0,
        DEX: 0,
        INT: 0,
        FTH: 0,
        ARC: 0,
    };
    Object.entries(stats).forEach(
        ([statId, statVal]: [string, number | undefined]) => {
            if (masks[statId]) {
                let capIndex: number = calc.softcaps.findIndex(
                    (cap: number) => cap >= statVal!
                );
                capIndex == -1
                    ? (capIndex = calc.softcaps.length - 2)
                    : (capIndex = capIndex - 1);
                let cap: number = calc.softcaps[capIndex];
                let capDelta: number =
                    (calc.softcaps[capIndex + 1] ?? cap) - cap;
                let growth: number = calc.growth[capIndex];
                let growthDelta: number =
                    (calc.growth[capIndex + 1] ?? growth) - growth;
                let adjust: number = calc.adjustments[capIndex];
                // in case statVal > hardcap
                let effectiveStatVal: number = Math.min(
                    statVal as number,
                    calc.softcaps[capIndex + 1]
                );

                result[statId] =
                    Math.sign(adjust) != -1
                        ? growth +
                          growthDelta *
                              ((effectiveStatVal - cap) / capDelta) ** adjust
                        : growth +
                          growthDelta *
                              (1 -
                                  (1 - (effectiveStatVal - cap) / capDelta) **
                                      Math.abs(adjust));
            }
        }
    );

    return result;
}

function damage(
    weapon: Weapon,
    infusion: Infusion,
    upgraded: boolean,
    stats: StatMap,
    splitDamage: boolean,
    damageTypesInclude: boolean,
    damageTypeMode: string,
    damageTypes: DamageTypeMap<boolean>,
    statusEffects: boolean
): WeaponResult {
    // initialize result
    let result: WeaponResult = {
        attackRatings: {},
        max: 0,
        arBreakdown: {},
        weaponName: "",
    };
    let infId: string = Object.keys(infusion)[0];
    let inf = Object.values(infusion)[0];

    // initialize weapon infusion
    let weaponInfusion: WeaponInfusion = weapon.infusions[infId]!;
    weaponInfusion.masks = {
        ...weaponInfusion.masks,
        blood: {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 1,
        },
        poison: {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 1,
        },
        sleep: {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 1,
        },
        madness: {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 1,
        },
        frost: {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        },
        "scarlet-rot": {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        },
    };

    // initialize upgrade level
    let upgLevel: number = upgraded ? (weapon.unique ? 10 : 25) : 0;

    // initialize base damage
    let baseDmg: DamageTypeMap<number> = {
        physical: 0,
        magic: 0,
        fire: 0,
        lightning: 0,
        holy: 0,
    };
    // populate base damage
    Object.entries(inf.damage).forEach(
        ([dmgTypeId, dmg]: [string, number | undefined]) => {
            baseDmg[dmgTypeId] =
                weaponInfusion.damage[dmgTypeId]! *
                (dmg! +
                    inf.upgrade[dmgTypeId]! *
                        upgLevel *
                        (weapon.unique ? 2.5 : 1.0));
        }
    );
    // include aux damage if it is present
    if (weaponInfusion.aux) {
        Object.entries(weaponInfusion.aux).forEach(
            ([dmgTypeId, dmg]: [string, [number, number]]) => {
                baseDmg[dmgTypeId] = upgraded ? dmg[1] : dmg[0];
            }
        );
    }

    // if weapon is split damage, set base damage to 0
    if (isSplitDamage(baseDmg) && !splitDamage) {
        baseDmg = {
            physical: 0,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 0,
        };
    }
    let matchesDamageTypes: boolean =
        damageTypeMode == DAMAGE_TYPE_MODE_ANY
            ? anyDamageTypes(baseDmg, damageTypes, damageTypesInclude)
            : damageTypeMode == DAMAGE_TYPE_MODE_All
            ? allDamageTypes(baseDmg, damageTypes, damageTypesInclude)
            : exactlyDamageTypes(baseDmg, damageTypes, damageTypesInclude);

    // if weapon does not match damage types, set base damage to 0
    if (!matchesDamageTypes) {
        baseDmg = {
            physical: 0,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 0,
        };
    }

    let scalingDmg: DamageTypeMap<number> = {
        physical: 0,
        magic: 0,
        fire: 0,
        lightning: 0,
        holy: 0,
    };
    Object.keys(stats).some(
        (statId: string, i: number) => stats[statId]! < weapon.requirements[i]!
    )
        ? Object.entries(baseDmg).forEach(
              ([dmgTypeId, dmg]) => (scalingDmg[dmgTypeId] = dmg! * -0.4)
          )
        : Object.entries(baseDmg).forEach(([dmgTypeId, dmg]) => {
              let calcCorrect: StatMap = corrections(
                  CORRECTIONS.find(
                      (c) => c.id == weaponInfusion.corrections[dmgTypeId]
                  )!,
                  stats,
                  weaponInfusion.masks[dmgTypeId]!
              );
              let statScaling: StatMap = {
                  STR: 0,
                  DEX: 0,
                  INT: 0,
                  FTH: 0,
                  ARC: 0,
              };
              Object.entries(weaponInfusion.scaling).forEach(
                  ([statId, scaling]: [string, number | undefined]) =>
                      (statScaling[statId] =
                          inf.scaling[statId]! *
                          (scaling! +
                              scaling! *
                                  inf.growth[statId]! *
                                  upgLevel *
                                  (weapon.unique ? 4.0 : 1.0)))
              );
              scalingDmg[dmgTypeId] = Object.entries(statScaling)
                  .map(([statId, scaling]: [string, number | undefined]) => {
                      return (dmg! * scaling! * calcCorrect[statId]!) / 100.0;
                  })
                  .reduce((sum: number, n: number) => sum + n);
          });

    result = {
        weaponName: "",
        arBreakdown: {
            [infId]: {
                baseDmg: baseDmg,
                scalingDmg: scalingDmg,
            },
        },
        max: 0,
        attackRatings: {
            [infId]: Math.floor(
                (Object.entries(baseDmg) as [string, number][]).reduce(
                    (sum: [string, number], n: [string, number]) =>
                        statusEffects ||
                        (n[0] != "blood" &&
                            n[0] != "poison" &&
                            n[0] != "frost" &&
                            n[0] != "scarlet-rot" &&
                            n[0] != "madness" &&
                            n[0] != "sleep")
                            ? ["", sum[1] + n[1]]
                            : sum
                )[1] +
                    (Object.entries(scalingDmg) as [string, number][]).reduce(
                        (sum: [string, number], n: [string, number]) =>
                            statusEffects ||
                            (n[0] != "blood" &&
                                n[0] != "poison" &&
                                n[0] != "frost" &&
                                n[0] != "scarlet-rot" &&
                                n[0] != "madness" &&
                                n[0] != "sleep")
                                ? ["", sum[1] + n[1]]
                                : sum
                    )[1]
            ),
        },
    };

    return result;
}

function filterWeapons(
    stats: StatMap,
    twoHanded: boolean,
    requireStats: boolean,
    categories: CategoryMap<boolean>,
    infusions: InfusionMap<boolean>,
    buffableOnly: boolean,
    splitDamage: boolean,
    damageTypesInclude: boolean,
    damageTypeMode: string,
    damageTypes: DamageTypeMap<boolean>
): Weapon[] {
    return WEAPONS.filter((weapon) => {
        // filter out weapons that don't fit the current parameters
        return (
            // check all stats except for STR
            ((Object.keys(weapon.requirements).every((statName: string) =>
                statName == "STR"
                    ? true
                    : stats[statName]! >= weapon.requirements[statName]!
            ) &&
                // and if the weapon is using two handed damage
                (twoHanded
                    ? // then use the two handing formula for STR
                      stats["STR"] * 1.5 >= weapon.requirements["STR"]
                    : // else use the one handed formula for STR
                      stats["STR"] >= weapon.requirements["STR"])) ||
                // or ignore stats if not required
                !requireStats) &&
            // and if the weapon's category is allowed
            categories[weapon.category] &&
            // and if the weapon's infusion is allowed
            Object.entries(weapon.infusions).some(
                ([infId, infusion]) =>
                    infusions[infId] &&
                    Object.values(infusion?.damage!).some((d) => d! > 0)
            ) &&
            // and if the weapon is buffable or buffable is not required
            (!buffableOnly ||
                Object.values(weapon.infusions).some((inf) => inf?.buffable)) &&
            // and if the weapon is split damage (prefer for check to be done with Heavy infusion to catch cases where the Standard infusion is split but the physical infusions are not)
            (isSplitDamage(
                weapon.infusions.heavy?.damage ??
                    weapon.infusions.standard!.damage
            )
                ? // then defer to whether split damage is allowed
                  splitDamage
                : true) &&
            // and if the weapon has only Standard infusion and contains selected damage type
            (weapon.infusions.heavy ??
                (damageTypeMode == DAMAGE_TYPE_MODE_ANY
                    ? anyDamageTypes(
                          weapon.infusions.standard!.damage,
                          damageTypes,
                          damageTypesInclude
                      )
                    : damageTypeMode == DAMAGE_TYPE_MODE_All
                    ? allDamageTypes(
                          weapon.infusions.standard!.damage,
                          damageTypes,
                          damageTypesInclude
                      )
                    : exactlyDamageTypes(
                          weapon.infusions.standard!.damage,
                          damageTypes,
                          damageTypesInclude
                      )))
        );
    });
}

export function mapWeapons(
    stats: StatMap,
    twoHanded: boolean,
    requireStats: boolean,
    categories: CategoryMap<boolean>,
    infusions: InfusionMap<boolean>,
    buffableOnly: boolean,
    splitDamage: boolean,
    damageTypesInclude: boolean,
    damageTypeMode: string,
    damageTypes: DamageTypeMap<boolean>,
    reinforced: boolean,
    statusEffects: boolean
): WeaponResult[] {
    return filterWeapons(
        stats,
        twoHanded,
        requireStats,
        categories,
        infusions,
        buffableOnly,
        splitDamage,
        damageTypesInclude,
        damageTypeMode,
        damageTypes
    ).map((weapon) => {
        // calculate attack ratings for every allowed infusion as well as the maximum damage of any infusion
        let result: WeaponResult = {
            weaponName: weapon.name,
            attackRatings: {},
            max: 0,
            arBreakdown: {},
        };
        Object.entries(INFUSIONS)
            .filter(([infId, inf]) => infusions[infId])
            .forEach(([infId, inf]) => {
                let temp: WeaponResult = {
                    weaponName: weapon.name,
                    attackRatings: {
                        [inf.id]: 0,
                    },
                    max: 0,
                    arBreakdown: {
                        [inf.id]: {
                            baseDmg: {
                                physical: 0,
                                magic: 0,
                                fire: 0,
                                lightning: 0,
                                holy: 0,
                            },
                            scalingDmg: {
                                physical: 0,
                                magic: 0,
                                fire: 0,
                                lightning: 0,
                                holy: 0,
                            },
                        },
                    },
                };

                if (
                    (buffableOnly
                        ? weapon.infusions[inf.id]?.buffable
                        : true) &&
                    (weapon.infusions[inf.id]
                        ? Object.values(weapon.infusions[inf.id]?.damage!).some(
                              (d) => d! > 0
                          )
                        : false)
                ) {
                    temp = damage(
                        weapon,
                        { [infId]: inf },
                        reinforced,
                        twoHanded
                            ? {
                                  ...stats,
                                  STR: stats["STR"] * 1.5,
                              }
                            : stats,
                        splitDamage,
                        damageTypesInclude,
                        damageTypeMode,
                        damageTypes,
                        statusEffects
                    );
                }
                result = {
                    ...result,
                    arBreakdown: {
                        ...result.arBreakdown,
                        ...temp.arBreakdown,
                    },
                    attackRatings: {
                        ...result.attackRatings,
                        [inf.id]: Object.keys(weapon.infusions).find(
                            (infId) => infId == inf.id
                        )
                            ? !buffableOnly ||
                              weapon.infusions[
                                  Object.keys(weapon.infusions).find(
                                      (infId) => infId == inf.id
                                  )!
                              ]?.buffable
                                ? temp.attackRatings[inf.id]
                                : 0
                            : 0,
                    },
                };
            });

        result.max = Math.max(
            0,
            ...(Object.values(result.attackRatings) as number[])
        );

        return result;
    });
}

function sortResults(results: WeaponResult[], sortBy: SortBy): WeaponResult[] {
    return results.sort((a, b) => {
        // sort based on current sort order
        if (sortBy.dmgType == "max") {
            // sort by max
            return sortBy.desc ? b.max - a.max : a.max - b.max;
        } else {
            return sortBy.desc
                ? b.attackRatings[sortBy.dmgType]! -
                      a.attackRatings[sortBy.dmgType]!
                : a.attackRatings[sortBy.dmgType]! -
                      b.attackRatings[sortBy.dmgType]!;
        }
    });
}

export function mapResults(
    results: WeaponResult[],
    sortBy: SortBy
): JSX.Element[] {
    return sortResults(results, sortBy).map((weaponResult) => (
        <WeaponResultRow
            key={weaponResult.weaponName.replaceAll(" ", "-")}
            weaponName={weaponResult.weaponName}
            attackRatings={weaponResult.attackRatings}
            max={weaponResult.max}
            arBreakdown={weaponResult.arBreakdown}
        />
    ));
}
