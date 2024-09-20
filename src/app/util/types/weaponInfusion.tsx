import DamageTypeMap from "../interfaces/damageTypeMap";
import StatMap from "../interfaces/statMap";

type WeaponInfusion = {
    id: string;
    damage: DamageTypeMap<number>;
    scaling: StatMap;
    aux: { [key: string]: [number, number] };
    masks: DamageTypeMap<StatMap>;
    corrections: DamageTypeMap<string>;
    buffable: boolean;
};

export default WeaponInfusion;
