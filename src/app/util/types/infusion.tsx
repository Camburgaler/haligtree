import AttackPowerTypeMap from "../interfaces/attackPowerTypeMap";
import StatMap from "../interfaces/statMap";

type Infusion = {
    [key: string]: {
        id: string;
        name: string;
        damageUpgradeRate: AttackPowerTypeMap<number[]>;
        statScalingRate: StatMap<number[]>;
    };
};

export default Infusion;
