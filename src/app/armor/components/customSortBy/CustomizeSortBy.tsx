/* 
This file is to create a component that can be used by the user to create a custom sorting algorithm.
It should take up most of the space on the page.
It will overlay on top of the content normally on the page.
It will have a text field to enter a custom sorting algorithm.
It will have a button to submit the custom sorting algorithm.
It will have a button to cancel the custom sorting algorithm.
It will have a paragraph to explain the custom sorting algorithm.
*/

import { useState } from "react";
import {
    DEFAULT_SORTBYARMOR,
    marshallSortByToString,
    SortByArmor,
    SORTBYARMOR_MODES,
    SortByArmorKey,
    unmarshallSortBy,
} from "./sorting";

export function CustomizeSortBy(props: {
    closePopUp: () => void;
    setCustomSortBy: (newSortBy: SortByArmor) => void;
}) {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const [formula, setFormula] = useState<SortByArmor>({
        ...DEFAULT_SORTBYARMOR,
    });

    const updateFormula = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let key: string;
        let value: string | boolean;

        switch (e.target.value) {
            case "value":
            case "sum":
            case "average":
            case "multiply":
                key = "operation";
                value = e.target.value;
                break;
            default:
                key = e.target.value;
                value = !formula[key as SortByArmorKey];
                break;
        }

        setFormula({ ...formula, [key]: value });
    };

    const submitFormula = () => {
        console.log(
            "formula: ",
            (document.getElementById("formula") as HTMLTextAreaElement).value
        );
        props.setCustomSortBy(
            unmarshallSortBy(
                (document.getElementById("formula") as HTMLTextAreaElement)
                    .value
            )
        );
        props.closePopUp();
    };

    const cancelFormula = () => {
        props.closePopUp();
    };

    const formulaTextArea: JSX.Element = (
        <textarea
            defaultValue={marshallSortByToString(
                SORTBYARMOR_MODES["total-standard"]
            )}
            style={{
                width: "100%",
                backgroundColor: "var(--secondary)",
                color: "var(--contrast)",
            }}
            rows={5}
        />
    );

    return (
        <div
            style={{
                position: "fixed",
                flex: "1 1 100%",
                inset: 100,
                padding: "10px",
                backgroundColor: "var(--primary)",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                overflow: "auto",
            }}
        >
            <h2>Custom Sort</h2>
            <div>
                <button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "Hide Description" : "Show Description"}
                </button>
                {isExpanded && (
                    <div>
                        <h2 id="instructions">Instructions</h2>
                        <p>
                            In the text box below, you can create a formula for
                            your own custom sorting method! Here are the
                            commands available.
                        </p>
                        <ul>
                            <li>
                                ( X )
                                <ul>
                                    <li>
                                        The parentheses will group things into
                                        one value. This is useful for separating
                                        values when trying to ensure an order of
                                        operations.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                AVG( X, X, ... )
                                <ul>
                                    <li>
                                        This will average all comma-separated
                                        values inside the parentheses. Note that
                                        more than one value is required.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                SUM( X, X, ... )
                                <ul>
                                    <li>
                                        This will sum all comma-separated values
                                        inside the parentheses. Note that more
                                        than one value is required.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                MULT( X, X, ... )
                                <ul>
                                    <li>
                                        This will multiply all comma-separated
                                        values inside the parentheses. Note that
                                        more than one value is required.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                PHYSICAL
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Physical Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                STRIKE
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Strike Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                SLASH
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Slash Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                PIERCE
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Pierce Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                MAGIC
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Magic Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                FIRE
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Fire Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                LIGHTNING
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Lightning Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                HOLY
                                <ul>
                                    <li>
                                        This will use the value of an armor
                                        piece&#39;s Holy Absorption.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                POISON
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Poison Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                SCARLETROT
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Scarlet Rot Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                HEMORRHAGE
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Hemorrhage Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                FROSTBITE
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Frostbite Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                SLEEP
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Sleep Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                MADNESS
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Madness Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                DEATHBLIGHT
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Death Blight Resistance.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                POISE
                                <ul>
                                    <li>
                                        This will use the value of the armor
                                        piece&#39;s Poise.
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div>
                {/* <textarea
                    rows={10}
                    style={{
                        width: "100%",
                        color: "black",
                        fontFamily: "monospace",
                    }}
                    readOnly
                ></textarea> */}
                {/* <FormulaSelector
                    updateFormula={updateFormula}
                    sortBy={SORTBYARMOR_MODES["total-standard"]}
                /> */}
                <textarea
                    defaultValue={marshallSortByToString(
                        SORTBYARMOR_MODES["total-standard"]
                    )}
                    style={{
                        width: "100%",
                        backgroundColor: "var(--secondary)",
                        color: "var(--contrast)",
                    }}
                    rows={5}
                    id="formula"
                />
            </div>
            <div>
                <button onClick={submitFormula}>Submit</button>
                <button onClick={cancelFormula}>Cancel</button>
            </div>
        </div>
    );
}
