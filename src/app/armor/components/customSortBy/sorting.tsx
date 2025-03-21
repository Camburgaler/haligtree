import { LOGGING } from "@/app/util/constants";
import { deepCloneAndMap, deepFreeze } from "@/app/util/script";
import Armor from "../../../util/types/armor";
import DefensesMap, { DefensesMapKey } from "../../../util/types/defensesMap";
import ResistancesMap, {
    ResistancesMapKey,
} from "../../../util/types/resistancesMap";
import { SortByGeneric } from "../../../util/types/sortBy";

const SORTING_LOGGING: boolean = LOGGING && true;

type SortByArmorModeKey =
    | "total"
    | "total-absorption"
    | "total-standard"
    | "total-elemental"
    | DefensesMapKey
    | "total-resistance"
    | ResistancesMapKey
    | "poise"
    | "custom";
export type SortByArmorKey =
    | "children"
    | "operation"
    | DefensesMapKey
    | ResistancesMapKey
    | "poise";
export type SortByArmor = SortByGeneric &
    DefensesMap<boolean> &
    ResistancesMap<boolean> & {
        poise: boolean;
        label: string;
    };

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
export const SELECTABLE_SORTING_FIELDS_ARRAY: string[] = [
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
] as const;
const SELECTABLE_SORTING_FIELDS_SET = new Set(SELECTABLE_SORTING_FIELDS_ARRAY);
export const SORTBYARMOR_MODES: { [K in SortByArmorModeKey]: SortByArmor } = {
    total: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Total of All Absorptions and Resistances" },
        { operation: "sum" },
        { physical: true },
        { strike: true },
        { slash: true },
        { pierce: true },
        { magic: true },
        { fire: true },
        { lightning: true },
        { holy: true },
        { poison: true },
        { "scarlet-rot": true },
        { hemorrhage: true },
        { frostbite: true },
        { sleep: true },
        { madness: true },
        { "death-blight": true },
    ]),
    "total-absorption": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Total of All Absorptions" },
        { operation: "sum" },
        { physical: true },
        { strike: true },
        { slash: true },
        { pierce: true },
        { magic: true },
        { fire: true },
        { lightning: true },
        { holy: true },
    ]),
    "total-standard": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Total of All Standard Absorptions" },
        { operation: "sum" },
        { physical: true },
        { strike: true },
        { slash: true },
        { pierce: true },
    ]),
    physical: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Physical Absorption" },
        { physical: true },
    ]),
    strike: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Strike Absorption" },
        { strike: true },
    ]),
    slash: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Slash Absorption" },
        { slash: true },
    ]),
    pierce: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Pierce Absorption" },
        { pierce: true },
    ]),
    "total-elemental": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Total of All Elemental Absorptions" },
        { operation: "sum" },
        { magic: true },
        { fire: true },
        { lightning: true },
        { holy: true },
    ]),
    magic: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Magic Absorption" },
        { magic: true },
    ]),
    fire: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Fire Absorption" },
        { fire: true },
    ]),
    lightning: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Lightning Absorption" },
        { lightning: true },
    ]),
    holy: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Holy Absorption" },
        { holy: true },
    ]),
    "total-resistance": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Total of All Resistances" },
        { operation: "sum" },
        { poison: true },
        { "scarlet-rot": true },
        { hemorrhage: true },
        { frostbite: true },
        { sleep: true },
        { madness: true },
        { "death-blight": true },
    ]),
    poison: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Poison Resistance" },
        { poison: true },
    ]),
    "scarlet-rot": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Scarlet Rot Resistance" },
        { "scarlet-rot": true },
    ]),
    hemorrhage: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Hemorrhage Resistance" },
        { hemorrhage: true },
    ]),
    frostbite: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Frostbite Resistance" },
        { frostbite: true },
    ]),
    sleep: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Sleep Resistance" },
        { sleep: true },
    ]),
    madness: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Madness Resistance" },
        { madness: true },
    ]),
    "death-blight": deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Death Blight Resistance" },
        { "death-blight": true },
    ]),
    poise: deepCloneAndMap(DEFAULT_SORTBYARMOR, [
        { label: "Poise" },
        { poise: true },
    ]),
    custom: deepCloneAndMap(DEFAULT_SORTBYARMOR, [{ label: "Custom" }]),
};
const VALID_TOKENS: string[] = [
    ...SELECTABLE_SORTING_FIELDS_ARRAY.map((f) => f.toUpperCase()),
    "SUM(",
    "AVG(",
    "MULT(",
    "(",
    ")",
];

function isSelectableSortingField(field: string): boolean {
    return SELECTABLE_SORTING_FIELDS_SET.has(field);
}

function countSelectedSortingFields(sortBy: SortByArmor): number {
    let count = 0;
    for (const key in sortBy) {
        if (isSelectableSortingField(key) && sortBy[key as SortByArmorKey])
            count += 1;
    }
    return count;
}

export function evaluateSortBy(
    sortBy: number | SortByArmor,
    armor: Armor
): number {
    const EVALUATESORTBY_LOGGING = SORTING_LOGGING && false;

    if (EVALUATESORTBY_LOGGING) console.log("evaluateSortBy");

    if (EVALUATESORTBY_LOGGING) console.log("sortBy: ", sortBy);
    if (EVALUATESORTBY_LOGGING) console.log("armor: ", armor);

    if (EVALUATESORTBY_LOGGING) console.log("typeof sortBy: ", typeof sortBy);

    if (typeof sortBy === "number") return sortBy;

    // errors
    const SELECTED_FIELDS_COUNT = countSelectedSortingFields(sortBy);
    const CHILDREN_COUNT = sortBy.children.length;
    if (EVALUATESORTBY_LOGGING)
        console.log(
            "selected fields: ",
            SELECTED_FIELDS_COUNT,
            "\nchildren: ",
            CHILDREN_COUNT
        );

    // if sum, average, or multiply is true, assert at least 2 values
    if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT < 2) {
        if (sortBy.operation === "sum") {
            throw new Error("Cannot have sum without at least 2 values");
        }
        if (sortBy.operation === "average") {
            throw new Error("Cannot have average without at least 2 values");
        }
        if (sortBy.operation === "multiply") {
            throw new Error("Cannot multiply without at least 2 values");
        }
    }

    // if operation is value, assert at most 1 value
    if (sortBy.operation === "value") {
        if (SELECTED_FIELDS_COUNT + CHILDREN_COUNT > 1) {
            throw new Error(
                "Cannot have more than 1 value without average or sum"
            );
        }
    }

    // evaluate children
    if (EVALUATESORTBY_LOGGING) console.log("children: ", sortBy.children);
    let childrenValues: number[] = [];
    for (const child of sortBy.children as SortByArmor[]) {
        childrenValues.push(evaluateSortBy(child, armor));
    }

    if (EVALUATESORTBY_LOGGING) console.log("operation: ", sortBy.operation);

    // if average is selected
    // average the children and every selected field
    let result: number = 0;
    if (sortBy.operation === "average") {
        let denominator = SELECTED_FIELDS_COUNT + CHILDREN_COUNT;
        let numerator = 0;

        // add children values to the numerator
        for (const value of childrenValues) {
            numerator += value;
        }

        if (EVALUATESORTBY_LOGGING && childrenValues.length > 0)
            console.log("sum of children: ", result);

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

                if (EVALUATESORTBY_LOGGING)
                    console.log(
                        "selected key: ",
                        key,
                        armor.defenses[key as DefensesMapKey]
                            ? "\ndefense: " +
                                  armor.defenses[key as DefensesMapKey]
                            : armor.resistances[key as ResistancesMapKey]
                            ? "\nresistance: " +
                              armor.resistances[key as ResistancesMapKey]
                            : "\npoise: " + armor.poise,
                        "\nnumerator: ",
                        numerator,
                        "\ndenominator: ",
                        denominator,
                        "\naverage: ",
                        numerator / denominator,
                        "\nresult: ",
                        result + numerator / denominator
                    );
            }
        }

        result += numerator / denominator;
        if (EVALUATESORTBY_LOGGING) console.log("average: ", result);
    }

    // else if sum is selected
    // sum the children and every selected field
    else if (sortBy.operation === "sum") {
        // add children values
        for (const value of childrenValues) {
            result += value;
        }

        if (EVALUATESORTBY_LOGGING && childrenValues.length > 0)
            console.log("sum of children: ", result);

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

                if (EVALUATESORTBY_LOGGING)
                    console.log(
                        "selected key: ",
                        key,
                        armor.defenses[key as DefensesMapKey]
                            ? "\ndefense: " +
                                  armor.defenses[key as DefensesMapKey]
                            : armor.resistances[key as ResistancesMapKey]
                            ? "\nresistance: " +
                              armor.resistances[key as ResistancesMapKey]
                            : "\npoise: " + armor.poise,
                        "\nresult: ",
                        result
                    );
            }
        }

        if (EVALUATESORTBY_LOGGING) console.log("sum: ", result);
    }

    // if neither average nor sum is selected
    // get the value of the selected field or child
    else {
        for (const key in sortBy) {
            // add children values
            for (const value of childrenValues) {
                result += value;
            }

            if (EVALUATESORTBY_LOGGING && childrenValues.length > 0)
                console.log("sum of children: ", result);

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

                if (EVALUATESORTBY_LOGGING)
                    console.log(
                        "selected key: ",
                        key,
                        armor.defenses[key as DefensesMapKey]
                            ? "\ndefense: " +
                                  armor.defenses[key as DefensesMapKey]
                            : armor.resistances[key as ResistancesMapKey]
                            ? "\nresistance: " +
                              armor.resistances[key as ResistancesMapKey]
                            : "\npoise: " + armor.poise,
                        "result: ",
                        result
                    );
            }
        }
    }

    if (EVALUATESORTBY_LOGGING)
        console.log("evalutaion complete for sortBy: ", sortBy);
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
    const MARSHALLSORTBYTOTOKENS_LOGGING = SORTING_LOGGING && false;

    let result: string[] = [];

    if (MARSHALLSORTBYTOTOKENS_LOGGING) console.log("sortBy: ", sortBy);
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
        case "value":
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
    const MARSHALLSORTBYTOTOKENGROUPS_LOGGING = SORTING_LOGGING && false;

    if (MARSHALLSORTBYTOTOKENGROUPS_LOGGING)
        console.log("marshallSortByToTokenGroups");
    if (MARSHALLSORTBYTOTOKENGROUPS_LOGGING) console.log("sortBy: ", sortBy);
    if (MARSHALLSORTBYTOTOKENGROUPS_LOGGING)
        console.log("marshallSortByToTokens: ", marshallSortByToTokens(sortBy));
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
    const ANALYZETOKENS_LOGGING = SORTING_LOGGING && false;

    if (ANALYZETOKENS_LOGGING) console.log("analyzing tokens: ", tokens);
    let tokenTypes: ("number" | "string" | "SortByArmor")[] = [];
    let parenthesisDepth: number = 0;
    let childrenTokenGroups: string[][] = [];
    let currentGroup: string[] = [];

    for (const token of tokens) {
        if (ANALYZETOKENS_LOGGING) console.log("token: ", token);
        if (token.includes("(")) {
            parenthesisDepth++;
        } else if (token.includes(")")) {
            parenthesisDepth--;
        }

        if (ANALYZETOKENS_LOGGING)
            console.log("parenthesis depth: ", parenthesisDepth);
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

    if (ANALYZETOKENS_LOGGING) console.log("token types: ", tokenTypes);
    if (ANALYZETOKENS_LOGGING)
        console.log("children token groups: ", childrenTokenGroups);
    return {
        tempTokenTypes: tokenTypes,
        tempChildrenTokenGroups: childrenTokenGroups,
    };
}

function getOperation(token: string): "average" | "sum" | "multiply" | "value" {
    switch (token) {
        case "AVG(":
            return "average";
        case "SUM(":
            return "sum";
        case "MULT(":
            return "multiply";
        case "(":
            return "value";
        default:
            throw new Error("Invalid operation: " + token);
    }
}

function getSelectedFields(
    tokens: string[],
    tokenTypes: string[]
): {
    fields: (DefensesMapKey | ResistancesMapKey | "poise")[];
    numbers: number[];
} {
    const GETSELECTEDFIELDS_LOGGING = SORTING_LOGGING && false;

    if (GETSELECTEDFIELDS_LOGGING) console.log("getSelectedFields");

    if (GETSELECTEDFIELDS_LOGGING)
        console.log("tokens: ", tokens, "\n", "tokenTypes: ", tokenTypes);
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

    if (GETSELECTEDFIELDS_LOGGING) console.log("result: ", result);

    return result;
}

function processUnmarshallTokens(tokens: string[]): SortByArmor {
    const PROCESSUNMARSHALLTOKENS_LOGGING = SORTING_LOGGING && false;

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("processing unmarshall tokens: ", tokens);

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("default sortbyarmor: ", DEFAULT_SORTBYARMOR);

    let result: SortByArmor = structuredClone(DEFAULT_SORTBYARMOR);

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("initial result: ", result);

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

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("token types: ", tokenTypes);
    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("child token groups: ", childTokenGroups);

    // determine the operation
    result.operation = getOperation(tokens[0]);

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("operation: ", result.operation);

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("result after operation: ", result);

    // determine which fields are selected
    const { fields, numbers } = getSelectedFields(tokens, tokenTypes);
    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("fields: ", fields, "\n", "numbers: ", numbers);
    for (const field of fields) {
        result[field] = true;
    }
    result.children.push(...numbers);

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("result after numbers: ", result);

    // if there are children, process them recursively
    for (const group of childTokenGroups) {
        if (group.length > 1) {
            const child = processUnmarshallTokens(group);
            if (PROCESSUNMARSHALLTOKENS_LOGGING)
                console.log("group", group, "\n", "child: ", child);
            result.children.push(child);
        }
    }

    if (PROCESSUNMARSHALLTOKENS_LOGGING)
        console.log("result after children: ", result);

    return result;
}

function validateTokens(tokens: string[]): void {
    const VALIDATETOKENS_LOGGING = SORTING_LOGGING && false;

    if (VALIDATETOKENS_LOGGING) console.log("validating tokens: ", tokens);

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
    if (VALIDATETOKENS_LOGGING)
        console.log(
            "selected fields: ",
            SELECTED_FIELDS_COUNT,
            "\nchildren: ",
            CHILDREN_COUNT
        );

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

    // if operation is value, assert at most 1 value
    if (tokens[0] === "(" && SELECTED_FIELDS_COUNT + CHILDREN_COUNT > 1) {
        throw new Error("Cannot have more than 1 value without average or sum");
    }

    for (const group of tokenGroups) {
        if (group.length > 1) {
            validateTokens(group);
        }
    }
}

export function unmarshallSortBy(sortBy: string): SortByArmor {
    const UNMARSHALLSORTBY_LOGGING = SORTING_LOGGING && false;

    if (UNMARSHALLSORTBY_LOGGING)
        console.log("unmarshalling sortBy: \n", sortBy);

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

    if (UNMARSHALLSORTBY_LOGGING) console.log("tokens: ", tokens);

    // validate
    validateTokens(tokens);

    return processUnmarshallTokens(tokens);
}
