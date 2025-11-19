import {
    getChildTokenGroups,
    marshallSortByToTokenGroups,
    SortByArmor,
} from "./sorting";

import type { JSX } from "react/jsx-runtime";

export default function FormulaField(props: {
    sortBy: SortByArmor;
}): JSX.Element {
    const marshalledFormula: string[][] = marshallSortByToTokenGroups(
        props.sortBy
    );
    const TAB = "    ";
    let tabs: number = 0;

    /**
     * Maps a token group to a string where each token is on a new line
     * with appropriate indentation based on the number of tabs.
     * If the token group contains only one token and the token includes
     * an open parenthesis, it will indent the token and increment the
     * number of tabs. If the token group contains only one token and the
     * token is a close parenthesis, it will unindent the token and
     * decrement the number of tabs. If the token group contains more than
     * one token, it will recursively call itself on each token group in the
     * child token groups and join the results together.
     * @param tokenGroup - a string array of tokens
     * @returns a string where each token is on a new line with appropriate indentation
     */
    function mapTokenGroupToLines(tokenGroup: string[]): string {
        // if length is 1, process the token
        if (tokenGroup.length === 1) {
            const token = tokenGroup[0];
            if (token.includes("(")) {
                const value = TAB.repeat(tabs) + token + "\n";
                tabs += 1;
                return value;
            } else if (token === ")") {
                tabs -= 1;
                return TAB.repeat(tabs) + token + "\n";
            } else {
                return TAB.repeat(tabs) + token + "\n";
            }
        }
        // else if length is greater than 1, process the token group recursively
        else {
            return getChildTokenGroups(tokenGroup)
                .map(mapTokenGroupToLines)
                .join("");
        }
    }

    return (
        <textarea
            id="formula"
            defaultValue={marshalledFormula
                .map((tokenGroup) => {
                    return mapTokenGroupToLines(tokenGroup);
                })
                .join("")}
            style={{
                width: "100%",
                backgroundColor: "var(--secondary)",
                color: "var(--contrast)",
            }}
            rows={20}
        />
    );
}
