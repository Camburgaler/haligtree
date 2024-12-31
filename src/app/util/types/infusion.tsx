import AttackPowerTypeMap from "../interfaces/attackPowerTypeMap";
import StatMap from "../interfaces/statMap";

type SlopeIntercept = {
    slope: number;
    intercept: number;
};

export type InfusionData = {
    id: string;
    name: string;
    damageUpgradeRate: AttackPowerTypeMap<SlopeIntercept>;
    statScalingRate: StatMap<number[]>;
};

type Infusion = {
    [key: string]: InfusionData;
};

export default Infusion;
