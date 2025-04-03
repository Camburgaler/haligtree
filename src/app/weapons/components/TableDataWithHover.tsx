import {
    ATTACK_POWER_TYPE_ID_TO_NAME,
    INFUSION_ID_TO_NAME,
} from "@/app/util/constants";
import AttackPowerTypeMap, {
    AttackPowerTypeMapKey,
} from "@/app/util/types/attackPowerTypeMap";
import { Dispatch, SetStateAction, useState } from "react";
import { JSX } from "react/jsx-runtime";

export function TableDataWithHover(props: {
    attackRating: number;
    max: number;
    data: {
        baseDmg: AttackPowerTypeMap<number>;
        scalingDmg: AttackPowerTypeMap<number>;
    };
    style?: React.CSSProperties;
    infId: string;
    rowHighlighted: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
    const [hoveredCell, setHoveredCell] = useState<string>("");
    const [cardPosition, setCardPosition] = useState({
        top: 0,
        left: 0,
    });
    const cardWidth = 200;

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredCell(props.attackRating.toString());
        setCardPosition({
            top: rect.top + window.scrollY, // to account for any scrolling
            left: rect.left - cardWidth - 10, // slightly offset from the cell
        });
        e.currentTarget.style.fontWeight = "bold";
        props.rowHighlighted(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
        setHoveredCell("");
        props.rowHighlighted(false);
        e.currentTarget.style.fontWeight = "normal";
    };

    const renderData = (dmgType: AttackPowerTypeMapKey) => {
        switch (dmgType) {
            case "bleed":
            case "poison":
            case "frost":
            case "scarlet-rot":
            case "madness":
            case "sleep":
                return (
                    <td colSpan={2}>
                        {Math.floor(
                            props.data.baseDmg[dmgType]! +
                                props.data.scalingDmg[dmgType]!
                        )}
                    </td>
                );
            default:
                return (
                    <>
                        <td>{props.data.baseDmg[dmgType]?.toFixed(1)}</td>
                        <td>
                            {props.data.scalingDmg[dmgType]! >= 0 ? "+" : ""}
                            {props.data.scalingDmg[dmgType]?.toFixed(1)}
                        </td>
                    </>
                );
        }
    };

    return (
        <td
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseOut={handleMouseLeave}
            style={props.style}
        >
            {props.attackRating != 0
                ? Math.floor(props.attackRating)?.toString()
                : "-"}

            {hoveredCell && props.attackRating != 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: `${cardPosition.top}px`,
                        left: `${cardPosition.left}px`,
                        padding: "10px",
                        backgroundColor: "var(--primary)",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        width: `${cardWidth}px`,
                    }}
                    onMouseEnter={() => {
                        setHoveredCell("");
                    }}
                >
                    <h4>{INFUSION_ID_TO_NAME[props.infId]} Breakdown</h4>
                    <table>
                        <tbody>
                            {(
                                Object.keys(
                                    props.data.baseDmg
                                ) as AttackPowerTypeMapKey[]
                            ).map(
                                (dmgType: AttackPowerTypeMapKey, i: number) => (
                                    <tr
                                        key={i}
                                        style={{ fontWeight: "normal" }}
                                    >
                                        <td>
                                            {
                                                ATTACK_POWER_TYPE_ID_TO_NAME[
                                                    dmgType
                                                ]
                                            }
                                        </td>
                                        {renderData(dmgType)}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </td>
    );
}
