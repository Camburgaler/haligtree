import {
    DEFAULT_INFUSION_MAP_NUMBER,
    INFUSION_IDS,
} from "@/app/util/constants";
import AttackPowerTypeMap from "@/app/util/types/attackPowerTypeMap";
import InfusionMap from "@/app/util/types/infusionMap";
import { TableDataWithHover } from "@/app/weapons/components/TableDataWithHover";
import { useState } from "react";
import { JSX } from "react/jsx-runtime";

export function WeaponResultRow(props: {
    weaponName: string;
    attackRatings: InfusionMap<number>;
    max: number;
    arBreakdown: InfusionMap<{
        baseDmg: AttackPowerTypeMap<number>;
        scalingDmg: AttackPowerTypeMap<number>;
    }>;
    rank: number;
}): JSX.Element {
    const [highlighted, setHighlighted] = useState(false);

    return (
        <tr
            style={{
                backgroundColor: highlighted ? `rgba(255, 255, 255, 0.1)` : "",
            }}
        >
            <td>{props.rank}</td>
            <td>
                <a
                    target="_blank"
                    href={
                        "https://eldenring.wiki.fextralife.com/" +
                        props.weaponName.replaceAll(" ", "+")
                    }
                >
                    {props.weaponName}
                </a>
            </td>
            <td>{Math.floor(props.max).toString()}</td>
            {INFUSION_IDS.filter((i) => i != "unique").map((infId) => (
                <TableDataWithHover
                    key={infId}
                    attackRating={props.attackRatings[infId]! ?? 0}
                    max={props.max}
                    data={
                        props.arBreakdown[infId]! ?? DEFAULT_INFUSION_MAP_NUMBER
                    }
                    style={
                        props.attackRatings[infId] == props.max &&
                        props.attackRatings[infId] != undefined
                            ? { color: "var(--accent)" }
                            : {}
                    }
                    infId={infId}
                    rowHighlighted={setHighlighted}
                />
            ))}
        </tr>
    );
}
