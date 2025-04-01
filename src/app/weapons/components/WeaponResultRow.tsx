import { INFUSION_IDS } from "@/app/util/constants";
import AttackPowerTypeMap from "@/app/util/types/attackPowerTypeMap";
import InfusionMap from "@/app/util/types/infusionMap";
import { TableDataWithHover } from "@/app/weapons/components/TableDataWithHover";
import { useState } from "react";

const DEFAULT_INFUSION_MAP: InfusionMap<number> = {
    standard: 0,
    heavy: 0,
    keen: 0,
    quality: 0,
    fire: 0,
    "flame-art": 0,
    lightning: 0,
    sacred: 0,
    magic: 0,
    cold: 0,
    poison: 0,
    blood: 0,
    occult: 0,
    unique: 0,
};

export function WeaponResultRow(props: {
    weaponName: string;
    attackRatings: InfusionMap<number>;
    max: number;
    arBreakdown: InfusionMap<{
        baseDmg: AttackPowerTypeMap<number>;
        scalingDmg: AttackPowerTypeMap<number>;
    }>;
    rank: number;
}) {
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
                    max={props.max ?? 0}
                    data={props.arBreakdown[infId]! ?? DEFAULT_INFUSION_MAP}
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
