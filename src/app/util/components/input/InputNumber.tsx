function InputNumber(props: {
    id: string;
    label: string;
    className: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    value: number;
    name: string | undefined;
    disabled?: boolean;
}): JSX.Element {
    return (
        <div>
            <label htmlFor={props.id}>{props?.label}</label>
            <input
                style={{
                    maxWidth: "50px",
                    minWidth: "24px",
                    minHeight: "24px",
                }}
                className={props?.className}
                id={props.id}
                type="number"
                onChange={props?.onChange}
                min="0"
                step="0.1"
                value={props.value}
                name={props?.name}
                lang="en"
                disabled={props.disabled}
            />
        </div>
    );
}

export default InputNumber;
