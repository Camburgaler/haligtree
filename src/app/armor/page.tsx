"use client";

import { useEffect, useState } from "react";
import {
    ARMOR_RESULTS_SET_IDS,
    CHESTPIECES,
    GAUNTLETS,
    HELMETS,
    LEGGINGS,
} from "../util/constants";
import Armor from "../util/types/armor";
import ArmorSet from "../util/types/armorSet";
import ArmorResultSet from "./components/ArmorResultSet";
import InputNumber from "./components/InputNumber";
import InputRadio from "./components/InputRadio";
import InputSelect from "./components/InputSelect";
import {
    dominated,
    itemStatsToString,
    knapSack,
    resetAll,
    setStatsToString,
} from "./script";

export default function ArmorPage() {
    // STATES
    const [best, setBest] = useState(Array<ArmorSet>());
    const [maxEquipLoad, setMaxEquipLoad] = useState(30);
    const [currentEquipLoad, setCurrentEquipLoad] = useState(0);
    const [equipLoadBudget, setEquipLoadBudget] = useState(21);
    const [breakpoint, setBreakpoint] = useState(0.7);
    const [sortBy, setSortBy] = useState("sort-standard");
    const [lockedItems, setLockedItems] = useState<ArmorSet>({
        helmet: undefined,
        chestpiece: undefined,
        gauntlets: undefined,
        leggings: undefined,
    });
    const [ignoredItems, setIgnoredItems] = useState(Array<Armor>());
    const [helmets, setHelmets] = useState(Array<Armor>());
    const [chestpieces, setChestpieces] = useState(Array<Armor>());
    const [gauntlets, setGauntlets] = useState(Array<Armor>());
    const [leggings, setLeggings] = useState(Array<Armor>());
    const [pressedKeys, setPressedKeys] = useState(new Set());

    const hotkeyGroups = [
        ["`", "1", "2", "3"],
        ["4", "5", "6", "7"],
        ["8", "9", "0", "-"],
    ];

    // STATE UPDATE FUNCTIONS
    function updateLockedItems(itemType: string, newItem: Armor): void {
        if (
            itemType != "helmet" &&
            itemType != "chestpiece" &&
            itemType != "gauntlets" &&
            itemType != "leggings"
        ) {
            throw new Error("Invalid item type");
        }

        setLockedItems({ ...lockedItems, [itemType]: newItem });
    }

    function updateMaxEquipLoad(value: number): void {
        setMaxEquipLoad(value);
    }

    function updateCurrentEquipLoad(value: number): void {
        setCurrentEquipLoad(value);
    }

    function updateBreakpoint(value: number): void {
        setBreakpoint(value);
    }

    function updateSortBy(value: string): void {
        setSortBy(value);
    }

    function addIgnoredItem(newItem: Armor): void {
        if (ignoredItems.includes(newItem)) return;
        setIgnoredItems([...ignoredItems, newItem]);
    }

    function removeIgnoredItem(oldItem: Armor): void {
        setIgnoredItems([...ignoredItems.filter((i) => i !== oldItem)]);
    }

    // HELPER FUNCTIONS
    const ignoreAll = (): void => {
        // filter out No Helmet, No Chestpiece, No Gauntlets, No Leggings
        var completeList = [
            ...HELMETS.slice(1),
            ...CHESTPIECES.slice(1),
            ...GAUNTLETS.slice(1),
            ...LEGGINGS.slice(1),
        ];
        setIgnoredItems(completeList);
    };

    const restoreAll = (): void => {
        setIgnoredItems([]);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));

        if (pressedKeys.has("Control") && pressedKeys.has("i")) {
            switch (event.key) {
                case hotkeyGroups[0][0]:
                    addIgnoredItem(best[0].helmet!);
                    break;
                case hotkeyGroups[0][1]:
                    addIgnoredItem(best[0].chestpiece!);
                    break;
                case hotkeyGroups[0][2]:
                    addIgnoredItem(best[0].gauntlets!);
                    break;
                case hotkeyGroups[0][3]:
                    addIgnoredItem(best[0].leggings!);
                    break;
                case hotkeyGroups[1][0]:
                    addIgnoredItem(best[1].helmet!);
                    break;
                case hotkeyGroups[1][1]:
                    addIgnoredItem(best[1].chestpiece!);
                    break;
                case hotkeyGroups[1][2]:
                    addIgnoredItem(best[1].gauntlets!);
                    break;
                case hotkeyGroups[1][3]:
                    addIgnoredItem(best[1].leggings!);
                    break;
                case hotkeyGroups[2][0]:
                    addIgnoredItem(best[2].helmet!);
                    break;
                case hotkeyGroups[2][1]:
                    addIgnoredItem(best[2].chestpiece!);
                    break;
                case hotkeyGroups[2][2]:
                    addIgnoredItem(best[2].gauntlets!);
                    break;
                case hotkeyGroups[2][3]:
                    addIgnoredItem(best[2].leggings!);
                    break;
                default:
                    break;
            }
        }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
        setPressedKeys((prevKeys) => {
            const newKeys = new Set(prevKeys);
            newKeys.delete(event.key);
            return newKeys;
        });
    };

    // EFFECTS
    useEffect(() => {
        // Load data from localStorage on component mount
        const localMaxEquipLoad = localStorage.getItem("localMaxEquipLoad");
        if (localMaxEquipLoad) {
            setMaxEquipLoad(JSON.parse(localMaxEquipLoad));
        }

        const localCurrentEquipLoad = localStorage.getItem(
            "localCurrentEquipLoad"
        );
        if (localCurrentEquipLoad) {
            setCurrentEquipLoad(JSON.parse(localCurrentEquipLoad));
        }

        const localBreakpoint = localStorage.getItem("localBreakpoint");
        if (localBreakpoint) {
            setBreakpoint(JSON.parse(localBreakpoint));
        }

        const localSortBy = localStorage.getItem("localSortBy");
        if (localSortBy) {
            setSortBy(JSON.parse(localSortBy));
        }

        const localLockedItems = localStorage.getItem("localLockedItems");
        if (localLockedItems) {
            setLockedItems(JSON.parse(localLockedItems));
        }

        const localIgnoredItems = localStorage.getItem("localIgnoredItems");
        if (localIgnoredItems) {
            setIgnoredItems(JSON.parse(localIgnoredItems));
        }
    }, []);

    useEffect(() => {
        // Add event listeners for hotkeys
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [pressedKeys]);

    useEffect(() => {
        localStorage.setItem("localMaxEquipLoad", JSON.stringify(maxEquipLoad));
    }, [maxEquipLoad]);

    useEffect(() => {
        localStorage.setItem(
            "localCurrentEquipLoad",
            JSON.stringify(currentEquipLoad)
        );
    }, [currentEquipLoad]);

    useEffect(() => {
        localStorage.setItem("localBreakpoint", JSON.stringify(breakpoint));
    }, [breakpoint]);

    useEffect(() => {
        localStorage.setItem("localSortBy", JSON.stringify(sortBy));
    }, [sortBy]);

    useEffect(() => {
        localStorage.setItem("localLockedItems", JSON.stringify(lockedItems));
    }, [lockedItems]);

    useEffect(() => {
        localStorage.setItem("localIgnoredItems", JSON.stringify(ignoredItems));
    }, [ignoredItems]);

    useEffect(() => {
        setBest(
            knapSack(
                equipLoadBudget,
                helmets,
                chestpieces,
                gauntlets,
                leggings,
                sortBy
            )
        );
    }, [equipLoadBudget, helmets, chestpieces, gauntlets, leggings, sortBy]);

    useEffect(() => {
        setHelmets(dominated(HELMETS, lockedItems, ignoredItems, sortBy));
        setChestpieces(
            dominated(CHESTPIECES, lockedItems, ignoredItems, sortBy)
        );
        setGauntlets(dominated(GAUNTLETS, lockedItems, ignoredItems, sortBy));
        setLeggings(dominated(LEGGINGS, lockedItems, ignoredItems, sortBy));
    }, [lockedItems, ignoredItems, sortBy]);

    useEffect(() => {
        setEquipLoadBudget(
            Math.max(maxEquipLoad * breakpoint - currentEquipLoad, 0.0)
        );
    }, [maxEquipLoad, currentEquipLoad, breakpoint]);

    // RENDER
    return (
        <div>
            <header>
                <h1>Armor Optimizer</h1>
            </header>
            <main>
                <div className="app">
                    {/* <!-- settings --> */}
                    <article style={{ flexBasis: "25%" }}>
                        <b>Settings</b>
                        <hr />
                        <InputNumber
                            label="Max. Equip Load"
                            className="stat"
                            id="max-equip-load"
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    event.target.value = "0";
                                }
                                updateMaxEquipLoad(
                                    parseFloat(event.target.value)
                                );
                            }}
                            value={maxEquipLoad}
                            name="equip-load"
                        />
                        <InputNumber
                            label="Current Equip Load"
                            className="stat"
                            id="current-equip-load"
                            onChange={(event) => {
                                if (event.target.value == "") {
                                    event.target.value = "0";
                                }
                                updateCurrentEquipLoad(
                                    parseFloat(event.target.value)
                                );
                            }}
                            value={currentEquipLoad}
                            name="equip-load"
                        />
                        <InputNumber
                            label="Equip Load Budget"
                            className="stat"
                            id="equip-load-budget"
                            value={equipLoadBudget}
                            name="equip-load"
                            disabled
                        />
                        <hr />
                        <b>Breakpoints</b>
                        <InputRadio
                            label="Fast Roll (up to 30% equip load)"
                            id="fast-roll"
                            onClick={() => updateBreakpoint(0.3)}
                            name="roll-type"
                            checked={breakpoint === 0.3}
                        />
                        <InputRadio
                            label="Normal Roll (up to 70% equip load)"
                            id="normal-roll"
                            onClick={() => updateBreakpoint(0.7)}
                            name="roll-type"
                            checked={breakpoint === 0.7}
                        />
                        <InputRadio
                            label="Fat Roll (up to 100% equip load)"
                            id="fat-roll"
                            onClick={() => updateBreakpoint(1.0)}
                            name="roll-type"
                            checked={breakpoint === 1.0}
                        />
                        <hr />
                        <b>Sort by</b>
                        <InputRadio
                            label="Greatest Average Absorption"
                            id="sort-average"
                            onClick={() => updateSortBy("sort-average")}
                            name="sorting-order"
                            checked={sortBy === "sort-average"}
                        />
                        <InputRadio
                            label="Greatest Standard Absorption"
                            id="sort-standard"
                            onClick={() => updateSortBy("sort-standard")}
                            name="sorting-order"
                            checked={sortBy === "sort-standard"}
                        />
                        <InputRadio
                            label="Greatest Physical Absorption"
                            id="sort-physical"
                            onClick={() => updateSortBy("sort-physical")}
                            name="sorting-order"
                            checked={sortBy === "sort-physical"}
                        />
                        <InputRadio
                            label="Greatest Strike Absorption"
                            id="sort-strike"
                            onClick={() => updateSortBy("sort-strike")}
                            name="sorting-order"
                            checked={sortBy === "sort-strike"}
                        />
                        <InputRadio
                            label="Greatest Slash Absorption"
                            id="sort-slash"
                            onClick={() => updateSortBy("sort-slash")}
                            name="sorting-order"
                            checked={sortBy === "sort-slash"}
                        />
                        <InputRadio
                            label="Greatest Pierce Absorption"
                            id="sort-pierce"
                            onClick={() => updateSortBy("sort-pierce")}
                            name="sorting-order"
                            checked={sortBy === "sort-pierce"}
                        />
                        <InputRadio
                            label="Greatest Elemental Absorption"
                            id="sort-elemental"
                            onClick={() => updateSortBy("sort-elemental")}
                            name="sorting-order"
                            checked={sortBy === "sort-elemental"}
                        />
                        <InputRadio
                            label="Greatest Magic Absorption"
                            id="sort-magic"
                            onClick={() => updateSortBy("sort-magic")}
                            name="sorting-order"
                            checked={sortBy === "sort-magic"}
                        />
                        <InputRadio
                            label="Greatest Fire Absorption"
                            id="sort-fire"
                            onClick={() => updateSortBy("sort-fire")}
                            name="sorting-order"
                            checked={sortBy === "sort-fire"}
                        />
                        <InputRadio
                            label="Greatest Lightning Absorption"
                            id="sort-lightning"
                            onClick={() => updateSortBy("sort-lightning")}
                            name="sorting-order"
                            checked={sortBy === "sort-lightning"}
                        />
                        <InputRadio
                            label="Greatest Holy Absorption"
                            id="sort-holy"
                            onClick={() => updateSortBy("sort-holy")}
                            name="sorting-order"
                            checked={sortBy === "sort-holy"}
                        />
                        <InputRadio
                            label="Greatest Average Resistance"
                            id="sort-resistances"
                            onClick={() => updateSortBy("sort-resistances")}
                            name="sorting-order"
                            checked={sortBy === "sort-resistances"}
                        />
                        <InputRadio
                            label="Greatest Scarlet Rot Resistance"
                            id="sort-scarlet-rot"
                            onClick={() => updateSortBy("sort-scarlet-rot")}
                            name="sorting-order"
                            checked={sortBy === "sort-scarlet-rot"}
                        />
                        <InputRadio
                            label="Greatest Poison Resistance"
                            id="sort-poison"
                            onClick={() => updateSortBy("sort-poison")}
                            name="sorting-order"
                            checked={sortBy === "sort-poison"}
                        />
                        <InputRadio
                            label="Greatest Hemorrhage Resistance"
                            id="sort-hemorrhage"
                            onClick={() => updateSortBy("sort-hemorrhage")}
                            name="sorting-order"
                            checked={sortBy === "sort-hemorrhage"}
                        />
                        <InputRadio
                            label="Greatest Frostbite Resistance"
                            id="sort-frostbite"
                            onClick={() => updateSortBy("sort-frostbite")}
                            name="sorting-order"
                            checked={sortBy === "sort-frostbite"}
                        />
                        <InputRadio
                            label="Greatest Sleep Resistance"
                            id="sort-sleep"
                            onClick={() => updateSortBy("sort-sleep")}
                            name="sorting-order"
                            checked={sortBy === "sort-sleep"}
                        />
                        <InputRadio
                            label="Greatest Madness Resistance"
                            id="sort-madness"
                            onClick={() => updateSortBy("sort-madness")}
                            name="sorting-order"
                            checked={sortBy === "sort-madness"}
                        />
                        <InputRadio
                            label="Greatest Death Resistance"
                            id="sort-death"
                            onClick={() => updateSortBy("sort-death")}
                            name="sorting-order"
                            checked={sortBy === "sort-death"}
                        />
                        <InputRadio
                            label="Greatest Poise"
                            id="sort-poise"
                            onClick={() => updateSortBy("sort-poise")}
                            name="sorting-order"
                            checked={sortBy === "sort-poise"}
                        />
                        {/* <InputRadio
                            label="Custom"
                            id="sort-custom"
                            onClick={() => updateSortBy("sort-custom")}
                            name="sorting-order"
                            checked={sortBy === "sort-custom"}
                        /> */}
                        <hr />
                        <div>
                            <b>Locked Armor</b>
                            <button id="clear-equipment" onClick={resetAll}>
                                Reset All
                            </button>
                        </div>
                        <InputSelect
                            label="Helmet"
                            id="locked-helmet"
                            name="locked-items"
                            onChange={(event) => {
                                updateLockedItems(
                                    "helmet",
                                    HELMETS.find(
                                        (item) => item.id === event.target.value
                                    )!
                                );
                            }}
                            options={HELMETS}
                            value={lockedItems.helmet?.id}
                        />
                        <InputSelect
                            label="Chestpiece"
                            id="locked-chestpiece"
                            name="locked-items"
                            onChange={(event) => {
                                updateLockedItems(
                                    "chestpiece",
                                    CHESTPIECES.find(
                                        (item) => item.id === event.target.value
                                    )!
                                );
                            }}
                            options={CHESTPIECES}
                            value={lockedItems.chestpiece?.id}
                        />
                        <InputSelect
                            label="Gauntlets"
                            id="locked-gauntlets"
                            name="locked-items"
                            onChange={(event) => {
                                updateLockedItems(
                                    "gauntlets",
                                    GAUNTLETS.find(
                                        (item) => item.id === event.target.value
                                    )!
                                );
                            }}
                            options={GAUNTLETS}
                            value={lockedItems.gauntlets?.id}
                        />
                        <InputSelect
                            label="Leggings"
                            id="locked-leggings"
                            name="locked-items"
                            onChange={(event) => {
                                updateLockedItems(
                                    "leggings",
                                    LEGGINGS.find(
                                        (item) => item.id === event.target.value
                                    )!
                                );
                            }}
                            options={LEGGINGS}
                            value={lockedItems.leggings?.id}
                        />
                        <hr />
                        <div>
                            <b>Ignored Armor</b>
                            <button id="ignore-all" onClick={ignoreAll}>
                                Ignore All
                            </button>
                            <button id="restore-all" onClick={restoreAll}>
                                Restore All
                            </button>
                        </div>
                        <div>
                            <ul id="ignored-items">
                                {ignoredItems.map((item: Armor) => (
                                    <li key={item.id}>
                                        {item.name}
                                        <button
                                            onClick={() =>
                                                removeIgnoredItem(
                                                    ignoredItems.find(
                                                        (i) => i == item
                                                    )!
                                                )
                                            }
                                            style={{ backgroundColor: "green" }}
                                        >
                                            {" 🗑"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                    {/* <!-- sort --> */}
                    <article style={{ flexBasis: "60%", minWidth: "320px" }}>
                        <b>Results</b>
                        <div>
                            <table id="results">
                                {best.map((set: ArmorSet, i) => {
                                    return (
                                        <ArmorResultSet
                                            key={i}
                                            id={ARMOR_RESULTS_SET_IDS[i]}
                                            armorIds={[
                                                set.helmet?.id!,
                                                set.chestpiece?.id!,
                                                set.gauntlets?.id!,
                                                set.leggings?.id!,
                                            ]}
                                            armorNames={[
                                                set.helmet?.name!,
                                                set.chestpiece?.name!,
                                                set.gauntlets?.name!,
                                                set.leggings?.name!,
                                            ]}
                                            itemStats={[
                                                itemStatsToString(set.helmet!),
                                                itemStatsToString(
                                                    set.chestpiece!
                                                ),
                                                itemStatsToString(
                                                    set.gauntlets!
                                                ),
                                                itemStatsToString(
                                                    set.leggings!
                                                ),
                                            ]}
                                            setStats={setStatsToString(set)}
                                            addIgnoredItem={[
                                                () =>
                                                    addIgnoredItem(set.helmet!),
                                                () =>
                                                    addIgnoredItem(
                                                        set.chestpiece!
                                                    ),
                                                () =>
                                                    addIgnoredItem(
                                                        set.gauntlets!
                                                    ),
                                                () =>
                                                    addIgnoredItem(
                                                        set.leggings!
                                                    ),
                                            ]}
                                            hotkeys={hotkeyGroups[i]}
                                        />
                                    );
                                })}
                            </table>
                        </div>
                    </article>
                    <div>
                        <h2 style={{ textAlign: "center" }}>Ignoring Armor</h2>
                        <p>
                            Click the red "X" next to any armor piece to remove
                            it from the pool of armor being considered for
                            optimization. Some reasons you might do this
                            include:
                        </p>
                        <ul>
                            <li>You don't currently have the armor.</li>
                            <li>You don't like the way the armor looks.</li>
                            <li>You don't like the armor's stats.</li>
                        </ul>
                        <p>
                            Alternatively, each armor piece has a hotkey
                            associated with ignoring it. The hotkeys are the
                            keys on the top row of your QWERTY keyboard, from
                            backtick (`) to hyphen (-). Hover over any of the
                            red "X"s to see what its hotkey is.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
