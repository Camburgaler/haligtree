import {
    SORTBYBOSS_KEYS,
    SORTBYBOSS_MODES,
} from "@/app/armor/components/customSortBy/sorting";

function InputRadio(props: {
    id: string;
    onClick: React.ChangeEventHandler<HTMLInputElement>;
    name: string;
    value?: string | number | readonly string[];
    label: string;
    checked?: boolean;
    customizeFn?: () => void;
}): JSX.Element {
    const conditionalColor = props.checked
        ? "var(--accent)"
        : "var(--contrast)";

    return (
        <div>
            <div>
                <input
                    type="radio"
                    id={props.id}
                    onChange={props.onClick}
                    name={props.name}
                    value={props.value}
                    checked={props.checked}
                />
                <label
                    htmlFor={props.id}
                    style={{
                        color: conditionalColor,
                    }}
                >
                    {props.label}
                </label>{" "}
                {props.label == "Custom" && props.name == "sorting-order" ? (
                    <button onClick={props.customizeFn}>Customize</button>
                ) : null}
                {props.label == "Boss" && props.name == "sorting-order" ? (
                    <select itemType="text">
                        {SORTBYBOSS_KEYS.map((item: string) => (
                            <option key={item} value={item}>
                                {SORTBYBOSS_MODES[item].label}
                            </option>
                        ))}
                    </select>
                ) : null}
            </div>
        </div>
    );
}

export default InputRadio;
