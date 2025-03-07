import { marshallSortByToString, SortByArmor } from "./sorting";

export default function FormulaSelector(props: {
    updateFormula: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    sortBy: SortByArmor;
}): JSX.Element {
    const marshalledFormula: string = marshallSortByToString(props.sortBy);
    console.log("marshalled formula: ", marshalledFormula);
    return (
        <textarea
            defaultValue={marshalledFormula}
            style={{
                width: "100%",
                backgroundColor: "var(--secondary)",
                color: "var(--contrast)",
            }}
            rows={5}
        />
    );
}
