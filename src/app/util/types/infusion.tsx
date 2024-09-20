import DamageTypeMap from "../interfaces/damageTypeMap";
import StatMap from "../interfaces/statMap";

type Infusion = {
    [key: string]: {
        id: string;
        name: string;
        damage: DamageTypeMap<number>;
        upgrade: DamageTypeMap<number>;
        scaling: StatMap;
        growth: StatMap;
    };
};

export default Infusion;
