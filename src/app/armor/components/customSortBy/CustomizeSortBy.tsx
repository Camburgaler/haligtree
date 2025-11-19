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
                            operations available:
                        </p>
                        <h3>Plain Parentheses</h3>
                        The parentheses will group things into one value. This
                        is useful for separating values when trying to ensure an
                        order of operations.
                        <p>Format:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            ( X )
                        </p>
                        <h3>Average</h3>
                        This will average all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        <p>Format:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            AVG( X X ... )
                        </p>
                        <h3>Summation</h3>
                        This will add all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        Subtraction can be achieved by providing a negative
                        value
                        <p>Format:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            SUM( X X ... )
                        </p>
                        <h3>Multiplication</h3>
                        This will multiply all space-separated values inside the
                        parentheses. Note that more than one value is required.
                        Division can be achieved by providing a value between -1
                        and 1.
                        <p>Format:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            MULT( X X ... )
                        </p>
                        <h3>Inversion</h3>
                        This will invert the value inside the parentheses. This
                        can be used to facilitate easy division and to make
                        division of variables possible.
                        <p>Format:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            INV( X )
                        </p>
                        <h3>Values</h3>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Physical Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            PHYSICAL
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Strike Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            STRIKE
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Slash Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            SLASH
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Pierce Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            PIERCE
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Magic Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            MAGIC
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Fire Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            FIRE
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Lightning Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            LIGHTNING
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Holy Absorption:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            HOLY
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Poison Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            POISON
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Scarlet Rot Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            SCARLETROT
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Hemorrhage Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            HEMORRHAGE
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Frostbite Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            FROSTBITE
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Sleep Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            SLEEP
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Madness Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            MADNESS
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Death Blight Resistance:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            DEATHBLIGHT
                        </p>
                        <p>
                            The following will use the value of an armor
                            piece&#39;s Poise:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            POISE
                        </p>
                        <h2>Examples</h2>
                        <p>The following will sum all Standard Absorptions:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            SUM( PHYSICAL STRIKE SLASH PIERCE )
                        </p>
                        <p>The following will average all Resistances:</p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            AVG( POISON SCARLETROT HEMORRHAGE FROSTBITE SLEEP
                            MADNESS DEATHBLIGHT )
                        </p>
                        <p>
                            The following will sum all Standard Absorptions and
                            then divide by Poise:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
                            MULT( SUM( PHYSICAL STRIKE SLASH PIERCE ) INV( POISE
                            ) )
                        </p>
                        <p>
                            The following will create a weighted sum of certain
                            Absorptions and Resistances:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                backgroundColor: "var(--secondary)",
                                color: "var(--contrast)",
                                padding: "5px",
                                borderRadius: "5px",
                                display: "inline-block",
                                margin: "5px",
                            }}
                        >
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
