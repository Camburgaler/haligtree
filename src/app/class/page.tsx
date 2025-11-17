"use client";

import { useCallback, useEffect, useState } from "react";
import Armor from "../util/types/armor";
import Class from "../util/types/class";
import StatMap, { StatMapKey } from "../util/types/statMap";
import Talisman from "../util/types/talisman";
import { getItemStats, isMutuallyExcluded } from "./script";

// GLOBAL CONSTANTS
const CLASSES: Class[] = Object.values(require("../data/classes.json"));
const TALISMANS: Talisman[] = (
    Object.values(require("../data/talismans.json")) as Talisman[]
).filter((value: Talisman) => value.stats != undefined);
const HELMETS: Armor[] = (
    Object.values(require("../data/helmets.json")) as Armor[]
).filter((value: Armor) => value.stats != undefined || value.id == "no-helmet");
const CHESTPIECES: Armor[] = (
    Object.values(require("../data/chestpieces.json")) as Armor[]
).filter(
    (value: Armor) => value.stats != undefined || value.id == "no-chestpiece"
);
const STAT_LONG_NAMES: StatMap<string> = {
    VIG: "Vigor",
    MND: "Mind",
    END: "Endurance",
    STR: "Strength",
    DEX: "Dexterity",
    INT: "Intelligence",
    FTH: "Faith",
    ARC: "Arcane",
};

export default function ClassPage() {
    // Desired stats are user input, and represent the "ideal" stats of a character.
    const [desiredStats, setDesiredStats] = useState<StatMap<number>>({
        VIG: 0,
        END: 0,
        MND: 0,
        STR: 0,
        DEX: 0,
        INT: 0,
        FTH: 0,
        ARC: 0,
    });

    // Item stats are the stats of the currently selected equipment
    const [itemStats, setItemStats] = useState<StatMap<number>>({
        VIG: 0,
        END: 0,
        MND: 0,
        STR: 0,
        DEX: 0,
        INT: 0,
        FTH: 0,
        ARC: 0,
    });

    // Delta is the difference between the desired stats and the class' stats
    const delta = useCallback(
        (classStats: StatMap<number>): number => {
            return (Object.keys(classStats) as StatMapKey[])
                .map((statId: StatMapKey) =>
                    classStats[statId]! <
                    desiredStats[statId]! - itemStats[statId]!
                        ? desiredStats[statId]! -
                          classStats[statId]! -
                          itemStats[statId]!
                        : 0
                )
                .reduce((total: number, n: number) => total + n);
        },
        [desiredStats, itemStats]
    );

    // Sort classes by ascending delta
    const sortClasses = useCallback((): Class[] => {
        return CLASSES.map((c: Class) => {
            c.total = c.level + delta(c.stats);
            return c;
        }).sort((a: Class, b: Class) => a.total! - b.total!);
    }, [delta]);

    // Optimal class is the class with the lowest delta
    const [optimalClass, setOptimalClass] = useState<Class>(CLASSES[0]);

    // Final stats are the optimal class's stats after leveling up
    const [finalStats, setFinalStats] = useState<StatMap<number>>({
        VIG: 0,
        END: 0,
        MND: 0,
        STR: 0,
        DEX: 0,
        INT: 0,
        FTH: 0,
        ARC: 0,
    });

    // Virtual stats are the final stats after adding equipment bonuses
    const [virtualStats, setVirtualStats] = useState<StatMap<number>>({
        VIG: 0,
        END: 0,
        MND: 0,
        STR: 0,
        DEX: 0,
        INT: 0,
        FTH: 0,
        ARC: 0,
    });

    // Sorted classes are the classes sorted by ascending delta
    const [sorted, setSorted] = useState<Class[]>(sortClasses());

    // Equipped talismans are the talismans to consider when adding equipment bonuses
    const [equippedTalismans, setEquippedTalismans] = useState<Talisman[]>([]);

    // Helmet and chestpiece are the helmet and chestpiece to consider when adding equipment bonuses
    const [helmet, setHelmet] = useState<Armor>(HELMETS[0]);
    const [chestpiece, setChestpiece] = useState<Armor>(CHESTPIECES[0]);

    // STATE UPDATE FUNCTIONS

    /**
     * Updates the desired stats state with the given statId and value.
     *
     * @param {string} statId - The statId to update.
     * @param {number} value - The value to update the statId with.
     */
    function updateDesiredStats(statId: string, value: number): void {
        setDesiredStats({
            ...desiredStats,
            [statId]: Math.min(Math.max(value, 0), 99),
        });
    }

    /**
     * Updates the equippedTalismans state by either removing the Talisman
     * with the given id if it exists, or by adding it if it doesn't.
     *
     * @param {string} value - The id of the Talisman to add or remove.
     */
    function updateEquippedTalismans(value: string): void {
        equippedTalismans.find((t) => t.id == value)
            ? setEquippedTalismans(
                  equippedTalismans.filter((t) => t.id !== value)
              )
            : setEquippedTalismans([
                  ...equippedTalismans,
                  TALISMANS.find((t) => t.id === value)!,
              ]);
    }

    /**
     * Resets all states to their default values.
     * This will reset the desired stats, equipped talismans, helmet, and chestpiece.
     */
    function resetAll() {
        setDesiredStats({
            VIG: 0,
            END: 0,
            MND: 0,
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        });
        setEquippedTalismans([]);
        setHelmet(HELMETS[0]);
        setChestpiece(CHESTPIECES[0]);
    }

    // EFFECTS

    /**
     * Calculates the optimal class when the sorted classes change.
     */
    useEffect(() => {
        // calculate best class
        setOptimalClass(sorted[0]);
    }, [sorted]);

    /**
     * Sorts the classes by ascending delta when the final stats change.
     */
    useEffect(() => {
        // sort classes
        setSorted(sortClasses());
    }, [finalStats, sortClasses]);

    /**
     * Updates the final stats and virtual stats when the desired stats, optimal class, or item stats change.
     */
    useEffect(() => {
        // calculate final stats
        let tempFinal: StatMap<number> = {
            VIG: 0,
            END: 0,
            MND: 0,
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        };
        let tempVirtual: StatMap<number> = {
            VIG: 0,
            END: 0,
            MND: 0,
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        };
        (Object.keys(desiredStats) as StatMapKey[]).forEach(
            (statId: StatMapKey) => {
                {
                    tempFinal[statId] = Math.max(
                        desiredStats[statId]! - itemStats[statId]!,
                        optimalClass?.stats[statId]!
                    );
                    tempVirtual[statId] = Math.max(
                        desiredStats[statId]!,
                        optimalClass.stats![statId]! + itemStats[statId]!
                    );
                }
            }
        );
        setFinalStats(tempFinal);
        setVirtualStats(tempVirtual);
    }, [desiredStats, optimalClass, itemStats]);

    /**
     * Updates the item stats when the helmet, chestpiece, or equipped talismans change.
     */
    useEffect(() => {
        // get added stats from items
        setItemStats(
            getItemStats([
                ...Object.values(equippedTalismans),
                helmet,
                chestpiece,
            ])
        );
    }, [helmet, chestpiece, equippedTalismans]);

    // RENDER
    return (
        <div>
            <header>
                <h1>Starting Class</h1>
            </header>
            <main>
                <div className="app">
                    <article>
                        <div>
                            <b>Class</b>
                            <input
                                id="best"
                                type="text"
                                value={optimalClass?.name}
                                disabled
                                aria-label="best"
                            />
                        </div>
                        <hr />
                        <div>
                            <ul
                                id="classes"
                                style={{ listStyleType: "none", padding: 0 }}
                            >
                                {sorted.map((cls: any) => (
                                    <li
                                        key={cls.id}
                                        style={{ display: "flex" }}
                                    >
                                        <span>{cls.name}</span>
                                        <aside>lvl. {cls.total}</aside>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                    <article>
                        <div>
                            <b />
                            <div>
                                <input
                                    value="Base"
                                    disabled
                                    style={{ width: 50 }}
                                />
                                <input
                                    value="Desired"
                                    disabled
                                    style={{
                                        width: 50,
                                    }}
                                />
                                <input
                                    value="Final"
                                    disabled
                                    style={{ width: 50 }}
                                />
                                <input
                                    value="Virtual"
                                    disabled
                                    style={{ width: 50 }}
                                />
                            </div>
                        </div>
                        <div>
                            <b>Level</b>
                            <div>
                                <input
                                    id="initial-level"
                                    type="number"
                                    value={optimalClass?.level}
                                    disabled
                                    aria-label="initial level"
                                />
                                <input
                                    type="number"
                                    style={{ visibility: "hidden" }}
                                    disabled
                                />
                                <input
                                    id="final-level"
                                    type="number"
                                    value={optimalClass.total}
                                    disabled
                                    aria-label="final level"
                                />
                                <input
                                    type="number"
                                    style={{ visibility: "hidden" }}
                                    disabled
                                />
                            </div>
                        </div>
                        <hr />
                        {(Object.keys(desiredStats) as StatMapKey[]).map(
                            (statId: StatMapKey, i: number) => (
                                <div key={statId}>
                                    <label htmlFor={statId}>
                                        {STAT_LONG_NAMES[statId]}
                                    </label>
                                    <div>
                                        <input
                                            id={"initial-" + statId}
                                            type="number"
                                            name="initial"
                                            value={optimalClass.stats[statId]}
                                            disabled
                                            aria-label={
                                                "initial " +
                                                STAT_LONG_NAMES[statId] +
                                                " level"
                                            }
                                            style={{
                                                minHeight: "24px",
                                                minWidth: "24px",
                                            }}
                                        />
                                        <input
                                            id={"desired-" + statId}
                                            type="number"
                                            name="desired"
                                            min={0}
                                            max={99}
                                            value={desiredStats[statId]}
                                            onInput={(event) =>
                                                updateDesiredStats(
                                                    statId,
                                                    event.currentTarget
                                                        .valueAsNumber
                                                )
                                            }
                                            aria-label={
                                                "desired " +
                                                STAT_LONG_NAMES[statId] +
                                                " level"
                                            }
                                            style={{
                                                minHeight: "24px",
                                                minWidth: "24px",
                                            }}
                                        />
                                        <input
                                            id={"final-" + statId}
                                            type="number"
                                            name="final"
                                            value={finalStats[statId]}
                                            disabled
                                            aria-label={
                                                "final " +
                                                STAT_LONG_NAMES[statId] +
                                                " level"
                                            }
                                            style={{
                                                minHeight: "24px",
                                                minWidth: "24px",
                                            }}
                                        />
                                        <input
                                            id={"virtual-" + statId}
                                            type="number"
                                            name="virtual"
                                            value={virtualStats[statId]}
                                            disabled
                                            aria-label={
                                                "virtual " +
                                                STAT_LONG_NAMES[statId] +
                                                " level"
                                            }
                                            style={{
                                                minHeight: "24px",
                                                minWidth: "24px",
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </article>
                    <article>
                        <div>
                            <label htmlFor="helmet">
                                <b>Helmet</b>
                            </label>
                            <select
                                id="helmet"
                                name="equipment"
                                onChange={(event) =>
                                    setHelmet(
                                        HELMETS.find(
                                            (item) =>
                                                item.id === event.target.value
                                        )!
                                    )
                                }
                                value={helmet.id}
                                style={{
                                    minHeight: "24px",
                                    minWidth: "24px",
                                }}
                            >
                                {HELMETS.map((item: Armor) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                        {item.stats
                                            ? (
                                                  Object.keys(
                                                      item.stats
                                                  ) as StatMapKey[]
                                              ).map((statId: StatMapKey) =>
                                                  item.stats![statId]
                                                      ? " +" +
                                                        item.stats![statId] +
                                                        statId
                                                      : null
                                              )
                                            : null}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="chestpiece">
                                <b>Chestpiece</b>
                            </label>
                            <select
                                id="chestpiece"
                                name="equipment"
                                onChange={(event) =>
                                    setChestpiece(
                                        CHESTPIECES.find(
                                            (item) =>
                                                item.id === event.target.value
                                        )!
                                    )
                                }
                                value={chestpiece.id}
                                style={{
                                    minHeight: "24px",
                                    minWidth: "24px",
                                }}
                            >
                                {CHESTPIECES.map((item: Armor) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                        {item.stats
                                            ? (
                                                  Object.keys(
                                                      item.stats
                                                  ) as StatMapKey[]
                                              ).map((statId: StatMapKey) =>
                                                  item.stats![statId]
                                                      ? " +" +
                                                        item.stats![statId] +
                                                        statId
                                                      : null
                                              )
                                            : null}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <hr />
                        <div>
                            <b>Talismans</b>
                        </div>
                        <div>
                            <ul
                                id="talismans"
                                style={{ listStyle: "none", padding: 0 }}
                            >
                                {TALISMANS.map((item: Talisman) => (
                                    <li
                                        key={item.id}
                                        style={{ display: "flex" }}
                                    >
                                        <div>
                                            <input
                                                id={item.id}
                                                name="talisman"
                                                type="checkbox"
                                                onChange={() =>
                                                    updateEquippedTalismans(
                                                        item.id
                                                    )
                                                }
                                                disabled={
                                                    isMutuallyExcluded(
                                                        equippedTalismans,
                                                        item.id
                                                    ) ||
                                                    (equippedTalismans.length >=
                                                        4 &&
                                                        !equippedTalismans.find(
                                                            (t) =>
                                                                t?.id ===
                                                                item.id
                                                        ))
                                                }
                                                checked={equippedTalismans.some(
                                                    (t) => t?.id === item.id
                                                )}
                                                aria-label={item.name}
                                            />
                                            <label
                                                htmlFor={item.id}
                                                style={{
                                                    minHeight: "24px",
                                                    minWidth: "24px",
                                                }}
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                        <aside style={{ fontSize: "0.8rem" }}>
                                            {(
                                                Object.keys(
                                                    item.stats
                                                ) as StatMapKey[]
                                            ).map((statId: StatMapKey) =>
                                                item.stats![statId]
                                                    ? "+" +
                                                      item.stats![statId] +
                                                      statId +
                                                      " "
                                                    : null
                                            )}
                                        </aside>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <button
                                onClick={resetAll}
                                style={{
                                    minHeight: "24px",
                                    minWidth: "24px",
                                }}
                            >
                                Reset All
                            </button>
                        </div>
                    </article>
                </div>
                <div>
                    <h2 style={{ textAlign: "center" }}>Explanation & Usage</h2>
                    <p>
                        The four columns in the second box represent, in order:
                    </p>
                    <ol>
                        <li>
                            Class base stats, i.e. the stats the class has at
                            its base level.
                        </li>
                        <li>
                            Desired stats. Here, you should input what the
                            absolute minimum stats for your build should be.
                            Leave the input fields blank for stats you
                            don&apos;t care about.
                        </li>
                        <li>
                            Final stats. These are your characters stats as they
                            should appear on your level-up screen.
                        </li>
                        <li>
                            Virtual stats. These are your characters stats after
                            talismans and helmet stat buffs are applied.
                        </li>
                    </ol>
                </div>
                <div>
                    <h2 style={{ textAlign: "center" }}>Softcaps</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Skill</th>
                                <th>Stat</th>
                                <th>Softcaps</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Vigor</td>
                                <td>HP</td>
                                <td>
                                    25 (800HP)
                                    <br />
                                    40 (1450HP)
                                    <br />
                                    60 (1900HP)
                                </td>
                                <td>
                                    A +12 upgraded crimson flask heals for
                                    810HP.
                                </td>
                            </tr>
                            <tr>
                                <td>Mind</td>
                                <td>FP</td>
                                <td>40 (220FP)</td>
                                <td>
                                    A +12 upgraded cerulean flask gives 220FP.
                                </td>
                            </tr>
                            <tr>
                                <td>Endurance</td>
                                <td>Stamina</td>
                                <td>
                                    30 (125stm.)
                                    <br />
                                    50 (155stm.)
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Equip Load</td>
                                <td>
                                    25 (72 wgt.)
                                    <br />
                                    60 (120 wgt.)
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Strength</td>
                                <td>AR</td>
                                <td>
                                    37 ≃ 55 (2h)
                                    <br />
                                    54 ≃ 80 (2h)
                                    <br />
                                    66 ≃ 99 (2h)
                                    <br />
                                    80
                                </td>
                                <td>2-handing gives you 1.5x strength.</td>
                            </tr>
                            <tr>
                                <td>Dexterity</td>
                                <td>AR</td>
                                <td>55, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Intelligence</td>
                                <td>AR</td>
                                <td>55, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Spell Buff</td>
                                <td>60, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Faith</td>
                                <td>AR</td>
                                <td>55, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Spell Buff</td>
                                <td>60, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Arcane</td>
                                <td>AR</td>
                                <td>55, 80</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Status</td>
                                <td>45, 60</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Spell Buff</td>
                                <td>
                                    60, 80 (Pure catalyst)
                                    <br />
                                    30, 45 (Hybrid catalyst)
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
