import { useState } from "react";
import FormulaField from "./FormulaField";
import { SortByArmor, unmarshallSortBy } from "./sorting";

export function CustomizeSortBy(props: {
    closePopUp: () => void;
    setCustomSortBy: (newSortBy: SortByArmor) => void;
    sortBy: SortByArmor;
}) {
    /**
     * Whether the description is expanded
     */
    const [descriptionIsExpanded, setDescriptionIsExpanded] =
        useState<boolean>(true);

    /**
     * Submits the formula currently in the FormulaField, and sets the submitted formula as the new SortByArmor.
     * If there is an error in the submission, it will be logged to the console.
     * After successful submission, it will call props.setCustomSortBy with the submitted SortByArmor and call props.closePopUp to close the popup.
     */
    const submitFormula = () => {
        let submittedSortBy: SortByArmor;
        try {
            const formula = (
                document.getElementById("formula") as HTMLTextAreaElement
            ).value;
            submittedSortBy = unmarshallSortBy(formula);
        } catch (error) {
            console.error(error);
            alert(error);
            return;
        }
        submittedSortBy.label = "Custom";
        props.setCustomSortBy(submittedSortBy);
        props.closePopUp();
    };

    const cancelFormula = () => {
        props.closePopUp();
    };

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
            <div>
                <h2>Custom Sort</h2>
                <div>
                    <FormulaField sortBy={props.sortBy} />
                </div>
                <div>
                    <button onClick={submitFormula}>Submit</button>
                    <button onClick={cancelFormula}>Cancel</button>
                </div>
                <div>
                    <button
                        id="descriptionToggle"
                        onClick={() =>
                            setDescriptionIsExpanded(!descriptionIsExpanded)
                        }
                    >
                        {descriptionIsExpanded
                            ? "Hide Description"
                            : "Show Description"}
                    </button>
                    <div
                        style={{
                            visibility: descriptionIsExpanded
                                ? "visible"
                                : "hidden",
                        }}
                        id="description"
                    >
                        <h2>Instructions</h2>
                        <p>
                            In the text box above, you can create a formula for
                            your own custom sorting method! Here are the
                            commands available:
                        </p>
                        <h3>( X )</h3>
                        The parentheses will group things into one value. This
                        is useful for separating values when trying to ensure an
                        order of operations.
                        <h3>AVG( X X ... )</h3>
                        This will average all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        <h3>SUM( X X ... )</h3>
                        This will sum all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        Subtraction can be achieved by providing a negative
                        value
                        <h3>MULT( X X ... )</h3>
                        This will multiply all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        Division can be achieved by providing a value between -1
                        and 1.
                        <h3>INV( X )</h3>
                        This will invert the value inside the parentheses. This
                        can be used to facilitate easy division and to make
                        division of variables possible.
                        <h3>PHYSICAL</h3>
                        This will use the value of an armor piece&#39;s Physical
                        Absorption.
                        <h3>STRIKE</h3>
                        This will use the value of an armor piece&#39;s Strike
                        Absorption.
                        <h3>SLASH</h3>
                        This will use the value of an armor piece&#39;s Slash
                        Absorption.
                        <h3>PIERCE</h3>
                        This will use the value of an armor piece&#39;s Pierce
                        Absorption.
                        <h3>MAGIC</h3>
                        This will use the value of an armor piece&#39;s Magic
                        Absorption.
                        <h3>FIRE</h3>
                        This will use the value of an armor piece&#39;s Fire
                        Absorption.
                        <h3>LIGHTNING</h3>
                        This will use the value of an armor piece&#39;s
                        Lightning Absorption.
                        <h3>HOLY</h3>
                        This will use the value of an armor piece&#39;s Holy
                        Absorption.
                        <h3>POISON</h3>
                        This will use the value of the armor piece&#39;s Poison
                        Resistance.
                        <h3>SCARLETROT</h3>
                        This will use the value of the armor piece&#39;s Scarlet
                        Rot Resistance.
                        <h3>HEMORRHAGE</h3>
                        This will use the value of the armor piece&#39;s
                        Hemorrhage Resistance.
                        <h3>FROSTBITE</h3>
                        This will use the value of the armor piece&#39;s
                        Frostbite Resistance.
                        <h3>SLEEP</h3>
                        This will use the value of the armor piece&#39;s Sleep
                        Resistance.
                        <h3>MADNESS</h3>
                        This will use the value of the armor piece&#39;s Madness
                        Resistance.
                        <h3>DEATHBLIGHT</h3>
                        This will use the value of the armor piece&#39;s Death
                        Blight Resistance.
                        <h3>POISE</h3>
                        This will use the value of the armor piece&#39;s Poise.
                        <h2>Examples</h2>
                        The following will sum all Standard Absorptions:
                        <p style={{ fontFamily: "monospace" }}>
                            SUM( PHYSICAL STRIKE SLASH PIERCE )
                        </p>
                        The following will average all Resistances:
                        <p style={{ fontFamily: "monospace" }}>
                            AVG( POISON SCARLETROT HEMORRHAGE FROSTBITE SLEEP
                            MADNESS DEATHBLIGHT )
                        </p>
                        The following will sum all Standard Absorptions and then
                        divide by Poise:
                        <p style={{ fontFamily: "monospace" }}>
                            MULT( SUM( PHYSICAL STRIKE SLASH PIERCE ) INV( POISE
                            ) )
                        </p>
                        The following will create a weighted sum of certain
                        Absorptions and Resistances:
                        <p style={{ fontFamily: "monospace" }}>
                            SUM( MULT( INV( 3 ) SUM( PHYSICAL PIERCE ) ) MULT(
                            INV( 3 ) SUM( MAGIC FIRE HEMORRHAGE ) ) MULT( INV( 3
                            ) HOLY ) )
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
