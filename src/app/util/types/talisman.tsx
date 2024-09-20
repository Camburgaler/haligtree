import StatMap from "../interfaces/statMap";
import Equippable from "./equippable";

interface Multipliers {
    maxHp: number;
    maxFp: number;
    maxStamina: number;
    equipLoad: number;
}

type Talisman = Equippable & {
    weight: string;
    stats: StatMap;
    multipliers: Multipliers;
};

export default Talisman;
