import { deepFreeze } from "@/app/util/script";
import Armor from "@/app/util/types/armor";
import DefensesMap, { DefensesMapKey } from "@/app/util/types/defensesMap";
import ResistancesMap, {
    ResistancesMapKey,
} from "@/app/util/types/resistancesMap";
import { SortByGeneric } from "@/app/util/types/sortBy";

/**
 * SortByArmorKey is a type that represents a key for a SortByArmor object.
 */
export type SortByArmorKey =
    | "children"
    | "operation"
    | DefensesMapKey
    | ResistancesMapKey
    | "poise";

/**
 * SortByArmor is a type that represents a SortByGeneric object for Armor.
 *
 * It extends the SortByGeneric type with the DefensesMap and ResistancesMap types.
 *
 * It also includes a boolean for poise and a string for label.
 */
export type SortByArmor = SortByGeneric &
    DefensesMap<boolean> &
    ResistancesMap<boolean> & {
        poise: boolean;
        label: string;
    };

/**
 * DEFAULT_SORTBYARMOR is the default SortByArmor object.
 */
export const DEFAULT_SORTBYARMOR: SortByArmor = deepFreeze({
    label: "Default",
    children: [],
    operation: "value",
    physical: false,
    strike: false,
    slash: false,
    pierce: false,
    magic: false,
    fire: false,
    lightning: false,
    holy: false,
    poison: false,
    "scarlet-rot": false,
    hemorrhage: false,
    frostbite: false,
    sleep: false,
    madness: false,
    "death-blight": false,
    poise: false,
});

/**
 * SELECTABLE_SORTING_FIELDS_SET is a Set of all selectable sorting fields.
 */
const SELECTABLE_SORTING_FIELDS_SET = new Set([
    "physical",
    "strike",
    "slash",
    "pierce",
    "magic",
    "fire",
    "lightning",
    "holy",
    "poison",
    "scarlet-rot",
    "hemorrhage",
    "frostbite",
    "sleep",
    "madness",
    "death-blight",
    "poise",
]);

/**
 * VALID_TOKENS is an array of all valid tokens for sorting.
 */
const VALID_TOKENS: string[] = [
    ...Array.from(SELECTABLE_SORTING_FIELDS_SET.values()).map((f) =>
        f.toUpperCase()
    ),
    "SUM(",
    "AVG(",
    "MULT(",
    "INV(",
    "(",
    ")",
];

/**
 * Returns true if the given field is a valid sorting field. E.g. "physical", "strike", "slash", etc.
 * @param {string} field - The field to check.
 * @returns {boolean} True if the field is a valid sorting field, false otherwise.
 */
function isSelectableSortingField(field: string): boolean {
    return SELECTABLE_SORTING_FIELDS_SET.has(field);
}

/**
 * Returns the number of selected sorting fields in the given SortByArmor object.
 *
 * A field is considered selected if it is a valid sorting field and its value is true.
 *
 * @param {SortByArmor} sortBy - The SortByArmor object to count the selected fields of.
 * @returns {number} The number of selected sorting fields.
 */
function countSelectedSortingFields(sortBy: SortByArmor): number {
    let count = 0;
    for (const key in sortBy) {
        if (isSelectableSortingField(key) && sortBy[key as SortByArmorKey])
            count += 1;
    }
    return count;
}

/**
 * Evaluates the given sort by object on the given armor object.
 *
 * If the sort by object is a number, it is returned as is.
 *
 * If the sort by object is an object, it is evaluated as follows:
 * If the operation is "average", the children and every selected field are averaged together.
 * If the operation is "sum", the children and every selected field are summed together.
 * If the operation is "multiply", the children and every selected field are multiplied together.
 * If the operation is "invert", the provided value is inverted.
 * If the operation is not one of the above, the value of the selected field or child is returned.
 *
 * @param {number | SortByArmor} sortBy - The SortBy object to evaluate.
 * @param {Armor} armor - The armor object to evaluate on.
 * @returns {number} The result of the evaluation.
 * @throws {Error} If there is an error in the evaluation.
 */
export function evaluateSortBy(
    sortBy: number | SortByArmor,
    armor: Armor
): number {
    if (typeof sortBy === "number") return sortBy;

    /** A count of the number of selected fields */
    const SELECTED_FIELDS_COUNT: number = countSelectedSortingFields(sortBy);
    /** A count of the number of children */
    const CHILDREN_COUNT: number = sortBy.children.length;

    // evaluate children
    let childrenValues: number[] = [];
    for (const child of sortBy.children as SortByArmor[]) {
        childrenValues.push(evaluateSortBy(child, armor));
    }

    // if average is selected
    // average the children and every selected field
    let result: number = 0;
    if (sortBy.operation === "average") {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT < 2) {
            throw new Error("Cannot have average without at least 2 values");
        }

        let denominator = SELECTED_FIELDS_COUNT + CHILDREN_COUNT;
        let numerator = 0;

        // add children values to the numerator
        for (const value of childrenValues) {
            numerator += value;
        }

        // add selected field values to the numerator
        for (const key in sortBy) {
            if (
                isSelectableSortingField(key) &&
                sortBy[key as SortByArmorKey]
            ) {
                // if defense
                if (armor.defenses[key as DefensesMapKey]) {
                    numerator += armor.defenses[key as DefensesMapKey]!;
                }
                // if resistance
                if (armor.resistances[key as ResistancesMapKey]) {
                    numerator += armor.resistances[key as ResistancesMapKey]!;
                }
                // if poise
                if (key === "poise") {
                    numerator += armor.poise!;
                }
            }
        }

        result += numerator / denominator;
    }

    // else if sum is selected
    // sum the children and every selected field
    else if (sortBy.operation === "sum") {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT < 2) {
            throw new Error("Cannot have sum without at least 2 values");
        }

        // add children values
        for (const value of childrenValues) {
            result += value;
        }

        // add selected field values
        for (const key in sortBy) {
            if (
                isSelectableSortingField(key) &&
                sortBy[key as SortByArmorKey]
            ) {
                // if defense
                if (armor.defenses[key as DefensesMapKey]) {
                    result += armor.defenses[key as DefensesMapKey]!;
                }
                // if resistance
                if (armor.resistances[key as ResistancesMapKey]) {
                    result += armor.resistances[key as ResistancesMapKey]!;
                }
                // if poise
                if (key === "poise") {
                    result += armor.poise!;
                }
            }
        }
    }

    // else if multiply is selected
    // multiply the children and every selected field
    else if (sortBy.operation === "multiply") {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT < 2) {
            throw new Error("Cannot multiply without at least 2 values");
        }

        let factor = 1;

        // multiply children values
        for (const value of childrenValues) {
            factor *= value;
        }

        // add selected field values
        for (const key in sortBy) {
            if (
                isSelectableSortingField(key) &&
                sortBy[key as SortByArmorKey]
            ) {
                // if defense
                if (armor.defenses[key as DefensesMapKey]) {
                    factor *= armor.defenses[key as DefensesMapKey]!;
                }
                // if resistance
                if (armor.resistances[key as ResistancesMapKey]) {
                    factor *= armor.resistances[key as ResistancesMapKey]!;
                }
                // if poise
                if (key === "poise") {
                    factor *= armor.poise!;
                }
            }
        }

        result = factor;
    }

    // else if invert is selected
    // invert the provided value
    else if (sortBy.operation === "invert") {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT !== 1) {
            throw new Error("Invert requires exactly 1 value");
        }

        // set inverted child value
        if (childrenValues[0]) {
            result = 1 / childrenValues[0];
        }

        for (const key in sortBy) {
            if (
                isSelectableSortingField(key) &&
                sortBy[key as SortByArmorKey]
            ) {
                // if defense
                if (armor.defenses[key as DefensesMapKey]) {
                    result = 1 / armor.defenses[key as DefensesMapKey]!;
                }
                // if resistance
                if (armor.resistances[key as ResistancesMapKey]) {
                    result = 1 / armor.resistances[key as ResistancesMapKey]!;
                }
                // if poise
                if (key === "poise") {
                    result = 1 / armor.poise!;
                }
            }
        }
    }

    // if average nor sum nor multiply is selected
    // get the value of the selected field or child
    else {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT > 1) {
            throw new Error(
                "Cannot have more than 1 value without average, sum, or multiply"
            );
        }

        // return child value
        if (childrenValues[0]) {
            result = childrenValues[0];
        }

        for (const key in sortBy) {
            if (
                isSelectableSortingField(key) &&
                sortBy[key as SortByArmorKey]
            ) {
                // if defense
                if (armor.defenses[key as DefensesMapKey]) {
                    result = armor.defenses[key as DefensesMapKey]!;
                }
                // if resistance
                if (armor.resistances[key as ResistancesMapKey]) {
                    result = armor.resistances[key as ResistancesMapKey]!;
                }
                // if poise
                if (key === "poise") {
                    result = armor.poise!;
                }
            }
        }
    }

    return result;
}

export function getChildTokenGroups(tokens: string[]): string[][] {
    const {
        tempTokenTypes: tokenTypes,
        tempChildrenTokenGroups: childrenTokenGroups,
    } = analyzeTokens(tokens);

    return childrenTokenGroups;
}

export function marshallSortByToTokens(sortBy: SortByArmor): string[] {
    let result: string[] = [];

    switch (sortBy.operation) {
        case "average":
            result.push("AVG(");
            break;
        case "sum":
            result.push("SUM(");
            break;
        case "multiply":
            result.push("MULT(");
            break;
        case "invert":
            result.push("INV(");
            break;
        default:
            result.push("(");
            break;
    }

    for (const child of sortBy.children as (number | SortByArmor)[]) {
        if (typeof child === "number") {
            result.push(child.toString());
        } else {
            result.push(...marshallSortByToTokens(child));
        }
    }

    for (const key in sortBy) {
        if (isSelectableSortingField(key) && sortBy[key as SortByArmorKey]) {
            result.push(key.toUpperCase());
        }
    }

    result.push(")");

    return result;
}

export function marshallSortByToTokenGroups(sortBy: SortByArmor): string[][] {
    return getChildTokenGroups(marshallSortByToTokens(sortBy));
}

export function marshallSortByToString(sortBy: SortByArmor): string {
    return marshallSortByToTokens(sortBy).join(" ");
}

function parenthesesMatch(tokens: string[]): boolean {
    return (
        tokens.reduce(
            (count: number, token: string) =>
                count + (token.includes("(") ? 1 : 0),
            0
        ) ===
        tokens.reduce(
            (count: number, token: string) =>
                count + (token.includes(")") ? 1 : 0),
            0
        )
    );
}

function tokenIsValid(token: string): boolean {
    return VALID_TOKENS.includes(token) || !isNaN(Number(token));
}

export function analyzeTokens(tokens: string[]): {
    tempTokenTypes: ("number" | "string" | "SortByArmor")[];
    tempChildrenTokenGroups: string[][];
} {
    let tokenTypes: ("number" | "string" | "SortByArmor")[] = [];
    let parenthesisDepth: number = 0;
    let childrenTokenGroups: string[][] = [];
    let currentGroup: string[] = [];

    for (const token of tokens) {
        if (token.includes("(")) {
            parenthesisDepth++;
        } else if (token.includes(")")) {
            parenthesisDepth--;
        }

        if (parenthesisDepth === 0) {
            tokenTypes.push("string");
            currentGroup.push(token);
            childrenTokenGroups.push(currentGroup);
            currentGroup = [];
        }
        if (parenthesisDepth === 1) {
            if (token.includes(")")) {
                tokenTypes.push("SortByArmor");
                currentGroup.push(token);
                childrenTokenGroups.push(currentGroup);
                currentGroup = [];
            } else if (!isNaN(Number(token))) {
                tokenTypes.push("number");
                currentGroup.push(token);
                childrenTokenGroups.push(currentGroup);
                currentGroup = [];
            } else {
                tokenTypes.push("string");
                currentGroup.push(token);
                childrenTokenGroups.push(currentGroup);
                currentGroup = [];
            }
        } else if (parenthesisDepth > 1) {
            tokenTypes.push("SortByArmor");
            currentGroup.push(token);
        }
    }

    return {
        tempTokenTypes: tokenTypes,
        tempChildrenTokenGroups: childrenTokenGroups,
    };
}

function getOperation(
    token: string
): "average" | "sum" | "multiply" | "invert" | "value" {
    switch (token) {
        case "AVG(":
            return "average";
        case "SUM(":
            return "sum";
        case "MULT(":
            return "multiply";
        case "INV(":
            return "invert";
        default:
            return "value";
    }
}

function getSelectedFields(
    tokens: string[],
    tokenTypes: string[]
): {
    fields: (DefensesMapKey | ResistancesMapKey | "poise")[];
    numbers: number[];
} {
    let fields: (DefensesMapKey | ResistancesMapKey | "poise")[] = [];
    let numbers: number[] = [];
    for (let i = 1; i < tokens.length - 1; i++) {
        if (tokenTypes[i] === "number") {
            numbers.push(Number(tokens[i]));
        } else if (tokenTypes[i] === "string") {
            fields.push(
                tokens[i].toLowerCase() as
                    | DefensesMapKey
                    | ResistancesMapKey
                    | "poise"
            );
        }
    }

    const result = { fields: fields, numbers: numbers };

    return result;
}

function processUnmarshallTokens(tokens: string[]): SortByArmor {
    let result: SortByArmor = structuredClone(DEFAULT_SORTBYARMOR);

    // if the first token is not an opening parenthesis, or the last token is not a closing parenthesis, throw an error
    if (!tokens[0].includes("(") || !tokens[tokens.length - 1].includes(")")) {
        throw new Error("Missing opening and/or closing parenthesis");
    }

    // if the number of opening and closing parentheses do not match, throw an error
    if (!parenthesesMatch(tokens)) {
        throw new Error("Parentheses do not match");
    }

    // if any token is not valid, throw an error
    for (const token of tokens) {
        if (!tokenIsValid(token)) {
            throw new Error("Invalid token: " + token);
        }
    }

    // map each token to its type (number, selectable field, or SortByArmor object)
    // also group the tokens into child SortByArmor objects
    const {
        tempTokenTypes: tokenTypes,
        tempChildrenTokenGroups: childTokenGroups,
    } = analyzeTokens(tokens);

    // determine the operation
    result.operation = getOperation(tokens[0]);

    // determine which fields are selected
    const { fields, numbers } = getSelectedFields(tokens, tokenTypes);
    for (const field of fields) {
        result[field] = true;
    }
    result.children.push(...numbers);

    // if there are children, process them recursively
    for (const group of childTokenGroups) {
        if (group.length > 1) {
            const child = processUnmarshallTokens(group);
            result.children.push(child);
        }
    }

    return result;
}

function validateTokens(tokens: string[]): void {
    const tokenGroups: string[][] = getChildTokenGroups(tokens);

    // errors
    const SELECTED_FIELDS_COUNT = tokenGroups.filter(
        (group) =>
            group.length === 1 &&
            !group[0].includes("(") &&
            !group[0].includes(")")
    ).length;
    const CHILDREN_COUNT = tokenGroups.filter(
        (group) => group.length > 1
    ).length;

    // if sum, average, or multiply is true, assert at least 2 values
    if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT < 2) {
        if (tokens[0].includes("SUM")) {
            throw new Error("Cannot have sum without at least 2 values");
        }
        if (tokens[0].includes("AVG")) {
            throw new Error("Cannot have average without at least 2 values");
        }
        if (tokens[0].includes("MULT")) {
            throw new Error("Cannot multiply without at least 2 values");
        }
    }

    // if operation is value or invert, assert at most 1 value
    if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT !== 1) {
        if (tokens[0].includes("INV")) {
            throw new Error("Must have exactly one value in invert operation");
        } else if (tokens[0] === "(") {
            throw new Error("Must have exactly one value in plain parentheses");
        }
    }

    for (const group of tokenGroups) {
        if (group.length > 1) {
            validateTokens(group);
        }
    }
}

export function unmarshallSortBy(sortBy: string): SortByArmor {
    // tokenize the string
    const tokens: string[] = sortBy
        .split(RegExp("[\n\r ]"))
        .filter((token) => token !== "");

    // remove any returns and tabs
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = tokens[i]
            .replace(/\n/g, "")
            .replace(/\r/g, "")
            .replace(/\t/g, "")
            .trim();
    }

    // remove any commas
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = tokens[i].replace(",", "");
    }

    // validate
    validateTokens(tokens);

    return processUnmarshallTokens(tokens);
}
