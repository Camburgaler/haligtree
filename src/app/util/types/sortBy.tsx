export type SortByGeneric = {
    children: (number | SortByGeneric)[];
    operation: "value" | "sum" | "average" | "multiply";
};
