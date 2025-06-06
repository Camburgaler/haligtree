"use client";

import { useCallback, useEffect, useState } from "react";
import Armor from "../util/types/armor";
import Class from "../util/types/class";
import Equippable from "../util/types/equippable";
import StatMap, { StatMapKey } from "../util/types/statMap";
import Talisman from "../util/types/talisman";

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
const MUTUALLY_EXCLUSIVE_TALISMANS = [
    ["radagons-scarseal", "radagons-soreseal"],
    ["marikas-scarseal", "marikas-soreseal"],
];

export default function ClassPage() {
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

    const delta = useCallback(
        (classStats: StatMap<number>): number => {
            return (Object.keys(classStats) as StatMapKey[])
                .map((statId: StatMapKey) =>
                    classStats[statId]! < desiredStats[statId]!
                        ? desiredStats[statId]! - classStats[statId]!
                        : 0
                )
                .reduce((total: number, n: number) => total + n);
        },
        [desiredStats]
    );

    const sortClasses = useCallback((): Class[] => {
        return CLASSES.map((c: Class) => {
            c.total = c.level + delta(c.stats);
            return c;
        }).sort((a: Class, b: Class) => a.total! - b.total!);
    }, [delta]);

    const [best, setBest] = useState<Class>(CLASSES[0]);
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
    const [sorted, setSorted] = useState<Class[]>(sortClasses());
    const [equippedTalismans, setEquippedTalismans] = useState<Talisman[]>([]);
    const [helmet, setHelmet] = useState<Armor>(HELMETS[0]);
    const [chestpiece, setChestpiece] = useState<Armor>(CHESTPIECES[0]);
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

    // STATE UPDATE FUNCTIONS
    function updateDesiredStats(statId: string, value: number): void {
        setDesiredStats({
            ...desiredStats,
            [statId]: Math.min(Math.max(value, 0), 99),
        });
    }

    function updateEquippedTalismans(value: string, add: boolean): void {
        setEquippedTalismans(
            add
                ? [...equippedTalismans, TALISMANS.find((t) => t.id === value)!]
                : [...equippedTalismans.filter((t) => t.id !== value)]
        );
    }

    // FUNCTIONS
    function getItemStats(relevantItems: Equippable[]): StatMap<number> {
        return relevantItems.reduce(
            (total: StatMap<number>, item: Equippable) =>
                (Object.keys(total) as StatMapKey[]).reduce(
                    (acc: StatMap<number>, statId: StatMapKey) => {
                        acc[statId]! += item?.stats ? item.stats[statId]! : 0;
                        return acc;
                    },
                    total
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

    function isMutuallyExcluded(talismanId: string): boolean {
        return MUTUALLY_EXCLUSIVE_TALISMANS.some((idGroup) =>
            equippedTalismans.some(
                (t) =>
                    t.id != talismanId &&
                    idGroup.includes(t.id) &&
                    idGroup.includes(talismanId)
            )
        );
    }

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
    useEffect(() => {
        // calculate best class
        setBest(sorted[0]);
    }, [sorted]);

    useEffect(() => {
        // sort classes
        setSorted(sortClasses());
    }, [finalStats, sortClasses]);

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
                        best?.stats[statId]!
                    );
                    tempVirtual[statId] = Math.max(
                        desiredStats[statId]!,
                        best.stats![statId]! + itemStats[statId]!
                    );
                }
            }
        );
        setFinalStats(tempFinal);
        setVirtualStats(tempVirtual);
    }, [desiredStats, best, itemStats]);

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
                                value={best?.name}
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
                            <b>Level</b>
                            <div>
                                <input
                                    id="initial-level"
                                    type="number"
                                    value={best?.level}
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
                                    value={best.total}
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
                                            value={best.stats[statId]}
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
                                                onChange={(event) =>
                                                    updateEquippedTalismans(
                                                        item.id,
                                                        event.target.checked
                                                    )
                                                }
                                                disabled={
                                                    isMutuallyExcluded(
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
                            Class base stats, e.g. the stats the class has at
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
